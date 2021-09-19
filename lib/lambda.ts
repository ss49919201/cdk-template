import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as ecr from "@aws-cdk/aws-ecr";
import * as sqs from "@aws-cdk/aws-sqs";
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';
import { Role, ServicePrincipal, ManagedPolicy } from "@aws-cdk/aws-iam";

export class LambdaStack extends cdk.Stack {
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

    const queue = sqs.Queue.fromQueueArn(this, "queue", cdk.Fn.importValue("queue-arn"))
    const source = new SqsEventSource(queue)

    // デプロイ時にはイメージを置いておく必要があるので注意
    const func = new lambda.DockerImageFunction(this, "Lambda", {
      code: lambda.DockerImageCode.fromEcr(repository, {}),
      functionName: "lambda",
    });

    func.addEventSource(source)

    const func2 = new lambda.Function(this, "Lambda2", {
      code: lambda.Code.fromEcrImage(repository, {}),
      functionName: "lambda2",
      runtime: lambda.Runtime.FROM_IMAGE,
      handler: lambda.Handler.FROM_IMAGE,
    });

    func2.addEventSource(source)
  }
}