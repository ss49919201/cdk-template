import * as cdk from "aws-cdk-lib";
import { Construct } from 'constructs';
import * as sqs from "aws-cdk-lib/aws-sqs";
import { Duration } from "aws-cdk-lib";

export class QueueStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const deadLetterQueue = new sqs.Queue(this, "deadLetterQueue", {
            queueName: "deadLetterQueue",
        })

        const queue = new sqs.Queue(this, "queue", {
            queueName: "queue",
            deliveryDelay: Duration.seconds(10),
            visibilityTimeout: Duration.seconds(30),
            receiveMessageWaitTime: Duration.seconds(10),
            deadLetterQueue: {
                queue: deadLetterQueue,
                maxReceiveCount: 1,
            }
        })

        // Export
        new cdk.CfnOutput(this, "queue-arn", {
            value: queue.queueArn,
            exportName: "queue-arn",
        })
    }
}