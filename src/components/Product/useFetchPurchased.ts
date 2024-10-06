import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { accountAtom } from "../Header/useWalletConnection";
import { purchasedProducts } from "../../services/productService";
import { transactionResultAtom } from "./Product";

export const useFetchPurchased = (id: bigint) => {
    const [purchasedData, setPurchasedData] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const account = useAtomValue(accountAtom);
    const message = useAtomValue(transactionResultAtom)

    const getPurchasedProducts = async () => {
        if (account) {
            try {
                const productsCount = await purchasedProducts(account, id);
                setPurchasedData(Number(productsCount.purchasedItemsCount));
            } catch (error) {
                console.error("Failed to fetch purchased products:", error);
            } finally {
                setLoading(false);
            }
        } else {
          setPurchasedData(null);
          setLoading(false);
        }
    };
  
    useEffect(() => {
      setLoading(true); 
      getPurchasedProducts();
    }, [account, id, message]);
  
    return { purchasedData, loading };
};