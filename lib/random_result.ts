import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda-go';
import * as sqs from '@aws-cdk/aws-sqs';
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';

export class RandomResultStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // イベントソースとなるQueue
    const queue = sqs.Queue.fromQueueArn(this, 'queue', cdk.Fn.importValue('queue-arn'))
    const source = new SqsEventSource(queue, {
      maxBatchingWindow: cdk.Duration.seconds(10),
    })
    new lambda.GoFunction(this, 'RandomResult', {
      entry: 'lambda/random_result',
      events: [source],
    })
  }
}
