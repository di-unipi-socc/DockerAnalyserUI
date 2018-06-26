from django.urls import path
from . import views

urlpatterns = [
    path('build', views.build, name='build'),
    path('up', views.up, name='up'),
    path('run', views.run, name='run'),
    path('config', views.config_command, name='config'),
    path('stop', views.stop, name='stop'),
    path('status', views.status, name='status'),
]
