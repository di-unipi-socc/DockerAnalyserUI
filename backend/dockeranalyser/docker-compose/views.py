from django.http import JsonResponse
from distlib.index import PackageIndex
import json,zipfile
import sys, traceback
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile


from .core.mycompose import MyCompose

PROJECT_DIR="/home/dido/code/DockerAnalyserUI/DockerAnalyser/"
PATH_TOSAVE_DEPLOY_PACKAGE="{}/data/examples".format(PROJECT_DIR)


mycompose = MyCompose(project_name="prova", project_dir=PROJECT_DIR) #file_compose="docker-analyser.json"


@csrf_exempt
def build(request):
    # POST /build
    # BODY: 
    #    deploy-package : DEPLOY-PACKAGE.zip   
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
                                "msg":" {} DockerAnalyser built succesfuly. Selected deploy package: {}".format(mycompose.get_name(), uploaded_file.name),
                                "detail": filenames
                                })
        else:
            return JsonResponse({"err":1,
                                "msg":"{} DockerAnalyser not built. Error occurs when building with {}".format(mycompose.get_name(), uploaded_file.name,
                                "files: {}".format(filenames))
                                })

def up(request):
    # GET ?service=<X>&scale=<NUM>
    # GET /up  ?scanner=100&crawler=2
    service = request.GET.get('service')
    scale = request.GET.get('scale')
    # print(request.GET)
    try:
        #res = mycompose.up(services=([service] if service else None), scale=("{}={}".format(service, scale) if scale else None)) # service_names=["scanner"]
        res = mycompose.up(services=None, scale=None) # service_names=["scanner"]
        return JsonResponse({"err":0,"msg": res})
    except Exception as e:
        return JsonResponse({"err":1,"msg": traceback.format_exc()})

@csrf_exempt
def config(request):
    # POST /config
    # body:
   
#    {
#     "service": "crawler",  
#     "command": "crawl",
#     "args": {
#             "force-page":true,
#             "si": 0,
#             "random": false,
#             "fp": false,
#             "ps": 0,
#             "policy": "pulls_first",
#             "min-stars" : 0,
#             "min-pulls" : 0,
#             "only-automated": true,
#             "only-official": false    
#         }          
#     }
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

            map_args ={"si":"--si", "force-page":"--force-page","random":"--random",
                        "fp":"--fp","ps":"--ps","policy":"--policy",
                       "min-stars":"--min-stars","min-pulls":"--min-pulls",
                       "only-automated":"--only-automated", 
                       "only-official":"--only-official" }
            crawler_user_args = ["{}={}".format(map_args[k],str(v)) for k, v in user_args.items()]
            args = crawler_default_args + crawler_user_args
            try:
                mycompose.config_command(service,command, args)
                return JsonResponse({"err":0,  
                                    "msg":"{} config succesfully comamnd".format(service), 
                                    "detail": "command: {} args: {}".format(command, args)})
            except Exception as e:
                return JsonResponse({"err":1,"msg": traceback.format_exc()})


# def run(request):
#     mycompose.run()
#     return JsonResponse({"Run":"ok"})

def stop(request):
    services = mycompose.stop() # service_names=["scanner"]
    return JsonResponse({"err": 0, "msg":"stop {} services".format(services)})

def status(request):
    services = mycompose.ps()
    return JsonResponse({"err":0, "msg": "status of the services", "services":services, "num":len(services)}, safe=False)

def handle_uploaded_file(file):
    filenames_extracted = []
    with zipfile.ZipFile(file,"r") as zip_ref:
        # printing all the contents of the zip file
        zip_ref.printdir()
        zip_ref.extractall(PATH_TOSAVE_DEPLOY_PACKAGE)
        filenames_extracted = [zip.filename for zip in zip_ref.infolist()]
    return filenames_extracted
