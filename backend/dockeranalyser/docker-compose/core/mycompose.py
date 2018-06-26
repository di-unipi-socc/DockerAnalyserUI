from compose.cli.main import TopLevelCommand
from compose.project import  OneOffFilter
from compose.cli.command  import project_from_options

from operator import attrgetter

class MyCompose():

    def __init__(self, project_name, project_dir='.'):
        self._name = project_name
        self._project = self._get_project(project_dir, project_name=self._name)
        # options = {'--file':'docker-compose.json'}
        self.compose = TopLevelCommand(self._project, project_dir=project_dir)


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
        services = list(filter(lambda x: x not in ['crawler','scanner'], self.get_service_names()))
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
            '--scale': ['crawler=2']
        }
        self.compose.up(options)
        return services


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
            '--file': ['docker-compose.json'],
            '--host':None,
            '--project-name': project_name,
            '--verbose':False,
            '--project-directory': None, #override the path of the project
            '--compatibility':False
        }
        project = project_from_options(path, options)
        return project
