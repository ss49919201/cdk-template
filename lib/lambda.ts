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
    const repository = ecr.Repository.fromRepositoryArn(
      this,
      id,
      "",
    );

    const execLambdaRole = new Role(this, "execRole", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        ),
      ],
    });

    const func = new lambda.DockerImageFunction(this, "Lambda", {
      code: lambda.DockerImageCode.fromEcr(repository, {
        tag: "lambda",
      }),
      role: execLambdaRole,
      functionName: "lambda",
    });

    const queue = sqs.Queue.fromQueueArn(this, "queue", "")
    const source = new SqsEventSource(queue)
    func.addEventSource(source)

    const func2 = new lambda.Function(this, "Lambda2", {
      code: lambda.Code.fromEcrImage(repository, {
        tag: "lambda",
      }),
      role: execLambdaRole,
      functionName: "lambda2",
      runtime: lambda.Runtime.FROM_IMAGE,
      handler: lambda.Handler.FROM_IMAGE,
    });

    func2.addEventSource(source)
  }
}