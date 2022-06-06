#!/bin/bash

# i=0

# while [ $i -lt 10 ]
# do
# #   echo $i
#   aws sqs send-message \
#   --queue-url ${QUEUE_URL} \
#   --message-body $i \
#   --message-group-id $i \
#   --message-deduplication-id $i

#   i=`expr $i + 1`
# done

aws sqs send-message-batch --queue-url ${QUEUE_URL} --entries file://${MESSAGES_PATH}
