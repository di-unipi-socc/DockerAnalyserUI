from django.http import JsonResponse
from distlib.index import PackageIndex
import json,zipfile
import sys, traceback
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile


from .core.mycompose import MyCompose

PROJECT_DIR="/home/dido/code/DockerAnalyserUI/DockerAnalyser/"

mycompose = MyCompose(project_name="prova", project_dir=PROJECT_DIR) #file_compose="docker-analyser.json"

PATH_TOSAVE_DEPLOY_PACKAGE="/home/dido/code/DockerAnalyserUI/DockerAnalyser/data/examples"

@csrf_exempt
def build(request):
    # /build
    # BODY: 
    #    name: <NAME>  # nome dell'analizzatore 
    if request.method == 'POST':
        uploaded_file = request.FILES['deploy-package']
        options = "Name:{} \t Bytes:{} \t Content-type:{}".format(uploaded_file.name, uploaded_file.size, uploaded_file.content_type)
        filenames = handle_uploaded_file(uploaded_file)
        if (len(filenames) > 0):
            deploy_package_name = filenames.pop(0) #first name is the name of the folder
        else:
            return JsonResponse({"err":1, "msg":"{} is empty".format(uploaded_file.name), "options":options})

        res = mycompose.build_scanner(scanner_name="scanner",
                                      path_deploypackage="/data/examples/{}".format(deploy_package_name))
        if res:
            return JsonResponse({"err":0,
                                "msg":" {} DockerAnalyser built succesfuly. Selected deploy package: {}".format(mycompose.get_name(), uploaded_file.name,
                                "files: {}".format(filenames))
                                })
        else:
            return JsonResponse({"err":1,
                                "msg":"{} DockerAnalyser not built. Error occurs when building with {}".format(mycompose.get_name(), uploaded_file.name,
                                "files: {}".format(filenames))
                                })

def up(request):
    # /up?service=<X>&scale=<NUM>
    # /up?scanner=100&crawler=2
    service = request.GET.get('service')
    scale = request.GET.get('scale')
    ##print(request.GET)
    try:
        #res = mycompose.up(services=([service] if service else None), scale=("{}={}".format(service, scale) if scale else None)) # service_names=["scanner"]
        res = mycompose.up(services=None, scale=None) # service_names=["scanner"]
        
        return JsonResponse({"err":0,"msg": res})
    except Exception as e:
        return JsonResponse({"err":1,"msg": traceback.format_exc()})


def config(request): #self, service, command, args):
    # POST
    # body:
    #     {
    #               "service": "crawler",  
    #               "command": "crawl",
    #               "args": {
    #                      "si": 0,
    #                     "random": false,
    #                      "fp": false,
    #                      "ps": 0,
    #                      "policy": "pulls_first",
    #                      "min-stars" : 0,
    #                      "min-pulls:" : 0,
    #                      "only-automated": false       
    #                }          
    # }
    crawler_args = ["--save-url=/data/crawler/lasturl.txt",
                "--amqp-url=amqp://guest:guest@rabbitmq:5672",
                "--images-url=http://images_server:4000/api/images/",
                "--queue=images",
                "--force-page=False",
                "--si=0",
                "--random=False", # --random-crawl"
                "--fp=0",
                "--ps=0",
                "--policy=pulls_first",
                "--min-stars=0",
                "--min-pulls=0",
                "--only-automated"]
    try:
        mycompose.config_command('crawler','crawl', args)
        # mycompose.config_replicas('scanner','scan', args)
        return JsonResponse({"err":0,  "msg":"config succesfully"})
    except Exception as e:
        return JsonResponse({"err":1,"msg": traceback.format_exc()})


# def run(request):
#     mycompose.run()
#     return JsonResponse({"Run":"ok"})

def stop(request):
    services = mycompose.stop() # service_names=["scanner"]
    return JsonResponse({"msg":"stop {} services".format(services)})

def status(request):
    services = mycompose.ps()
    return JsonResponse({"services":services, "num":len(services)}, safe=False)

def handle_uploaded_file(file):
    filenames_extracted = []
    with zipfile.ZipFile(file,"r") as zip_ref:
        # printing all the contents of the zip file
        zip_ref.printdir()
        print('Extracting all the files now...')
        zip_ref.extractall(PATH_TOSAVE_DEPLOY_PACKAGE)
        filenames_extracted = [zip.filename for zip in zip_ref.infolist()]
    return filenames_extracted
