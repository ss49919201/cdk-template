import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import { Duration } from "@aws-cdk/core";

export class StorageStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new s3.Bucket(this, "my-sample-bucket", {
            lifecycleRules: [
                {
                    expiration: Duration.days(30), // 翌日の0時開始(UTC)
                    prefix: "delete",
                    id: "auto-delete-rule"
                }
            ],
        })
    }
}