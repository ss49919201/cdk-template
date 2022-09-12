import * as cdk from "aws-cdk-lib";
import { Construct } from 'constructs';
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";

export class RdsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const vpc = ec2.Vpc.fromLookup(this, "vpc", {
            vpcId: this.node.tryGetContext("vpcID"),
        })

        // FIXME: [Error at /RdsStack/Database] Cluster requires at least 2 subnets, got 1
        new rds.DatabaseCluster(this, 'Database', {
            engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.of('5.7.mysql_aurora.2.08.1') }),
            credentials: rds.Credentials.fromGeneratedSecret('clusteradmin'), // Optional - will default to 'admin' username and generated password
            instanceProps: {
                // optional , defaults to t3.medium
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
                vpcSubnets: {
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                },
                vpc,
            },
        });
    }
}