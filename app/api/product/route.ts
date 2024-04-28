import productDummy from "@/lib/products-dummy.json";
import { Product } from "@/types/product";
export async function getProducts() {
  const res: Array<Product> = productDummy;
  return res;
}

export async function getProduct(productId: String) {
  const res: Product | undefined = (await getProducts()).find(
    (product: Product) => product.productId.toString() == productId
  );
  return res;
}
