import * as cdk from 'aws-cdk-lib/core';
import * as lambda from 'aws-cdk-lib/aws-lambda-go';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export class RandomResultStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // イベントソースとなるQueue
    const queue = sqs.Queue.fromQueueArn(this, 'queue', cdk.Fn.importValue('queue-arn'))
    const source = new SqsEventSource(queue, {
      maxBatchingWindow: cdk.Duration.seconds(10),
      reportBatchItemFailures: true, // バッチ内のメッセージの一部を失敗したメッセージとしてキューに返す
    })
    new lambda.GoFunction(this, 'RandomResult', {
      entry: 'lambda/random_result',
      events: [source],
    })
  }
}
