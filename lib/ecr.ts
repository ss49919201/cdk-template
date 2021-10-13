import * as cdk from "@aws-cdk/core";
import * as ecr from "@aws-cdk/aws-ecr";

export class EcrStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        // ECRリポジトリを作成
        const repository = new ecr.Repository(this, "repo", {
            repositoryName: "repo"
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

        // Export
        new cdk.CfnOutput(this, "repository-uri", {
            value: repository.repositoryUri,
            exportName: "repository-uri",
        })
    }
}