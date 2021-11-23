import * as cdk from '@aws-cdk/core';
// import * as lambda from '@aws-cdk/aws-lambda';
import * as lambda from '@aws-cdk/aws-lambda-python';
import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';

export class ScheduledLambdaStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const fn = new lambda.PythonFunction(this, 'ScheduledFunction', {
            entry: 'lambda/hello-world',
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
