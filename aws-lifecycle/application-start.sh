#!/bin/bash

docker-compose up -d
docker rmi "$(docker image ls -a -q)"