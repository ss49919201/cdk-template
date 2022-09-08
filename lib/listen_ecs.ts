import * as cdk from 'aws-cdk-lib/core';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as events from 'aws-cdk-lib/aws-events';
import * as lambda from 'aws-cdk-lib/aws-lambda-go';


export class ListenEcsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const clusterArn = this.node.tryGetContext('cluster-arn')

        const fn = new lambda.GoFunction(this, 'listen-ecs-function', {
            functionName: 'listen-ecs-function',
            entry: 'lambda/listen-ecs',
        })

        const targetFunction = new targets.LambdaFunction(fn)

        new events.Rule(this, 'ScheduleRule', {
            eventPattern: {
                source: ['aws.ecs'],
                detail: { 'clusterArn': [clusterArn] },
                detailType: ['ECS Task State Change']
            },
            targets: [targetFunction],
        });
    }
}