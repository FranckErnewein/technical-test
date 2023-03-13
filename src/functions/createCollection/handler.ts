import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { NftDetails } from "../../types";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

interface LambdaEvent {
  body: {
    contractAddress: string;
  };
}

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

const createCollection = async (event: LambdaEvent) => {
  const item: NftDetails = {
    contractAddress: event.body.contractAddress,
    collectionName: "A name",
    collectionImage: "http://image.url",
    type: "ERC721",
  };
  const result = await getDdbClient().send(
    new PutItemCommand({
      TableName: "appTable",
      Item: {
        PK: {
          S: JSON.stringify(item),
        },
        SK: {
          S: item.contractAddress,
        },
      },
    })
  );
  return formatJSONResponse(result);
};

export const main = middyfy(createCollection);
