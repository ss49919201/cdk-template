#!/bin/sh

LAMBDA_ROOT_DIR="/Users/sakaeshinya/workspace/cdk-sample/lambda"
ARRAY_DIR=("random_result" "sqs" "listen-ecs")

function goModTidy() {
    cd $LAMBDA_ROOT_DIR/$1
    go mod tidy
}

for DIR in ${ARRAY_DIR[@]}
do
    goModTidy $DIR
done
