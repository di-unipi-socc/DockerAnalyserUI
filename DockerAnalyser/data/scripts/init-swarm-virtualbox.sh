# !/usr/bin/env bash

Size=3
MANAGER_NODE="node-1"

if [ -z "${DOCKER_MACHINE_DRIVER}" ]; then
    DOCKER_MACHINE_DRIVER=virtualbox
fi

# REGISTRY_MIRROR_OPTS="--engine-registry-mirror https://jxus37ac.mirror.aliyuncs.com"
# INSECURE_OPTS="--engine-insecure-registry 192.168.99.0/24"
STORAGE_OPTS="--engine-storage-driver overlay2"

MACHINE_OPTS="${STORAGE_OPTS} ${INSECURE_OPTS} ${REGISTRY_MIRROR_OPTS}"

NETWORK="docker-analyser-net"


function create_network(){
  eval $(docker-machine env node-1)  # enter in the manager

  if docker network ls | grep -q $NETWORK ; then
      echo $NETWORK network already exist.
  else
      echo $NETWORK network not found.
      docker network create --driver overlay  --attachable $NETWORK
      echo "Overlay Network ceated " $NETWORK
  fi
}

function create_nodes() {
    for i in $(seq 1 ${Size})
    do
        # Create a docker host by docker-machine
        set -xe
        docker-machine create -d ${DOCKER_MACHINE_DRIVER} ${MACHINE_OPTS} node-${i}
        set +xe
    done
}

function remove_nodes() {
    for i in $(seq 1 ${Size})
    do
        # Remove the docker host
        docker-machine rm -y node-${i}
    done
}

function create_swarm() {
    NumberOfManager=$1

    if [ -z "${NumberOfManager}" ]; then
        # if nothing specified, just let everyone are managers.
        NumberOfManager=${Size}
    else
        # NumberOfManager cannot be greater than the node size
        if [ "${NumberOfManager}" -gt "${Size}" ]; then
            NumberOfManager=${Size}
        fi
    fi

    # Create Swarm Manager
    ManagerIP=`docker-machine ip node-1`
    echo "Manager IP: ${ManagerIP}"
    echo "node-1 inits swarm and becomes a Manager"

    set -xe
    docker-machine ssh node-1 docker swarm init --advertise-addr ${ManagerIP}
    set +xe

    # Fetch Tokens
    # ManagerToken=`docker-machine ssh node-1 docker swarm join-token manager | grep token | awk '{ print $2 }'`
    ManagerToken=`docker-machine ssh node-1 docker swarm join-token manager | grep token | awk '{ print $5 }'`

    # WorkerToken=`docker-machine ssh node-1 docker swarm join-token worker | grep token | awk '{ print $2 }'`
    WorkerToken=`docker-machine ssh node-1 docker swarm join-token worker | grep token | awk '{ print $5 }'`


    echo "Manager Token: ${ManagerToken}"
    echo "Worker Token: ${WorkerToken}"

    # Managers
    if [ "${NumberOfManager}" -gt 2 ]; then
        for i in $(seq 2 ${NumberOfManager})
        do
            echo "node-${i} join swarm as a Manager"

            set -xe
            docker-machine ssh node-${i} "docker swarm join --token ${ManagerToken} ${ManagerIP}:2377"
            set +xe

        done
    fi

    # Workers
    if [ "${NumberOfManager}" -lt "${Size}" ]; then
        for i in $(seq "$(expr ${NumberOfManager} + 1)" ${Size})
        do
            echo "node-${i} join swarm as a Worker"

            set -xe
            docker-machine ssh node-${i} "docker swarm join --token ${WorkerToken} ${ManagerIP}:2377"
            set +xe

        done
    fi
}

function remove_swarm() {
    for i in $(seq 1 ${Size})
    do
        # Leave Swarm
        set -xe
        docker-machine ssh node-${i} docker swarm leave --force
        set +xe

    done
}

function check_swarm(){
  # enter in the manager environment
  eval $(docker-machine env node-1)
  set -xe
  docker-machine ssh ${MANAGER_NODE} docker node ls
  docker-machine stack ls
  set +xe
}

function create() {
     # Check is Virtualbox and docker-machine are installed in the system
    check_requirements
    create_network
    # creates a the nodes or the swarm
    Command=$1
    shift
    case "${Command}" in
        nodes)  create_nodes "$@" ;;
        swarm)  create_swarm "$@" ;;
        *)      echo "Usage: $0 create <nodes|swarm>" ;;
    esac
}

function remove() {
    Command=$1
    shift
    case "${Command}" in
        nodes)  remove_nodes "$@" ;;
        swarm)  remove_swarm "$@" ;;
        *)      echo "Usage: $0 remove <nodes|swarm>" ;;
    esac
}

function check_requirements() {
  echo 'Checking  requirements.'
  if ! [ -x "$(command -v virtualbox)" ]; then
      echo "Virtualbox is not installed. Install virtualbox (https://www.virtualbox.org/wiki/Downloads) and try again."
  else
     echo '    Virtualbox is installed in the system.'
  fi
  if ! [ -x "$(command -v docker-machine)" ]; then  # check if Docker-mcahine is installed
    echo 'docker-machine is not installed.'
    echo 'Installing docker-machine command ...'
  	curl -L https://github.com/docker/machine/releases/download/v0.13.0/docker-machine-`uname -s`-`uname -m` >/tmp/docker-machine && \
  	chmod +x /tmp/docker-machine && \ &> /dev/null
  	sudo cp /tmp/docker-machine /usr/local/bin/docker-machine
  else
     echo '   docker-machine is installed in the system'
  fi
  if ! [ -x "$(command -v docker-compose)" ]; then
     echo "docker-compose is not installed. Installing docker-compose ..."
      sudo curl -L https://github.com/docker/compose/releases/download/1.18.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose;
      sudo chmod +x /usr/local/bin/docker-compose;
      docker-compose --version;
      echo 'docker-compose installed.'
  else
    echo "docker-compose is installed in the system."
  fi
}

function main() {

    Command=$1
    shift
    case "${Command}" in
        create) create "$@" ;;
        remove) remove "$@" ;;
        check) check_swarm ;;
        *)      echo "Usage: $0 <create|remove|check>" ;;
    esac
}

main "$@"
