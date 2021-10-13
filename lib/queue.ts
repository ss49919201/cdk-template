import * as cdk from "@aws-cdk/core";
import * as sqs from "@aws-cdk/aws-sqs";
import { Duration } from "@aws-cdk/core";

export class QueueStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const queue = new sqs.Queue(this, "queue", {
            queueName: "queue.fifo",
            fifo: true,
            deliveryDelay: Duration.seconds(10),
            visibilityTimeout: Duration.seconds(120),
            receiveMessageWaitTime: Duration.seconds(10),
        })

        // Export
        new cdk.CfnOutput(this, "queue-arn", {
            value: queue.queueArn,
            exportName: "queue-arn",
        })
    }
}