import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as ecr from "@aws-cdk/aws-ecr";
import * as sqs from "@aws-cdk/aws-sqs";
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';
import { Role, ServicePrincipal, ManagedPolicy } from "@aws-cdk/aws-iam";

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