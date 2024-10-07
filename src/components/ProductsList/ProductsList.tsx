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
    // let isActual = true
    const getProducts = async () => {
      const productsData = await fetchProducts();
      // u potentially can load data after components unmount
      // need to add check that u set actual data
      // if (!isActual) return
      setProducts(productsData);
    };
    getProducts();
    // return () => (isActual = false)
  }, [account]); // general products info doesn't depend on account

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
