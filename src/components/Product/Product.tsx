import "./css/Product.scss";
import { ProductType } from "../../types/productType";
import { purchase } from "../../services/productService";
import { useState } from "react";
import { atom, useAtom, useAtomValue } from "jotai";
import { accountAtom } from "../Header/useWalletConnection";
import { useFetchPurchased } from "./useFetchPurchased";

const weiToEth = (priceInWei: bigint) => {
  return Number(priceInWei) / 10 ** 18;
};

export const transactionResultAtom = atom<string | null>(null);

export const setTransactionResult = atom(
  null,
  (get, set, message: string | null) => {
    set(transactionResultAtom, message);
  }
);

const Product = ({ product }: { product: ProductType }) => {
  const [count, setCount] = useState<bigint>(0n);
  const [, setMessage] = useAtom(setTransactionResult);
  const [transactionLoading, setTransactinhLoad] = useState<boolean>(false);
  const { purchasedData, loading } = useFetchPurchased(BigInt(product.id));
  const account = useAtomValue(accountAtom);

  const handlePay = async () => {
    setMessage(null)
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
    try {
      setTransactinhLoad(true);
      const totalPrice = product.priceInETH * count;
      console.log(totalPrice);
      const hash = await purchase(
        totalPrice,
        BigInt(product.id),
        count,
        account
      );
      setMessage(hash);
    } catch (error) {
      const errorMessage = (error as any).message.toString();
      const firstLine = errorMessage.split("\n")[0];
      const msg = `Transaction failed: ${firstLine}`;
      setMessage(msg);
    } finally {
      setTransactinhLoad(false);
    }
  };

  const handleIncrement = () => {
    setCount(count + 1n);
  };
  const handleDecrement = () => {
    setCount(count - 1n);
  };

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
