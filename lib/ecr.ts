import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as ecr from "@aws-cdk/aws-ecr";
import * as sqs from "@aws-cdk/aws-sqs";
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';
import { Role, ServicePrincipal, ManagedPolicy } from "@aws-cdk/aws-iam";

export class ECRStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        // ECRリポジトリを作成
        const repository = new ecr.Repository(this, "repository", {
            repositoryName: "repository"
        })
        // Export
        new cdk.CfnOutput(this, "repository-name", {
            value: repository.repositoryName,
            exportName: "repository-name",
        })
        new cdk.CfnOutput(this, "repository-arn", {
            value: repository.repositoryArn,
            exportName: "repository-arn",
        })
    }
}