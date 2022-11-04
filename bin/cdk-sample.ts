#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LambdaFunctionStack } from '../lib/lambda';
import { QueueStack } from '../lib/queue';
import { EcrStack } from '../lib/ecr';
import { DeployStack } from '../lib/deploy';
import { ListenEcsStack } from '../lib/listen_ecs';
import { StorageStack } from '../lib/storage';
import { StorageWithCDNStack } from '../lib/storage_with_cdn';
import { ScheduledLambdaStack } from '../lib/scheduled_lambda';
import { RandomResultStack } from '../lib/random_result';
import { RdsStack } from '../lib/rds';
import { EcsStack } from '../lib/ecs';

const env = { account: process.env.ACCOUNT, region: process.env.REGION }
const app = new cdk.App();
new LambdaFunctionStack(app, 'LambdaFunctionStack', { env });
new QueueStack(app, 'QueueStack', { env });
new DeployStack(app, 'DeployStack', { env });
new ListenEcsStack(app, 'ListenEcsStack', { env });
new StorageStack(app, 'StorageStack', { env });
new StorageWithCDNStack(app, 'StorageWithCDNStack', { env });
new ScheduledLambdaStack(app, 'ScheduledLambdaStack', { env });
new RandomResultStack(app, 'RandomResultStack', { env });

const ecrStack = new EcrStack(app, 'EcrStack', { env });
new EcsStack(app, 'EcsStack', { env, repository: ecrStack.repository });

app.node.tryGetContext('rds') === 'true'
    ? new RdsStack(app, 'RdsStack', { env })
    : null;
