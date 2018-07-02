from django.conf import settings
from django.http import JsonResponse
from urllib.request import urlopen
import urllib.parse
import json

images_service_url = settings.IMAGES_SERVER_URL + "/api/images"
images_search_url = settings.IMAGES_SERVER_URL + "/search"
images_stats_url = settings.IMAGES_SERVER_URL + "/stats/"
images_drop_url = images_service_url + "/drop"
images_export_url = images_service_url + "/export"


def get_params(request):
    data = {}
    for key in request.GET.keys():
        data[key] = request.GET.get(key, None)
    return data


def make_request(url, params):
    if params:
        url = url + "?" + urllib.parse.urlencode(params)
    response = urlopen(url)
    content = response.read().decode('utf-8')
    content = json.loads(content)
    return JsonResponse(content)


def images_list(request):
    params = get_params(request)
    return make_request(images_service_url, params)


def images_search(request):
    params = get_params(request)
    return make_request(images_search_url, params)


def images_stats(request):
    attribute = request.GET.get("attribute", None)
    url = images_stats_url + attribute
    return make_request(url, None)


def images_drop(request):
    return make_request(images_drop_url, None)


def images_export(request):
    return make_request(images_export_url, None)
