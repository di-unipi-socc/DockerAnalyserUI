from django.urls import path
from . import views

urlpatterns = [
    path('build', views.build, name='build'),
    path('config', views.config, name='config'),
    path('up', views.up, name='up'),
    path('stop', views.stop, name='stop'),
    path('status', views.status, name='status'),
]
