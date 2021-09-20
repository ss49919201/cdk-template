#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LambdaStack } from '../lib/lambda';
import { QueueStack } from '../lib/queue';
import { ECRStack } from '../lib/ecr';

const env = { account: process.env.ACCOUNT, region: process.env.REGION }
const app = new cdk.App();
new LambdaStack(app, 'LambdaStack', { env });
new QueueStack(app, 'QueueStack', { env });
new ECRStack(app, 'ECRStack', { env });
