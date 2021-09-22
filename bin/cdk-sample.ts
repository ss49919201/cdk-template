#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LambdaFunctionStack } from '../lib/lambda';
import { QueueStack } from '../lib/queue';
import { ECRStack } from '../lib/ecr';
import { DeployStack } from '../lib/deploy';

const env = { account: process.env.ACCOUNT, region: process.env.REGION }
const app = new cdk.App();
new LambdaFunctionStack(app, 'LambdaFunctionStack', { env });
new QueueStack(app, 'QueueStack', { env });
new ECRStack(app, 'ECRStack', { env });
new DeployStack(app, 'DeployStack', { env });
