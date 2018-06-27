from compose.cli.main import TopLevelCommand
from compose.project import  OneOffFilter
from compose.cli.command  import project_from_options

from os import path
import json

from operator import attrgetter

class MyCompose():

    def __init__(self, project_name, project_dir='.',file_compose='docker-compose.json'):
        self._name = project_name
        self.file = file_compose
        self.project_dir = project_dir
        print("rreading file: {}".format(self.get_compose_file()))
        self._project = self._get_project(project_dir, project_name=self._name)
        self.compose = TopLevelCommand(self._project, project_dir=project_dir)

    def get_compose_file(self):
        return  path.join(self.project_dir,self.file)

    def get_name(self):
        return self._name

    def get_service_names(self):
        return self._project.service_names

    def build_scanner(self, scanner_name='scanner', path_deploypackage='/data/examples/deploy-package-dockerfinder'):
        try:
            print("building....")
            self.compose.build({'SERVICE':[scanner_name],
                        '--build-arg': {
                                "DEPLOY_PACKAGE_PATH": path_deploypackage
                                },
                        '--memory':'1GB'})
            print("finieshed building")
            return True
        except compose.service.BuildError as err:
             return False

    def up(self, services=None, scale=None):
        # scale = ['crawler=2']
        # services =  list of services
        services = services if services else self.get_service_names()
        scale = scale if scale else []
        options = {
            '--no-deps':False,
            '--always-recreate-deps':False,
            '--abort-on-container-exit':None,
            'SERVICE':services,
            '--remove-orphans':False,
            '--detach':True,
            '--no-start':False,
            '--no-recreate':True,
            '--force-recreate':False,
            '--no-build':False,
            '--build':False,
            '--scale': [] # 'crawler=2'
        }
        print(self.compose.up(options))
        return "UP services: {}, scale {}".format(services,scale)


    def run(self,service_name='crawler', command='crawl', args=['--fp=100', '--min-pulls=10','--min-stars=20', '--policy=pulls_first']):
        options = { 'SERVICE':service_name,
                    'COMMAND':command,
                    'ARGS':args,
                    "--no-deps":True,
                    '-e':None,'--label':None,'--rm':True,'--user':None,
                    '--name':None,'--workdir':None,'--volume':None,
                    '--publish':False,'--detach':True,"--service-ports":False,
                    "--use-aliases":True,
                    '--entrypoint':None}
        return self.compose.run(options)

    def stop(self):
        self.compose.stop({'SERVICE':self.get_service_names()})
        return  self.get_service_names()

    def ps(self):
        """
        containers status
        """
        # running_containers = self._project.containers(stopped=False)
        running_containers =   sorted(
            self._project.containers(service_names=self.get_service_names(), stopped=True) +
            self._project.containers(service_names=self.get_service_names(), one_off=OneOffFilter.only),
            key=attrgetter('name'))

        items = [{
            'name': container.name,
            'name_without_project': container.name_without_project,
            'command': container.human_readable_command,
            'state': container.human_readable_state,
            # 'labels': container.labels,
            'ports': container.ports,
            # 'volumes': get_volumes(get_container_from_id(project.client, container.id)),
            'is_running': container.is_running} for container in running_containers]

        return items

    def _get_project(self, path, project_name=None):
        """
        get docker project given file path
        """
        # environment = Environment.from_env_file(path)
        # config_path = get_config_path_from_options(path, dict(), environment)
        # project = compose_get_project(path, config_path, project_name=project_name)
        options = {
            '--file': [ self.file],
            '--host':None,
            '--project-name': project_name,
            '--verbose':False,
            '--project-directory': None, #override the path of the project
            '--compatibility':False
        }
        project = project_from_options(path, options)
        return project

    def config_command(self, service, command=None, args=None):
        try :
            with open(self.get_compose_file(), 'r+') as file_compose:
                data = json.load(file_compose)
                actual_command_args = data['services'][service]['command'] # list ['command','args=value', 'arg2=value2']
                actual_command = actual_command_args[0]
                actual_args = actual_command_args[0]
                data['services'][service]['command'] = [command if command else actual_command] + (args if args else actual_args)
                file_compose.seek(0)  # rewind
                json.dump(data, file_compose, indent=4)
                file_compose.truncate()
            return True
        except:
            return False
    
    # def config_replicas(self, service, num):
