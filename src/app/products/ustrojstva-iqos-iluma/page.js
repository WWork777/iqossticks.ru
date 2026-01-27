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

async function fetchItems() {
  const baseUrl =
    process.env.NODE_ENV === "production" && typeof window === "undefined"
      ? "http://localhost:3005"
      : "";

  try {
    return await safeFetch(`${baseUrl}/api/products/getiqos`, {
      cache: "no-store",
    });
  } catch (error) {
    console.error("Fetch error for iqos devices:", error.message);
    throw new Error("Ошибка загрузки товаров");
  }
}

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get("host") || "iqossticks.ru";
  const domain = host.replace(/^www\./, "");
  const pageUrl = `https://${domain}/products/ustrojstva-iqos-iluma`;

  const title = "Устройства IQOS — купить";
  const description =
    "Устройства IQOS и ILUMA. Оригинал, актуальные модели, гарантия.";

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      images: [
        {
          url: `https://${domain}/favicon/web-app-manifest-512x512.png`,
          alt: `IQOS устройства`,
        },
      ],
    },
  };
}

export default async function Page() {
  let items = [];

  try {
    items = await fetchItems();
  } catch (error) {
    console.error("Page fetch error:", error);
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Ошибка загрузки</h1>
        <p>Не удалось загрузить список устройств.</p>
        <a href="/" style={{ color: "blue" }}>
          На главную
        </a>
      </div>
    );
  }

  return (
    <div className="products-container">
      <h1 className="page-title">Купить IQOS ILUMA</h1>
      <ClientFilters items={items} />
    </div>
  );
}
