import * as cdk from "aws-cdk-lib";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from 'constructs';


export class DeployStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const repositoryURI = cdk.Fn.importValue("repository-uri")
        const lambdaName = cdk.Fn.importValue("lambda-name")
        const lambdaArn = cdk.Fn.importValue("lambda-arn")

        const deployRole = new iam.Role(this, 'CodeBuildDeployRole', {
            assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
        });
        const lambdaPolicy = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            resources: [lambdaArn],
            actions: ['lambda:UpdateFunctionCode'],
        })
        deployRole.addToPolicy(lambdaPolicy)

        // LambdaをデプロイするCodeBuild
        new codebuild.Project(
            this,
            "BuildProject",
            {
                buildSpec: codebuild.BuildSpec.fromObject({
                    version: "0.2",
                    phases: {
                        build: {
                            commands: [
                                `aws lambda update-function-code --region ap-northeast-1 --function-name ${lambdaName} --image-uri ${repositoryURI}:latest`,
                            ],
                        },
                    },
                }),
                role: deployRole,
                environment: {
                    buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3,
                    privileged: true,
                    environmentVariables: {
                        AWS_DEFAULT_REGION: {
                            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
                            value: "ap-northeast-1",
                        },
                    },
                },
            }
        )
    }
}