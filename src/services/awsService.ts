import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const REGION = process.env.AWS_REGION || 'us-east-2';

export const dynamoClient = new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});
