from django.urls import path
from . import views

urlpatterns = [
    path('build', views.build, name='build'),
    path('up', views.up, name='up'),
    path('stop', views.stop, name='stop'),
]
