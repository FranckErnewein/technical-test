export type NftDetails = {
  contractAddress: string;
  collectionName?: string;
  collectionImage?: string;
  type: "ERC721" | "ERC1155";
};
