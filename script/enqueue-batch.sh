#!/bin/bash

aws sqs send-message-batch --queue-url ${QUEUE_URL} --entries file://${MESSAGES_PATH}
