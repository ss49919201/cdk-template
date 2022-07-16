#!/bin/bash

i=0

while [ $i -lt 10 ]
do
  aws sqs send-message \
  --queue-url ${QUEUE_URL} \
  --message-body $i \
  --message-group-id $i \
  --message-deduplication-id $i

  i=`expr $i + 1`
done
