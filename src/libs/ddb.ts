import { NftDetails } from "../types";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

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

export async function insertNftDetails(item: NftDetails) {
  return getDdbClient().send(
    new PutItemCommand({
      TableName: "nftDefatilsTable",
      Item: {
        contractAddress: {
          S: item.contractAddress,
        },
        collectionName: {
          S: item.collectionName || "",
        },
        collectionImage: {
          S: item.collectionImage || "",
        },
        type: {
          S: item.type,
        },
      },
    })
  );
}
