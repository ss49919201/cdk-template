import * as cdk from '@aws-cdk/core';
import * as targets from '@aws-cdk/aws-events-targets';
import * as events from '@aws-cdk/aws-events';
import * as lambda from '@aws-cdk/aws-lambda';
import * as ecr from '@aws-cdk/aws-ecr';


export class ListenEcsStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const clusterArn = this.node.tryGetContext('cluster-arn')

        const repository = ecr.Repository.fromRepositoryAttributes(
            this,
            'repository',
            {
                repositoryName: cdk.Fn.importValue('repository-name'),
                repositoryArn: cdk.Fn.importValue('repository-arn'),
            }
        );

        const fn = new lambda.DockerImageFunction(this, 'listen-ecs', {
            code: lambda.DockerImageCode.fromEcr(repository, { tag: 'listen-ecs' }),
            functionName: 'listen-ecs',
        });

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