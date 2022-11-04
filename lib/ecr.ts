import * as cdk from "aws-cdk-lib";
import { Construct } from 'constructs';
import * as ecr from "aws-cdk-lib/aws-ecr";

export class EcrStack extends cdk.Stack {
    public readonly repository: ecr.Repository;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        // ECRリポジトリを作成
        this.repository = new ecr.Repository(this, "repo", {
            repositoryName: "repo"
        })
        // Export
        new cdk.CfnOutput(this, "repository-name", {
            value: this.repository.repositoryName,
            exportName: "repository-name",
        })
        new cdk.CfnOutput(this, "repository-arn", {
            value: this.repository.repositoryArn,
            exportName: "repository-arn",
        })

        // Export
        new cdk.CfnOutput(this, "repository-uri", {
            value: this.repository.repositoryUri,
            exportName: "repository-uri",
        })
    }
}