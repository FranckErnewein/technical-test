import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { getAlchemyNft } from "../../libs/services";
import { insertNftDetails } from "../../libs/ddb";

interface LambdaEvent {
  body: {
    contractAddress: string;
  };
}

const createCollection = async (event: LambdaEvent) => {
  const { contractAddress } = event.body;
  const nftDetails = await getAlchemyNft(contractAddress);
  await insertNftDetails(nftDetails);
  return formatJSONResponse(nftDetails);
};

export const main = middyfy(createCollection);
