import { headers } from "next/headers";

export const dynamic = "force-dynamic";
import ClientFilters from "./client";

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
    return await safeFetch(`${baseUrl}/api/products/getdevices`, {
      cache: "no-store",
    });
  } catch (error) {
    console.error("Fetch error for accessories:", error.message);
    throw new Error("Ошибка загрузки товаров");
  }
}

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get("host") || "iqossticks.ru";
  const domain = host.replace(/^www\./, "");
  const pageUrl = `https://${domain}/products/aksesuary-dlya-iqos-iluma`;

  const title = "Аксессуары для IQOS";
  const description =
    "Аксессуары для IQOS и ILUMA. Удобство, защита и уход за устройством.";

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
          alt: `Аксессуары IQOS`,
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
        <p>Не удалось загрузить список аксессуаров.</p>
        <a href="/" style={{ color: "blue" }}>
          На главную
        </a>
      </div>
    );
  }

  return (
    <div className="products-container">
      <h1 className="page-title">Купить аксессуары для IQOS ILUMA</h1>
      <ClientFilters items={items} />
    </div>
  );
}
