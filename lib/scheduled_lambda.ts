import * as cdk from 'aws-cdk-lib/core';
import * as lambdaPython from '@aws-cdk/aws-lambda-python-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';

export class ScheduledLambdaStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const fn = new lambdaPython.PythonFunction(this, 'ScheduledFunction', {
            entry: 'lambda/hello-world',
            runtime: lambda.Runtime.PYTHON_3_8,
        });

        const rule = new events.Rule(this, 'ScheduledRule', {
            schedule: events.Schedule.cron({ minute: '0/1' }),
        });
        rule.addTarget(new targets.LambdaFunction(fn));

        // Export
        new cdk.CfnOutput(this, 'lambda-arn', {
            value: fn.functionArn,
            exportName: 'lambda-arn',
        })
        new cdk.CfnOutput(this, 'lambda-name', {
            value: fn.functionName,
            exportName: 'lambda-name',
        })
    }
}
