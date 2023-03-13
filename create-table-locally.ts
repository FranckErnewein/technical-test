import {
  DynamoDBClient,
  CreateTableCommand,
  BillingMode,
  KeyType,
  ScalarAttributeType,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";

const appTableName = "nftDefatilsTable";

const ddb = new DynamoDBClient({
  credentials: {
    accessKeyId: "fake-key",
    secretAccessKey: "fake-secret",
  },
  endpoint: "http://localhost:8001",
  region: "local",
});

(async function main() {
  console.info("Setting up local DynamoDB tables");
  const existingTable = await ddb.send(new ListTablesCommand({}));
  if (
    existingTable.TableNames?.find((tableName) => appTableName === tableName)
  ) {
    console.info(
      "DynamoDB Local - Table already exists: ${TableName}. Skipping.."
    );
    return;
  }

  console.log("ScalarAttributeType", ScalarAttributeType.S);

  const createTableCommand = new CreateTableCommand({
    AttributeDefinitions: [
      {
        AttributeName: "contractAddress",
        AttributeType: ScalarAttributeType.S,
      },
      { AttributeName: "collectionName", AttributeType: ScalarAttributeType.S },
      {
        AttributeName: "collectionImage",
        AttributeType: ScalarAttributeType.S,
      },
      { AttributeName: "type", AttributeType: ScalarAttributeType.S },
    ],
    BillingMode: BillingMode.PAY_PER_REQUEST,
    TableName: appTableName,
    KeySchema: [
      { AttributeName: "contractAddress", KeyType: KeyType.HASH },
      { AttributeName: "collectionName", KeyType: KeyType.RANGE },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "otherIndex",
        KeySchema: [
          { AttributeName: "collectionImage", KeyType: KeyType.HASH },
          { AttributeName: "type", KeyType: KeyType.RANGE },
        ],
        Projection: {
          ProjectionType: "ALL",
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      },
    ],
  });
  const result = await ddb.send(createTableCommand);
  console.log(result);
})();

