#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LambdaFunctionStack } from '../lib/lambda';
import { QueueStack } from '../lib/queue';
import { EcrStack } from '../lib/ecr';
import { DeployStack } from '../lib/deploy';
import { ListenEcsStack } from '../lib/listen_ecs';
import { StorageStack } from '../lib/storage';
// import { RdsStack } from '../lib/rds';

const env = { account: process.env.ACCOUNT, region: process.env.REGION }
const app = new cdk.App();
new LambdaFunctionStack(app, 'LambdaFunctionStack', { env });
new QueueStack(app, 'QueueStack', { env });
new EcrStack(app, 'EcrStack', { env });
new DeployStack(app, 'DeployStack', { env });
new ListenEcsStack(app, 'ListenEcsStack', { env });
new StorageStack(app, 'StorageStack', { env });
// new RdsStack(app, 'RdsStack', { env });
