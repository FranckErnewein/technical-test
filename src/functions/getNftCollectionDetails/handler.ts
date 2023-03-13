import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { getAlchemyNft } from "../../libs/services";

interface LambdaEvent {
  pathParameters: {
    contractAddress: string;
  };
}

const getNftCollectionDetails = async (event: LambdaEvent) => {
  const { contractAddress } = event.pathParameters;
  return formatJSONResponse(await getAlchemyNft(contractAddress));
};

export const main = middyfy(getNftCollectionDetails);
