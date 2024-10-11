import { useEffect, useState } from "react";
import { ProductType } from "../../types/productType";
import Product from "../Product/Product";
import "./css/ProductsList.scss";
import Loader from "../Loader/Loader";
import { useReadContracts } from "wagmi";
import { contractAddress } from "../../contract";
import contractABI from "../../contractABI.json";

export function ProductsList() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [transactionMessage, setTransactionMessage] = useState<string | null>(null);

  const handleTransactionResult = (message: string | null) => {
    setTransactionMessage(message);
  };

  const wagmiContract = {
    address: contractAddress,
    abi: contractABI.abi,
    functionName: "productById",
  } as const;

  const { data: data } = useReadContracts({
    contracts: [
      { ...wagmiContract, args: [1n] },
      { ...wagmiContract, args: [2n] },
      { ...wagmiContract, args: [3n] },
    ],
  });

  useEffect(() => {
    if (data) {
      const productsArray = data.map((item, index) => {
        const [name, linkToImage, priceInETH] = item.result as [
          string,
          string,
          bigint
        ];
        return {
          id: BigInt(index + 1),
          name,
          linkToImage,
          priceInETH,
        };
      });
      setProducts(productsArray);
    }
  }, [data]);

  return (
    <section className="list_products">
      {transactionMessage ? (
        <div
          className={`message ${
            transactionMessage.startsWith("Transaction successful")
              ? "message_success"
              : "message_error"
          }`}
        >
          {transactionMessage}
        </div>
      ) : (
        <div className="message"></div>
      )}
      <h1>Available products</h1>
      {products.length > 0 ? (
        <ul className="list_ul-products">
          {products.map((product: ProductType) => (
            <li key={product.id}>
              <Product product={product} onTransactionResult={handleTransactionResult}/>
            </li>
          ))}
        </ul>
      ) : (
        <Loader />
      )}
    </section>
  );
}
