export const dynamic = "force-dynamic";
import ClientFilters from "./client";
import { headers } from "next/headers";

async function fetchItems() {
  const res = await fetch("https://iluma-store.ru/api/products/getiqos", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Ошибка загрузки товаров");
  return res.json();
}

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get("host") || "iqossticks.ru";
  const domain = host.replace(/^www\./, "");
  const pageUrl = `https://${domain}/products/ustrojstva-iqos-iluma`;

  const title =
    "Купить устройства IQOS ILUMA в IqosSticks с доставкой по России";
  const description =
    "Каталог устройств IQOS ILUMA с доставкой по всей России. Лучший выбор вкусов и брендов!";

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
          url: `/favicon/web-app-manifest-512x512`,
          alt: `IqosIluma`,
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
    console.error(error);
    return <p>Ошибка загрузки данных</p>;
  }

  return (
    <div className="products-container">
      <h1 className="page-title">Купить IQOS ILUMA</h1>
      <ClientFilters items={items} />
    </div>
  );
}
