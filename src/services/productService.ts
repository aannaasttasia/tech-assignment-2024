import { publicClient, walletClient } from "../client/client";
import { ProductType } from "../types/productType";
import contractABI from "../contractABI.json";

const contractAddress = "0x0Bd94f53b9b099e97C8B7176D0aD4A24c3B26f88";

export const fetchProducts = async () => {
    const productIds: number[] = [1, 2, 3];

    const productPromises = productIds.map(
      async (id: number): Promise<ProductType> => {
        const product = await publicClient.readContract({
          address: contractAddress,
          abi: contractABI.abi,
          functionName: "productById",
          args: [BigInt(id)],
        });
        const [name, linkToImage, priceInETH] = product as [
          string,
          string,
          bigint
        ];
        console.log(product)

        return {
          id,
          name,
          linkToImage,
          priceInETH,
        };
      }
    );
    return await Promise.all(productPromises)
};

export const purchasedProducts = async (account: string, id: BigInt) =>{
    const count =  await publicClient.readContract({
        address: contractAddress,
        abi: contractABI.abi,
        functionName: "productOf",
        args: [account, id]
    })
    return {
        purchasedItemsCount: count
    }
}

export const purchase = async (price: bigint, id: bigint, count: bigint, account: string) => {
    try {
        const hash = await walletClient.writeContract({
          address: contractAddress,
          abi: contractABI.abi,
          functionName: "purchase",
          args: [id, count],
          account: account as `0x${string}`,
          value: price
        });
        return `Transaction hash: ${hash}`
      } catch (error) {
        const errorMessage = (error as any).message.toString();
        const firstLine = errorMessage.split("\n")[0];
        return `Transaction failed: ${firstLine}`
    }
}