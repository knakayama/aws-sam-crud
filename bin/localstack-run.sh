#!/usr/bin/env bash

services="apigateway,dynamodb,cloudformation"
data_dir="./data"
port_mappings="$(echo "$services" | sed 's/[^0-9]/ /g' | sed 's/\([0-9][0-9]*\)/-p \1:\1/g' | sed 's/  */ /g')"
docker_dock="/var/run/docker.sock"

docker run \
  -it \
  -e DEFAULT_REGION="$DEFAULT_REGION" \
  -e SERVICES="$services" \
  -e DATA_DIR="$data_dir" \
  -e DOCKER_HOST="unix://$docker_dock" \
  -p 4567-4581:4567-4581 \
  -p 8080:8080 \
  $port_mappings \
  -v "$docker_dock":"$docker_dock" \
  atlassianlabs/localstack
