import { APIGatewayProxyEventV2 } from 'aws-lambda';
import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({ region: 'eu-north-1' });
const TABLE = 'mobile-shops';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export const getShop = async (event: APIGatewayProxyEventV2) => {
  const id = event.pathParameters?.id;
  if (!id) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ message: 'ID missing' }) };
  }

  const result = await client.send(new GetItemCommand({
    TableName: TABLE,
    Key: { id: { S: id } },
  }));

  if (!result.Item) {
    return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ message: 'Shop not found' }) };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(mapItem(result.Item)),
  };
};

export const getShopsByRegion = async (event: APIGatewayProxyEventV2) => {
  const region = event.pathParameters?.region;
  if (!region) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ message: 'Region missing' }) };
  }

  const result = await client.send(new ScanCommand({
    TableName: TABLE,
    FilterExpression: '#r = :region',
    ExpressionAttributeNames: { '#r': 'region' },
    ExpressionAttributeValues: { ':region': { S: decodeURIComponent(region) } },
  }));

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify((result.Items ?? []).map(mapItem)),
  };
};

export const checkShopInCity = async (event: APIGatewayProxyEventV2) => {
  const city = event.pathParameters?.city;
  if (!city) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ message: 'City missing' }) };
  }

  const result = await client.send(new ScanCommand({
    TableName: TABLE,
    FilterExpression: 'city = :city AND hasShop = :yes',
    ExpressionAttributeValues: {
      ':city': { S: decodeURIComponent(city) },
      ':yes': { BOOL: true },
    },
  }));

  const shops = (result.Items ?? []).map(mapItem);
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ city: decodeURIComponent(city), hasShop: shops.length > 0, shops }),
  };
};

function mapItem(item: Record<string, any>) {
  return {
    id: item.id?.S,
    city: item.city?.S,
    region: item.region?.S,
    hasShop: item.hasShop?.BOOL ?? false,
    plans: item.plans?.SS ?? [],
    address: item.address?.S ?? null,
  };
}
