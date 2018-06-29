import json
import zipfile
import sys
import traceback
import os.path
import compose
from shutil import make_archive
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.http import HttpResponse
from django.http import JsonResponse
from distlib.index import PackageIndex
from wsgiref.util import FileWrapper
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from .core import utils
from .core.mycompose import MyCompose

PROJECT_DIR = "/home/dido/code/DockerAnalyserUI/DockerAnalyser/"
PATH_TOSAVE_DEPLOY_PACKAGE = "{}/data/examples".format(PROJECT_DIR)
DEFAULT_DEPLOY_PACKAGE = "default-deploy-package"

PROJECT_NAME = "docker-analyser"

# file_compose="docker-analyser.json"
# mycompose = MyCompose(project_name=PROJECT_NAME, project_dir=PROJECT_DIR)
mycompose = MyCompose(project_name=PROJECT_NAME,
                      project_dir=settings.DOCKER_ANALYSER_DIR)


@csrf_exempt
def upload(request):
    key = "deploy-package"
    if request.method == 'POST':
        # POST /upload:
        #    deploy-package : DEPLOY-PACKAGE.zip
        if key not in request.FILES:
            return JsonResponse({"err": 0, "msg": "NO {} key set into body request".format(key),"detail":"Specify the key POST body"})
        uploaded_file = request.FILES[key]  # deploy-pacakge: .zip fi
        _delete_all_files()
        # store_zip_file(uploaded_file)
        name_deploy_package, files_extracted = extract_zip_file(uploaded_file,path=settings.MEDIA_ROOT)
        print(name_deploy_package, files_extracted)
        if not files_extracted:
            options = "Name:{} \t Bytes:{} \t Content-type:{}".format(
                uploaded_file.name, uploaded_file.size, uploaded_file.content_type)
            return JsonResponse({"err": 1, "msg": "{} upload file is empty".format(uploaded_file.name), "detail": options})
        else:
            return JsonResponse(utils.success_msg("{} sucesfully extracted".format(uploaded_file.name),
                                                files_extracted))
    if request.method == 'GET':
        """
        Return the latest uploaded zip file.
        If the latest is missing, it resturn the zip file containing the default
        deploy package.
        """
        # default deploy-package path
        file_path = os.path.join(
                settings.DOCKER_ANALYSER_EXAMPLES, settings.DOCKER_ANALYSER_DEPLOY_PACKAGE_DEFAULT)
        if exist_folder(path=settings.MEDIA_ROOT):
            file_path = os.path.join(settings.MEDIA_ROOT,get_deploy_packge_name())
        path_to_zip = make_archive(file_path, "zip", file_path)
        with open(path_to_zip, 'rb') as file_zip:
            print("Open file zip {}".format(file_zip.name))
            response = HttpResponse(FileWrapper(
                file_zip), content_type='application/zip')
            response['Content-Disposition'] = 'attachment; filename={}'.format(
                os.path.basename(file_zip.name))  # +file_name.replace(" ","_")+'.zip'
        return response


def build(request):
    # GET  /build
    if request.method == 'GET':
        try:
            # TODO: path to deploy package is relative to the build context of DockerAnalyserfolder
            # /home/dido/code/DockerAnalyserUI/DockerAnalyser/backend/dockeranalyser/media/default-deploy-package

            res = mycompose.build_scanner(scanner_name="scanner",path_deploypackage=settings.MEDIA_REL_PATH)
            msg = utils.success_msg("{} DockerAnalyser built succesfuly. Selected deploy package:","pero")
            return JsonResponse(msg)
        except compose.service.BuildError as err:
            return JsonResponse({"err": 1,
                                 "msg": "DockerAnalyser not built. Error occurs when building with",
                                 "detail": str(err)
                                 })
        except Exception as e:
            return JsonResponse({"err": 1, "msg": traceback.format_exc()})



def up(request):
    # GET /up?service=<SERVICE_NAME>&scale=<NUM>
    service = request.GET.get('service')
    scale = request.GET.get('scale')
    # mycompose = MyCompose(project_name=PROJECT_NAME, project_dir=PROJECT_DIR) #file_compose="docker-analyser.json"
    try:
        (services_up, scale) = mycompose.up(services=([service] if service else None), scale=(
            "{}={}".format(service, scale) if scale else None))  # service_names=["scanner"]
        return JsonResponse({"err": 0,
                             "msg": "DockerAnalyser UP succesfully.",
                             "detail": "services:{} scale {} ".format(services_up, scale)})
    except Exception as e:
        return JsonResponse({"err": 1, "msg": traceback.format_exc()})


