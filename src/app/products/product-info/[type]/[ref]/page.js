export const dynamic = "force-dynamic";
import ClientFilters from "./client";
import { headers } from "next/headers";

async function safeFetch(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

async function fetchItems(type, ref) {
  const baseUrl =
    process.env.NODE_ENV === "production" && typeof window === "undefined"
      ? "http://localhost:3005"
      : "";

  try {
    return await safeFetch(
      `${baseUrl}/api/products/getproductinfo/${type}/${ref}`,
      { cache: "no-store" },
    );
  } catch (error) {
    console.error(`Fetch error for ${type}/${ref}:`, error.message);
    throw new Error("Ошибка загрузки товаров");
  }
}

export async function generateMetadata({ params }) {
  const { type, ref } = params;
  const headersList = headers();
  const host = headersList.get("host") || "iqossticks.ru";
  const domain = host.replace(/^www\./, "");

  try {
    const items = await fetchItems(type, ref);
    const url = `https://${domain}/products/product-info/${type}/${ref}`;

    return {
      title: `Купить ${items.name} с доставкой по России`,
      description: items.description || `Купить ${items.name}`,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: `Купить ${items.name} с доставкой по России`,
        description: items.description || `Купить ${items.name}`,
        url,
        images: [
          {
            url: items.image
              ? `https://${domain}/images/${items.image}`
              : `https://${domain}/favicon/web-app-manifest-512x512.png`,
            alt: items.name,
          },
        ],
      },
    };
  } catch (error) {
    console.error("generateMetadata error:", error);
    return {
      title: "Товар не найден",
      description: "Товар не найден",
      robots: { index: false, follow: false },
    };
  }
}

export default async function Page({ params }) {
  const { type, ref } = params;

  try {
    const items = await fetchItems(type, ref);
    return <ClientFilters items={items} />;
  } catch (error) {
    console.error(`Page error for ${type}/${ref}:`, error);
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Товар не найден</h1>
        <p>Не удалось загрузить информацию о товаре.</p>
        <a href="/products" style={{ color: "blue" }}>
          Вернуться в каталог
        </a>
      </div>
    );
  }
}
