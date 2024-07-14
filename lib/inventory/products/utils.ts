import { toast } from "@/components/ui/use-toast";
import { numberFixedToString } from "@/lib/utils";
import { Product } from "@/types/product.d";

type TGetProductsBody = {
  page: number;
  perPage: number;
};

export type TProductLists = {
  product_id: number;
  product_name: string;
  unit_price: number;
  unit: string;
  qty: number;
};

export function mappingProductLists(
  rawProductLists: Product[]
): TProductLists[] {
  return rawProductLists.map((product) => {
    return {
      product_id: product.product_id,
      product_name: product.name,
      unit_price: Number(product.buy.buy_price),
      unit: product.unit,
      qty: Number(product.qty) && 0,
    };
  });
}

export async function getProducts(
  merchant_id: String,
  pageParam?: TGetProductsBody,
  search?: string,
  setLastPage?: (lastPage: number) => void,
  setIsLoading?: (state: boolean) => void
): Promise<Array<Product>> {
  const searchParams = search ? `&search=${search}` : "";
  const pageParamPath = pageParam
    ? `&page=${pageParam.page}&per_page=${pageParam.perPage}`
    : "";

  setIsLoading?.(true);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/products?merchant_id=${merchant_id}${pageParamPath}${searchParams}`,
    { cache: "force-cache", method: "GET" }
  )
    .then((res) => res.json())
    .then((data) => {
      const products: Array<Product> = data.data;
      setLastPage?.(data.meta.last_page);
      return products;
    })
    .catch((e) => {
      throw new Error("Failed to fetch data", e);
    });

  setIsLoading?.(false);
  return res;
}

export const getProduct = async (product_id: String): Promise<Product> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/products/${product_id}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      let product: Product = data.data;
      product.buy.buy_price = Number(product.buy.buy_price);
      product.sell.sell_price = Number(product.sell.sell_price);
      if (!product.children) {
        product.children = [];
      }
      return product;
    })
    .catch((e) => {
      throw new Error("Failed to fetch data", e);
    });
  return res;
};

export const deleteProduct = async (product_id: number) => {
  fetch(`${process.env.NEXT_PUBLIC_URL}/api/products/${product_id}`, {
    method: "DELETE",
  }).catch((e) => {
    throw new Error("Failed to fetch data", e);
  });
};

export const createProduct = async (
  data: Product,
  merchant_id: String,
  router: any
) => {
  data.merchant_id = Number(merchant_id);
  let product: any = data;

  product.buy.buy_price = numberFixedToString(data.buy.buy_price);
  product.sell.sell_price = numberFixedToString(data.sell.sell_price);

  console.log(JSON.stringify(product));
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
    redirect: "follow",
  })
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw new Error(text);
        });
      } else {
        return res.json();
      }
    })
    .catch((err: Error) => {
      toast({
        title: `Error: ${JSON.parse(err.message).message}`,
        description: `${JSON.stringify(JSON.parse(err.message).errors)}`,
      });
      return null;
    });
  if (response === null) return null;
  toast({
    description: "Your product has been submitted.",
  });
  router.push("/inventory");
};

export const updateProduct = async (
  data: Product,
  merchant_id: String,
  product_id: String,
  router: any
) => {
  data.merchant_id = Number(merchant_id);
  let product: any = data;

  product.buy.buy_price = numberFixedToString(data.buy.buy_price);
  product.sell.sell_price = numberFixedToString(data.sell.sell_price);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/products/${product_id}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
      redirect: "follow",
    }
  )
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw new Error(text);
        });
      } else {
        return res.json();
      }
    })
    .catch((err: Error) => {
      toast({
        title: `Error: ${JSON.parse(err.message).message}`,
        description: `${JSON.stringify(JSON.parse(err.message).errors)}`,
      });
      return null;
    });
  if (response === null) return null;
  toast({
    description: "Your product has been updated.",
  });
  router.push("/inventory");
};
