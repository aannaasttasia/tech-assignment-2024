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
                // check actuality after each async action
                setLoading(false);
            }
        } else {
            // check actuality after each async action
            setPurchasedData(null);
            setLoading(false);
        }
    };

    // `message` not best candidate for update state, state update only after transaction success and confirmed,
    // but message changed on reject tx by user, and creating tx (just creating, but not confirmed)
    // also if u buy product1 u need update only product1, but message relates for all products
    useEffect(() => {
      setLoading(true); // `setLoading(true)` better call inside `getPurchasedProducts`
      getPurchasedProducts();
    }, [account, id, message]);

    return { purchasedData, loading };
};
