"use client";

import { useEffect, useState } from "react";

type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string;
      };
    }>;
  };
};

type ProductsData = {
  products: {
    edges: Array<{
      node: ShopifyProduct;
      cursor: string;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
};

const PRODUCTS_QUERY = `
  query Products($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const ITEMS_PER_PAGE = 12;

const ProductList = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cursors, setCursors] = useState<string[]>([]);
  const [debugInfo, setDebugInfo] = useState<{
    status: number;
    responseData: ProductsData | null;
  } | null>(null);

  const fetchProducts = async (page: number) => {
    try {
      setLoading(true);
      console.log("Envoi de la requête GraphQL à Shopify...");

      const variables = {
        first: ITEMS_PER_PAGE,
        after: page > 1 ? cursors[page - 2] : null,
      };

      const response = await fetch("/api/shopify/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: PRODUCTS_QUERY,
          variables,
        }),
      });

      const responseData = await response.json();

      setDebugInfo({
        status: response.status,
        responseData,
      });

      if (!response.ok) {
        throw new Error(
          `Erreur ${response.status}: ${
            responseData.error || "Erreur lors de la récupération des produits"
          }`
        );
      }

      if (!responseData.data) {
        throw new Error("Format de réponse invalide: data manquant");
      }

      const newProducts = responseData.data.products.edges.map(
        (edge: { node: ShopifyProduct; cursor: string }) => edge.node
      );

      setProducts(newProducts);

      // Mise à jour des curseurs pour la pagination
      if (page === 1) {
        setCursors([responseData.data.products.pageInfo.endCursor]);
      } else if (responseData.data.products.pageInfo.hasNextPage) {
        setCursors((prev) => [
          ...prev,
          responseData.data.products.pageInfo.endCursor,
        ]);
      }

      // Mise à jour du nombre total de pages
      setTotalPages((prev) =>
        responseData.data.products.pageInfo.hasNextPage ? page + 1 : page
      );
    } catch (err) {
      console.error("Erreur complète:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[400px] p-6"
        role="alert"
      >
        <p className="text-red-500 text-xl font-bold mb-4">{error}</p>
        {debugInfo && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md w-full max-w-3xl overflow-auto">
            <h3 className="text-gray-700 font-semibold mb-2">
              Informations de débogage:
            </h3>
            <pre className="text-xs text-gray-800 whitespace-pre-wrap">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
        <div className="mt-6">
          <button
            onClick={() => fetchProducts(currentPage)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            aria-label="Réessayer de charger les produits"
            tabIndex={0}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      {products.length > 0 && (
        <div className="w-full max-w-7xl mx-auto px-4 py-3 flex justify-between items-center bg-gray-50 border-b">
          <h2 className="text-lg font-medium text-gray-700">
            Produits <span className="text-gray-500">({products.length})</span>
          </h2>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 w-full max-w-7xl mx-auto">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <p className="text-lg text-gray-600">Aucun produit trouvé</p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              role="article"
              aria-label={`Produit : ${product.title}`}
            >
              <div className="aspect-w-1 aspect-h-1 w-full">
                <img
                  src={product.images.edges[0]?.node.url || "/placeholder.jpg"}
                  alt={product.images.edges[0]?.node.altText || product.title}
                  className="w-full h-60 object-cover object-center"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.title}
                </h2>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: product.priceRange.minVariantPrice.currencyCode,
                  }).format(
                    parseFloat(product.priceRange.minVariantPrice.amount)
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="w-full flex justify-center py-8">
          <nav className="flex items-center space-x-2" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              aria-label="Page précédente"
            >
              Précédent
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              aria-label="Page suivante"
            >
              Suivant
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProductList;
