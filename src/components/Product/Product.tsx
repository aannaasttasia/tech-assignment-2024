import "./css/Product.scss";
import { ProductType } from "../../types/productType";
import { contractAddress } from "../../contract";
import { useCallback, useEffect, useState } from "react";
import useWalletConnection from "../Header/useWalletConnection";
import {
  useEstimateFeesPerGas,
  useEstimateGas,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import contractABI from "../../contractABI.json";

const weiToEth = (priceInWei: bigint) => {
  return Number(priceInWei) / 10 ** 18;
};

export const usePurchasedCount = (
  account: `0x${string}` | undefined,
  id: bigint
) => {
  return useReadContract({
    address: contractAddress,
    abi: contractABI.abi,
    functionName: "productOf",
    args: [account, id],
  });
};

const Product = ({
  product,
  onTransactionResult,
}: {
  product: ProductType;
  onTransactionResult: (message: string | null) => void;
}) => {
  const [count, setCount] = useState<bigint>(0n);
  const { account, balanceData } = useWalletConnection();
  const {
    data: hash,
    writeContract,
    isPending: isWriteContractPending,
    isError: isWriteContractError,
    error: writeContractError,
  } = useWriteContract();

  const { data: gas, isLoading: gasLoading } = useEstimateGas();

  const { data: feePerGas, isLoading: feePerGasLoading } =
    useEstimateFeesPerGas();

  const {
    data: purchasedResult,
    isLoading: isPurchasedDataLoading,
    refetch: refetchPurchasedData,
  } = usePurchasedCount(account, product.id);
  
  const {
    isLoading: isTransactionReceiptLoading,
    isSuccess: isTransactionReceiptSuccess,
    isError: isTransactionReceiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isTransactionReceiptSuccess) {
      onTransactionResult("Transaction successful! Hash: " + hash);
    } else if (isTransactionReceiptError) {
      onTransactionResult("Transaction failed. Please try again.");
    } else if (isWriteContractError) {
      const contractWritingError = writeContractError.toString();
      onTransactionResult(contractWritingError.split("\n")[0]);
    }
  }, [isTransactionReceiptSuccess, isTransactionReceiptError, hash, isWriteContractError, writeContractError]);

  useEffect(() => {
    setCount(0n);
  }, [account, isTransactionReceiptSuccess, isTransactionReceiptError]);

  useEffect(()=>{
    onTransactionResult(null)
  },[account])

  useEffect(() => {
    refetchPurchasedData();
  }, [isTransactionReceiptLoading]);

  const handlePay = () => {
    onTransactionResult(null);
    const totalPrice = product.priceInETH * count;
    let fee = 0n;
    if (count <= 0) {
      alert("Select the correct number of products");
      return;
    }
    if (!account) {
      alert("Connect your wallet first!");
      return;
    }
    if (isWriteContractPending || isTransactionReceiptLoading) {
      alert("Transaction is already in progress!");
      return;
    }
    if (gasLoading || feePerGasLoading || !feePerGas || !gas) {
      alert("Estimating fees, please wait and try again..");
      return;
    } else {
      fee = gas * (feePerGas?.maxFeePerGas + feePerGas?.maxPriorityFeePerGas);
      console.log(Number(fee) / 10 ** 18);
    }
    if (balanceData && totalPrice > balanceData?.value + fee) {
      onTransactionResult(
        "You do not have enough SepoliaETH in your account to pay for transaction fees on Sepolia network"
      );
      return;
    }
    try {
      writeContract({
        address: contractAddress,
        abi: contractABI.abi,
        functionName: "purchase",
        args: [product.id, count],
        account: account as `0x${string}`,
        value: totalPrice,
      });
    } catch (error) {
      onTransactionResult("Transaction failed. Please try again.");
      console.error(error);
    }
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
            disabled={count <= 0 || isWriteContractPending || isTransactionReceiptLoading}
          >
            -
          </button>
          <div className="product_count">{count.toString()}</div>
          <button
            className="product_btn"
            onClick={handleIncrement}
            disabled={isWriteContractPending || isTransactionReceiptLoading}
          >
            +
          </button>
        </div>
        <div className="product_buy-btn-container" onClick={handlePay}>
          <span className="product_buy">
            {isWriteContractPending || isTransactionReceiptLoading ? "In progress" : "Buy"}
          </span>
        </div>
        {account &&
          (isPurchasedDataLoading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="product_purchased">
              You bought:{" "}
              {purchasedResult !== null ? Number(purchasedResult) : 0}
            </div>
          ))}
      </div>
    </article>
  );
};

export default Product;
