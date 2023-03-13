import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { NftDetails } from "../../types";
import axios from "axios";

interface LambdaEvent {
  pathParameters: {
    contractAddress: string;
  };
}

interface AlchemyPayload {
  address: string;
  contractMetadata?: {
    name: string;
    symbol: string;
    totalSupply: string;
    tokenType: string;
    contractDeployer: string;
    deployedBlockNumber: number;
    openSea?: {
      floorPrice: number;
      collectionName: string;
      safelistRequestStatus: string;
      imageUrl: string;
      description: string;
      twitterUsername: string;
      discordUrl: string;
      lastIngestedAt: string;
    };
  };
}

const { ALCHEMY_API_KEY } = process.env;

const getNftCollectionDetails = async (event: LambdaEvent) => {
  const { contractAddress } = event.pathParameters;
  const path = `https://eth-mainnet.g.alchemy.com/nft/v2/${ALCHEMY_API_KEY}/getContractMetadata`;
  const { data } = await axios.get<AlchemyPayload>(path, {
    params: { contractAddress },
  });

  // TODO: check how to return error for end user properly
  if (!data) throw "Api error";
  if (!data.contractMetadata) throw "contract not found";
  if (
    data.contractMetadata.tokenType !== "ERC721" &&
    data.contractMetadata.tokenType !== "ERC1155"
  )
    throw "token type not supported";

  const result: NftDetails = {
    contractAddress,
    collectionName: data.contractMetadata.openSea?.collectionName,
    collectionImage: data.contractMetadata.openSea?.imageUrl,
    type: data.contractMetadata.tokenType,
  };

  return formatJSONResponse(result);
};

export const main = middyfy(getNftCollectionDetails);
