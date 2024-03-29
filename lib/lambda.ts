import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Construct } from 'constructs';

export class LambdaFunctionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpcID = this.node.tryGetContext('vpcID')

    if (!vpcID) {
      console.log('vpcID is not set')
      return
    }

    // ECRリポジトリをARN経由で参照
    // token取得の場合はnameとarnの指定が必要
    // https://github.com/aws/aws-cdk/blob/efe5112a2c6ae5e70b2631711b95b04d10062812/packages/%40aws-cdk/aws-ecr/lib/repository.ts#L395
    const repository = ecr.Repository.fromRepositoryAttributes(
      this,
      'repository',
      {
        repositoryName: cdk.Fn.importValue('repository-name'),
        repositoryArn: cdk.Fn.importValue('repository-arn'),
      }
    );

    // イベントソースとなるQueue
    const queue = sqs.Queue.fromQueueArn(this, 'queue', cdk.Fn.importValue('queue-arn'))
    const source = new SqsEventSource(queue)

    // LambdaをデプロイするVPC
    const vpc = ec2.Vpc.fromLookup(this, 'vpc', {
      vpcId: this.node.tryGetContext('vpcID'),
    })

    // デプロイ時にはイメージを置いておく必要があるので注意
    // NOTE: 環境変数はSecretsManager,SSMから取得(管理を一元化、CFnテンプレートに値をハードコーディングしない)
    // https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/configuration-envvars.html#configuration-envvars-samples
    // https://dev.classmethod.jp/articles/cdk-approval-pipeline/
    const fn = new lambda.DockerImageFunction(this, 'Lambda', {
      code: lambda.DockerImageCode.fromEcr(repository, { tag: 'sqs' }),
      functionName: 'function',
      events: [source],
      vpc: vpc,
    });

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
