import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getProducts } from "../services/product.service";

export type Product = {
  id: string;
  name: string;
  price: number;
  points: number;
  imageUri: string | null;
};

type ProductsContextValue = {
  products: Product[];
  isLoading: boolean;
  loadError: string | null;
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  reloadProducts: () => Promise<void>;
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reloadProducts = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      setProducts(await getProducts());
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudieron cargar los productos.";
      setLoadError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    getProducts()
      .then((loadedProducts) => {
        if (isMounted) {
          setProducts(loadedProducts);
          setLoadError(null);
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setLoadError(
            error instanceof Error ? error.message : "No se pudieron cargar los productos."
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const addProduct = (product: Product) => {
    setLoadError(null);
    setProducts((currentProducts) => [...currentProducts, product]);
  };

  const removeProduct = (id: string) => {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== id)
    );
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        isLoading,
        loadError,
        addProduct,
        removeProduct,
        reloadProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error("useProducts debe usarse dentro de ProductsProvider.");
  }

  return context;
}
