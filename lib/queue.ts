import * as cdk from "@aws-cdk/core";
import * as sqs from "@aws-cdk/aws-sqs";
import { Duration } from "@aws-cdk/core";

export class QueueStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
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