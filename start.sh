#!/bin/bash

aws-lifecycle/application-stop.sh

aws-lifecycle/after-install.sh

aws-lifecycle/application-start.sh
