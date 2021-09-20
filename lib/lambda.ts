import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as ecr from "@aws-cdk/aws-ecr";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as sqs from "@aws-cdk/aws-sqs";
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';
import { SecretValue } from "@aws-cdk/core";

export class LambdaFunctionStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // ECRリポジトリをARN経由で参照
    // token取得の場合はnameとarnの指定が必要
    // https://github.com/aws/aws-cdk/blob/efe5112a2c6ae5e70b2631711b95b04d10062812/packages/%40aws-cdk/aws-ecr/lib/repository.ts#L395
    const repository = ecr.Repository.fromRepositoryAttributes(
      this,
      "repository",
      {
        repositoryName: cdk.Fn.importValue("repository-name"),
        repositoryArn: cdk.Fn.importValue("repository-arn"),
      }
    );

    // イベントソースとなるQueue
    const queue = sqs.Queue.fromQueueArn(this, "queue", cdk.Fn.importValue("queue-arn"))
    const source = new SqsEventSource(queue)

    // LambdaをデプロイするVPC
    const vpc = ec2.Vpc.fromLookup(this, "vpc", {
      vpcId: this.node.tryGetContext("vpcID"),
    })

    // デプロイ時にはイメージを置いておく必要があるので注意
    // NOTE: 環境変数はSecretsManager,SSMから取得(管理を一元化、CFnテンプレートに値をハードコーディングしない)
    // https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/configuration-envvars.html#configuration-envvars-samples
    // https://dev.classmethod.jp/articles/cdk-approval-pipeline/
    const fn = new lambda.DockerImageFunction(this, "Lambda", {
      code: lambda.DockerImageCode.fromEcr(repository, {}),
      functionName: "lambda",
      environment: {
        "USER": SecretValue.secretsManager("USER").toString(),
        "PASSWORD": SecretValue.secretsManager("PASSWORD").toString(),
        "PROTOCOL": SecretValue.secretsManager("PROTOCOL").toString(),
        "DB_HOST": SecretValue.secretsManager("DB_HOST").toString(),
        "DB_NAME": SecretValue.secretsManager("DB_NAME").toString(),
      },
      events: [source],
      vpc: vpc,
    });

    // Export
    new cdk.CfnOutput(this, "lambda-arn", {
      value: fn.functionArn,
      exportName: "lambda-arn",
    })
  }
}
