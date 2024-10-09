import { useEffect, useState } from "react";
import useWalletConnection from "../Header/useWalletConnection";
import { purchasedProducts } from "../../services/productService";

export const useFetchPurchased = (id: bigint ) => {
    const [purchasedData, setPurchasedData] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { account } = useWalletConnection();

    useEffect(() => {
        let isActual = true; 
        const getPurchasedProducts = async () => {
            setLoading(true);
            if (account) {
                try {
                    const productsCount = await purchasedProducts(account, id);
                    if (!isActual) return
                        setPurchasedData(Number(productsCount.purchasedItemsCount));
                } catch (error) {
                    console.error("Failed to fetch purchased products:", error);
                } finally {
                    if(!isActual) return
                    setLoading(false);
                    
                }
            } else {
                if (!isActual) return
                    setPurchasedData(null);
                    setLoading(false);
            }
        };
        getPurchasedProducts();
        
        return () => { isActual = false }
    }, [account, id]);

    return { purchasedData, loading, setPurchasedData };
};
