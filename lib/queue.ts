import * as cdk from "@aws-cdk/core";
import * as sqs from "@aws-cdk/aws-sqs";

export class QueueStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const queue = new sqs.Queue(this, "queue", {})

        // Export
        new cdk.CfnOutput(this, "queue-arn", {
            // key
            value: queue.queueArn
        })
    }
}