import { NextResponse } from "next/server";

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function POST(request: Request) {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    console.error("Configuration Shopify manquante:", {
      domainExists: !!SHOPIFY_STORE_DOMAIN,
      tokenExists: !!SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    });

    return NextResponse.json(
      { error: "Configuration Shopify manquante" },
      { status: 500 }
    );
  }

  try {
    const { query, variables } = await request.json();
    console.log("Store URL:", SHOPIFY_STORE_DOMAIN);
    console.log("Variables GraphQL:", variables);

    const graphqlUrl = `https://${SHOPIFY_STORE_DOMAIN}/api/2023-01/graphql.json`;
    console.log("URL de l'API GraphQL:", graphqlUrl);

    const response = await fetch(graphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    console.log("Statut de la réponse Shopify:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Shopify API Error:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
      throw new Error(
        `Erreur API Shopify: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Réponse de l'API reçue avec succès");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error details:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
