import * as cdk from "aws-cdk-lib";
import { Construct } from 'constructs';
import * as ec2 from "aws-cdk-lib/aws-ec2";

export class InstanceStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const vpc = new ec2.Vpc(this, "VPC", {
            natGateways: 0,
        });

        new ec2.Instance(this, 'Instance', {
            vpc,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage({
                generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
            }),
        });
    }
}