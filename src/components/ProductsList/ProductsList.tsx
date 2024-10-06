import { useEffect, useState } from "react";
import { ProductType } from "../../types/productType";
import Product, { transactionResultAtom } from "../Product/Product";
import "./css/ProductsList.scss";
import Loader from "../Loader/Loader";
import { fetchProducts } from "../../services/productService";
import { useAtomValue } from "jotai";
import { accountAtom } from "../Header/useWalletConnection";

export function ProductsList() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const account = useAtomValue(accountAtom);
  const message = useAtomValue(transactionResultAtom);

  useEffect(() => {
    const getProducts = async () => {
      const productsData = await fetchProducts();
      setProducts(productsData);
    };
    getProducts();
  }, [account]);

  return (
    <section className="list_products">
      {message ? (
        <div
          className={`message ${
            message.startsWith("Transaction failed")
              ? "message_error"
              : "message_success"
          }`}
        >
          {message}
        </div>
      ) : (
        <div className="message"></div>
      )}
      <h1>Available products</h1>
      {products.length > 0 ? (
        <ul className="list_ul-products">
          {products.map((product: ProductType) => (
            <li key={product.id}>
              <Product product={product} />
            </li>
          ))}
        </ul>
      ) : (
        <Loader />
      )}
    </section>
  );
}
