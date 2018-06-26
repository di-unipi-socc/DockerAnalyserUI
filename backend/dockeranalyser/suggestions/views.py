from django.http import JsonResponse
from urllib.request import urlopen
import json

SOURCE_URL = "https://raw.githubusercontent.com/di-unipi-socc/DockerAnalyser/master/analysis/scanner/scanner/core/client_images_service.py"


def get_images_service_methods():
    response = urlopen(SOURCE_URL)
    content = response.read().decode("utf8")
    functions = []
    current_function = None
    in_comment = False
    for line in content.split("\n"):
        line = line.strip()
        if line.strip().startswith("def "):
            function_name = line.split(" ")[1].split("(")[0]
            if function_name == "__init__":
                continue
            arg_names = line.split("(")[1].split(")")[0].split(",")
            arg_names = [arg.strip() for arg in arg_names if arg != "self"]
            current_function = {"name": function_name, "args": arg_names, "comment": u""}
            print(function_name, arg_names)
        elif current_function:
            if line.startswith('"""') or in_comment:
                if line.endswith('"""'):
                    in_comment = False
                else:
                    in_comment = True
                current_function["comment"] += line.replace('"""', "").replace("\\n", "");
                print("comment:", line)
            else:
                functions.append(current_function)
                current_function = None
                in_comment = False
    return functions


def inspect_images_service(request):
    results = {"module": "client_images_service", "results": get_images_service_methods()}
    return JsonResponse(results)


def validate_code(request):
    errors = []
    code = request.GET.get("code", None)
    code = json.loads(code)
    #functions = get_images_service_methods()
    analysis = "def analysis(image_json, context):"
    # def analysis(images_json, context):
    analysis_found = False
    return_found = False
    for line in code.splitlines():
        line = line.strip()
        if line.startswith(analysis):
            analysis_found = True
        if line == "return True" or line == "return False":
            return_found = True
        if analysis_found and return_found:
            break
    if not analysis_found:
        errors.append("Analysis function not found")
    if not return_found:
        errors.append("No return found")
    results = {"errors": errors}
    return JsonResponse(results)


