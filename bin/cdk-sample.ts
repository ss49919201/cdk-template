#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LambdaStack } from '../lib/lambda';
import { QueueStack } from '../lib/queue';

const app = new cdk.App();
new LambdaStack(app, 'LambdaStack');
new QueueStack(app, 'QueueStack');
