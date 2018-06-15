from django.http import JsonResponse
from distlib.index import PackageIndex
import json
from .core.bridgecompose import get_project

project = get_project("/home/dido/code/DockerAnalyserUI/DockerAnalyser/", project_name="docker-finder")

def build(request):
    # docker-compose build --build-arg  DEPLOY_PACKAGE_PATH=/data/examples/deploy-package-dockerfinder scanner
    project.build(service_names=["scanner"], build_args={"DEPLOY_PACKAGE_PATH": "/data/examples/deploy-package-dockerfinder"})
    return JsonResponse({"msg":"build scanner pf {}".format(project.name)})

def up(request):
    # service_names=None, no_cache=False, pull=False, force_rm=False, memory=None, build_args=None, gzip=False:
    res = project.up() # service_names=["scanner"]
    return JsonResponse({"res": res})

def stop(request):
    project.ustop() # service_names=["scanner"]
