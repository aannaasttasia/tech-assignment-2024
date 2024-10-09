import "./css/Product.scss";
import { ProductType } from "../../types/productType";
import {
  estimateFee,
  purchase,
  purchasedProducts,
} from "../../services/productService";
import { useCallback, useEffect, useState } from "react";
import { atom, useAtom } from "jotai";
import useWalletConnection from "../Header/useWalletConnection";
import { useFetchPurchased } from "./useFetchPurchased";

const weiToEth = (priceInWei: bigint) => {
  return Number(priceInWei) / 10 ** 18;
};

export const transactionResultAtom = atom<{
  status: string | null;
  message: string;
} | null>(null);

export const setTransactionResult = atom(
  null,
  (get, set, result: { status: string | null; message: string } | null) => {
    set(transactionResultAtom, result);
  }
);

const Product = ({ product }: { product: ProductType }) => {
  const [count, setCount] = useState<bigint>(0n);
  const [, setResult] = useAtom(setTransactionResult);
  const [transactionLoading, setTransactinhLoad] = useState<boolean>(false);
  const { purchasedData, loading, setPurchasedData } = useFetchPurchased(
    BigInt(product.id)
  );
  const { account, balanceData } = useWalletConnection();

  useEffect(() => {
    setCount(0n);
  }, [account]);

  const handlePay = async () => {
    setResult(null);
    const totalPrice = product.priceInETH * count;
    if (count <= 0) {
      alert("Select the correct number of products");
      return;
    }
    if (!account) {
      alert("Connect your wallet first!");
      return;
    }
    if (transactionLoading) {
      alert("Transaction is already in progress!");
      return;
    }
    let isActual = true;
    try {
      setTransactinhLoad(true);
      const fee = await estimateFee(
        totalPrice,
        BigInt(product.id),
        count,
        account
      );
      if (balanceData && totalPrice > balanceData?.value + BigInt(fee)) {
        alert("You do not have enough SepoliaETH in your account to pay for transaction fees on Sepolia network");
        return;
      }
      const hash = await purchase(
        totalPrice,
        BigInt(product.id),
        count,
        account
      );
      if (!isActual) return;
      console.log(hash);
      setResult({ status: hash.status, message: hash.message });

      if (hash.status === "success") {
        const productsCount = await purchasedProducts(
          account,
          BigInt(product.id)
        );
        setPurchasedData(Number(productsCount.purchasedItemsCount));
      }
    } catch (error) {
      const errorMessage = (error as any).message.toString();
      const firstLine = errorMessage.split("\n")[0];
      const msg = `Transaction failed: ${firstLine}`;
      if (!isActual) return;
      setResult({ status: "reverted", message: msg });
    } finally {
      if (!isActual) return;
      setTransactinhLoad(false);
    }

    return () => {
      isActual = false;
    };
  };

  const handleIncrement = useCallback(() => setCount((prev) => prev + 1n), []);
  const handleDecrement = useCallback(() => setCount((prev) => prev - 1n), []);

  return (
    <article className="product">
      <div>
        <h1 className="product_name">{product.name}</h1>
        <figure>
          <div className="img_wrapper">
            <img src={product.linkToImage} alt="product_picture" />
          </div>
          <figcaption>
            <p className="product_price">{weiToEth(product.priceInETH)} ETH</p>
          </figcaption>
        </figure>
        <div className="product_count-container">
          <button
            className="product_btn"
            onClick={handleDecrement}
            disabled={count <= 0}
          >
            -
          </button>
          <div className="product_count">{count.toString()}</div>
          <button className="product_btn" onClick={handleIncrement}>
            +
          </button>
        </div>
        <div className="product_buy-btn-container" onClick={handlePay}>
          <span className="product_buy">
            {transactionLoading ? "In progress" : "Buy"}
          </span>
        </div>
        {account &&
          (loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="product_purchased">
              You bought: {purchasedData !== null ? purchasedData : 0}
            </div>
          ))}
      </div>
    </article>
  );
};

export default Product;