def images(request):
    results = {
            "count": 0,
            "images": [
                {
                    "_id": "5af2f4c7fd2fb1001043df9d",
                    "repo_name": "lkwg82/h2o-http2-server",
                    "repo_owner": "",
                    "is_automated": True,
                    "is_official": False,
                    "tag": "v2.0.5",
                    "name": "lkwg82/h2o-http2-server:v2.0.5",
                    "repository": 525616,
                    "creator": 445986,
                    "last_updater": 445986,
                    "last_updated": "2017-01-20T22:45:57.889Z",
                    "image_id": None,
                    "v2": True,
                    "__v": 0,
                    "softwares": [ ]
                },
                {
                    "_id": "5af2f4c7fd2fb1001043df9e",
                    "repo_name": "lkwg82/h2o-http2-server",
                    "repo_owner": "",
                    "is_automated": True,
                    "is_official": False,
                    "tag": "v2.0.4",
                    "name": "lkwg82/h2o-http2-server:v2.0.4",
                    "repository": 525616,
                    "creator": 445986,
                    "last_updater": 445986,
                    "last_updated": "2017-01-20T22:42:51.909Z",
                    "image_id": None,
                    "v2": True,
                    "__v": 0,
                    "softwares": [ ]
                },
                {
                    "_id": "5af2f4c7fd2fb1001043df9f",
                    "repo_name": "lkwg82/h2o-http2-server",
                    "repo_owner": "",
                    "is_automated": True,
                    "is_official": False,
                    "tag": "v2.0.3",
                    "name": "lkwg82/h2o-http2-server:v2.0.3",
                    "repository": 525616,
                    "creator": 445986,
                    "last_updater": 445986,
                    "last_updated": "2017-01-20T22:39:46.694Z",
                    "image_id": None,
                    "v2": True,
                    "__v": 0,
                    "softwares": [ ]
                },
                {
                    "_id": "5af2f4c7fd2fb1001043dfa0",
                    "repo_name": "lkwg82/h2o-http2-server",
                    "repo_owner": "",
                    "is_automated": True,
                    "is_official": False,
                    "tag": "v2.0.2",
                    "name": "lkwg82/h2o-http2-server:v2.0.2",
                    "repository": 525616,
                    "creator": 445986,
                    "last_updater": 445986,
                    "last_updated": "2017-01-20T22:36:44.069Z",
                    "image_id": None,
                    "v2": True,
                    "__v": 0,
                    "softwares": [ ]
                },
                {
                    "_id": "5af2f4c7fd2fb1001043dfa1",
                    "repo_name": "lkwg82/h2o-http2-server",
                    "repo_owner": "",
                    "is_automated": True,
                    "is_official": False,
                    "tag": "v2.0.1",
                    "name": "lkwg82/h2o-http2-server:v2.0.1",
                    "repository": 525616,
                    "creator": 445986,
                    "last_updater": 445986,
                    "last_updated": "2017-01-20T22:33:37.255Z",
                    "image_id": None,
                    "v2": True,
                    "__v": 0,
                    "softwares": [ ]
                },
                {
                    "_id": "5af2f4c7fd2fb1001043dfa2",
                    "repo_name": "lkwg82/h2o-http2-server",
                    "repo_owner": "",
                    "is_automated": True,
                    "is_official": False,
                    "tag": "v1.7.2",
                    "name": "lkwg82/h2o-http2-server:v1.7.2",
                    "repository": 525616,
                    "creator": 445986,
                    "last_updater": 445986,
                    "last_updated": "2016-08-03T18:05:51.426Z",
                    "image_id": None,
                    "v2": True,
                    "__v": 0,
                    "softwares": [ ]
                },
                {
                    "_id": "5af2f4c7fd2fb1001043dfa3",
                    "repo_name": "lkwg82/h2o-http2-server",
                    "repo_owner": "",
                    "is_automated": True,
                    "is_official": False,
                    "tag": "v1.7.3",
                    "name": "lkwg82/h2o-http2-server:v1.7.3",
                    "repository": 525616,
                    "creator": 445986,
                    "last_updater": 445986,
                    "last_updated": "2016-06-23T20:55:01.726Z",
                    "image_id": None,
                    "v2": True,
                    "__v": 0,
                    "softwares": [ ]
                },
                {
                    "_id": "5af2f4c7fd2fb1001043dfa4",
                    "repo_name": "lkwg82/h2o-http2-server",
                    "repo_owner": "",
                    "is_automated": True,
                    "is_official": False,
                    "tag": "v1.7.1",
                    "name": "lkwg82/h2o-http2-server:v1.7.1",
                    "repository": 525616,
                    "creator": 445986,
                    "last_updater": 445986,
                    "last_updated": "2016-05-26T23:53:58.891Z",
                    "image_id": None,
                    "v2": True,
                    "__v": 0,
                    "softwares": [ ]
                },
                {
                    "_id": "5af2f4c7fd2fb1001043dfa5",
                    "repo_name": "lkwg82/h2o-http2-server",
                    "repo_owner": "",
                    "is_automated": True,
                    "is_official": False,
                    "tag": "v1.7.0",
                    "name": "lkwg82/h2o-http2-server:v1.7.0",
                    "repository": 525616,
                    "creator": 445986,
                    "last_updater": 445986,
                    "last_updated": "2016-02-12T23:28:12.721Z",
                    "image_id": None,
                    "v2": True,
                    "__v": 0,
                    "softwares": [ ]
                },
                {
                    "_id": "5af2f4c7fd2fb1001043dfa6",
                    "repo_name": "lkwg82/h2o-http2-server",
                    "repo_owner": "",
                    "is_automated": True,
                    "is_official": False,
                    "tag": "v1.5.0",
                    "name": "lkwg82/h2o-http2-server:v1.5.0",
                    "repository": 525616,
                    "creator": 445986,
                    "last_updater": 445986,
                    "last_updated": "2016-02-12T23:16:15.466Z",
                    "image_id": None,
                    "v2": True,
                    "__v": 0,
                    "softwares": [ ]
                },
                {
                    "_id": "5af2f4c7fd2fb1001043dfa7",
                    "repo_name": "lkwg82/h2o-http2-server",
                    "repo_owner": "",
                    "is_automated": True,
                    "is_official": False,
                    "tag": "v1.4.5",
                    "name": "lkwg82/h2o-http2-server:v1.4.5",
                    "repository": 525616,
                    "creator": 445986,
                    "last_updater": 445986,
                    "last_updated": "2016-02-12T23:10:28.827Z",
                    "image_id": None,
                    "v2": True,
                    "__v": 0,
                    "softwares": [ ]
                },
                {
                    "_id": "5af2f4c7fd2fb1001043dfa8",
                    "repo_name": "lkwg82/h2o-http2-server",
                    "repo_owner": "",
                    "is_automated": True,
                    "is_official": False,
                    "tag": "v1.4.4",
                    "name": "lkwg82/h2o-http2-server:v1.4.4",
                    "repository": 525616,
                    "creator": 445986,
                    "last_updater": 445986,
                    "last_updated": "2016-02-12T23:04:27.013Z",
                    "image_id": None,
                    "v2": True,
                    "__v": 0,
                    "softwares": [ ]
                },
                {
                    "_id": "5af2f4c7fd2fb1001043dfa9",
                    "repo_name": "lkwg82/h2o-http2-server",
                    "repo_owner": "",
                    "is_automated": True,
                    "is_official": False,
                    "tag": "v1.6.0",
                    "name": "lkwg82/h2o-http2-server:v1.6.0",
                    "repository": 525616,
                    "creator": 445986,
                    "last_updater": 445986,
                    "last_updated": "2016-02-12T22:37:39.229Z",
                    "image_id": None,
                    "v2": True,
                    "__v": 0,
                    "softwares": [ ]
                },
                {
                    "_id": "5af2f4c7fd2fb1001043dfaa",
                    "repo_name": "lkwg82/h2o-http2-server",
                    "repo_owner": "",
                    "is_automated": True,
                    "is_official": False,
                    "tag": "v1.5.4",
                    "name": "lkwg82/h2o-http2-server:v1.5.4",
                    "repository": 525616,
                    "creator": 445986,
                    "last_updater": 445986,
                    "last_updated": "2016-02-12T22:31:32.534Z",
                    "image_id": None,
                    "v2": True,
                    "__v": 0,
                    "softwares": [ ]
                },
                {
                    "_id": "5af2f4c7fd2fb1001043dfab",
                    "repo_name": "lkwg82/h2o-http2-server",
                    "repo_owner": "",
                    "is_automated": True,
                    "is_official": False,
                    "tag": "v1.5.3",
                    "name": "lkwg82/h2o-http2-server:v1.5.3",
                    "repository": 525616,
                    "creator": 445986,
                    "last_updater": 445986,
                    "last_updated": "2016-02-12T22:25:40.118Z",
                    "image_id": None,
                    "v2": True,
                    "__v": 0,
                    "softwares": [ ]
                },
                {
                    "_id": "5af2f4c7fd2fb1001043dfac",
                    "repo_name": "lkwg82/h2o-http2-server",
                    "repo_owner": "",
                    "is_automated": True,
                    "is_official": False,
                    "tag": "v1.5.2",
                    "name": "lkwg82/h2o-http2-server:v1.5.2",
                    "repository": 525616,
                    "creator": 445986,
                    "last_updater": 445986,
                    "last_updated": "2016-02-12T22:19:52.893Z",
                    "image_id": None,
                    "v2": True,
                    "__v": 0,
                    "softwares": [ ]
                },
                {
                    "_id": "5af2f4c7fd2fb1001043dfad",
                    "repo_name": "lkwg82/h2o-http2-server",
                    "repo_owner": "",
                    "is_automated": True,
                    "is_official": False,
                    "tag": "v1.5.1",
                    "name": "lkwg82/h2o-http2-server:v1.5.1",
                    "repository": 525616,
                    "creator": 445986,
                    "last_updater": 445986,
                    "last_updated": "2016-02-12T22:14:10.914Z",
                    "image_id": None,
                    "v2": True,
                    "__v": 0,
                    "softwares": [ ]
                },
                {
                    "_id": "5af2f4c7fd2fb1001043dfae",
                    "repo_name": "lkwg82/h2o-http2-server",
                    "repo_owner": "",
                    "is_automated": True,
                    "is_official": False,
                    "tag": "v1.6.3",
                    "name": "lkwg82/h2o-http2-server:v1.6.3",
                    "repository": 525616,
                    "creator": 445986,
                    "last_updater": 445986,
                    "last_updated": "2016-02-12T22:08:20.441Z",
                    "image_id": None,
                    "v2": True,
                    "__v": 0,
                    "softwares": [ ]
                }
            ]
        
        }
    results["count"] = len(results["images"])
    return JsonResponse(results)