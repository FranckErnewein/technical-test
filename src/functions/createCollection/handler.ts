import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import {
  DynamoDBClient,
  CreateTableCommand,
  BillingMode,
  KeyType,
  ScalarAttributeType,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";

let ddb: any;
function getDdbClient() {
  if (!ddb) {
    ddb = new DynamoDBClient({
      credentials: {
        accessKeyId: "fake-key",
        secretAccessKey: "fake-secret",
      },
      endpoint: "http://localhost:8001",
      region: "local",
    });
  }
  return ddb;
}

const createCollection = async (event) => {
  await getDdbClient().putItem({
    Item: {},
  });
  return formatJSONResponse({});
};

export const main = middyfy(createCollection);