@csrf_exempt
def config(request):
    # POST /config
    # body:
       # {
       #  "service": "crawler",
       #  "command": "crawl",
       #  "args": {
       #          "force-page":true,
       #          "si": 0,
       #          "random": false,
       #          "fp": 10,
       #          "ps": 0,
       #          "policy": "pulls_first",
       #          "min-stars" : 0,
       #          "min-pulls" : 0,
       #          "only-automated": true,
       #          "only-official": false
       #      }
       #  }
    # mycompose = MyCompose(project_name=PROJECT_NAME, project_dir=PROJECT_DIR) #file_compose="docker-analyser.json"

    if request.method == 'POST':
        if request.body:
            body = json.loads(request.body)
            service = body['service']
            command = body['command']
            user_args = body['args']
            crawler_default_args = ["--save-url=/data/crawler/lasturl.txt",
                                    "--amqp-url=amqp://guest:guest@rabbitmq:5672",
                                    "--images-url=http://images_server:4000/api/images/",
                                    "--queue=images"]

            map_args = {"si": "--si", "force-page": "--force-page", "random": "--random",
                        "fp": "--fp", "ps": "--ps", "policy": "--policy",
                        "min-stars": "--min-stars", "min-pulls": "--min-pulls",
                        "only-automated": "--only-automated",
                        "only-official": "--only-official"}

            crawler_user_args = ["{}={}".format(map_args[k], str(v)) if (k not in [
                'only-automated', 'only-official']) else map_args[k] for k, v in user_args.items()]

            args = crawler_default_args + crawler_user_args
            try:
                mycompose.config_command(service, command, args)
                return JsonResponse(utils.success_msg(
                                    "{} configured succesfully".format(
                                        service),
                                    [command]+args))
            except Exception as e:
                return JsonResponse({"err": 1, "msg": traceback.format_exc()})
    if request.method == 'GET':
        # GET  /config?service=<NAME>
        service = request.GET.get('service')
        res = mycompose.get_config(service if service else None, key="command")
        return JsonResponse(
            utils.success_msg(
                "{} configuration options".format(
                    service if service else "All the services"),
                res))


def logs(request):
    # GET /logs?service=<SERVICE_NAME>
    # mycompose = MyCompose(project_name=PROJECT_NAME, project_dir=PROJECT_DIR)
    service = request.GET.get('service')
    res = mycompose.logs(services=[service] if service else None)
    return JsonResponse({"err": 0, "msg": "Logs of services", "services": res})


def stop(request):
    # GET /stop
    #    mycompose = MyCompose(project_name=PROJECT_NAME, project_dir=PROJECT_DIR)
    try:
        services = mycompose.stop()  # service_names=["scanner"]
        return JsonResponse({"err": 0, "msg": "stop {} services".format(services)})
    except Exception as e:
        return JsonResponse({"err": 1, "msg": traceback.format_exc()})


def status(request):
    # GET /status
    service = request.GET.get('service')
    #mycompose = MyCompose(project_name=PROJECT_NAME, project_dir=PROJECT_DIR)
    try:
        services = mycompose.ps(services=service)
        return JsonResponse({"err": 0, "msg": "status of the services", "services": services, "num": len(services)}, safe=False)
    except Exception as e:
        return JsonResponse({"err": 1, "msg": traceback.format_exc()})


def exist_folder(path=settings.MEDIA_ROOT):
    fs = FileSystemStorage()
    directories, files = fs.listdir(path)
    print("Directories {} Files: {}".format(directories, files))
    return len(directories) > 0


def _delete_all_files(path=settings.MEDIA_ROOT):
    # delete all the zip files stored into the path
    fs = FileSystemStorage()
    directories, files = fs.listdir(path)
    for file in files:
        print("deleted file")
        fs.delete(file)
    for dir in directories:
        print("deleted diectories")
        fs.delete(directories)

def get_deploy_packge_name(path=settings.MEDIA_ROOT):
    fs = FileSystemStorage()
    directories, files = fs.listdir(path)
    return directories[0]

def store_zip_file(file, path=settings.MEDIA_ROOT):
    # write the .zip file into /Media directory
    print("Store zip file into {}".format(path))
    fs = FileSystemStorage()
    filename = fs.save(file.name, file)

def extract_zip_file(file, path=settings.MEDIA_ROOT):
    # extract the files into path
    print("Extracting zip file into {}".format(path))
    print(file.name)
    filenames_extracted = []
    with zipfile.ZipFile(file, "r") as zip_ref:
        zip_ref.printdir()
        zip_ref.extractall(path)
        filenames_extracted = [zip.filename for zip in zip_ref.infolist()]
    print(filenames_extracted)
    return filenames_extracted[0], filenames_extracted[1:]
