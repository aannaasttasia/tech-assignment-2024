import { useEffect, useState } from "react";
import { ProductType } from "../../types/productType";
import Product, { transactionResultAtom } from "../Product/Product";
import "./css/ProductsList.scss";
import Loader from "../Loader/Loader";
import { fetchProducts } from "../../services/productService";
import { useAtomValue } from "jotai";

export function ProductsList() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const result = useAtomValue(transactionResultAtom);

  useEffect(() => {
    let isActual = true;
    const getProducts = async () => {
      const productsData = await fetchProducts();
      if (!isActual) return;
      setProducts(productsData);
    };
    getProducts();
    return () => {
      isActual = false;
    };
  }, []);

  return (
    <section className="list_products">
      {result ? (
        <div
          className={`message ${
            result.message.startsWith("Transaction failed")
              ? "message_error"
              : "message_success"
          }`}
        >
          {result.message}
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
