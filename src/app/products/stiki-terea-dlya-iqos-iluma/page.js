import { headers } from "next/headers";

export const dynamic = "force-dynamic";
import ClientFilters from "./client";

async function fetchItems() {
  const res = await fetch("https://iluma-store.ru/api/products/getterea", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Ошибка загрузки товаров");
  return res.json();
}

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get("host") || "iqossticks.ru";
  const domain = host.replace(/^www\./, "");

  const url = `https://${domain}/products/stiki-terea-dlya-iqos-iluma`;
  const title = "Стики для IQOS и ILUMA";

  return {
    title,
    description:
      "Стики TEREA и HEETS для IQOS. Все вкусы в наличии, доставка по РФ.",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: "Стики для IQOS и ILUMA",
      description:
        "Стики TEREA и HEETS для IQOS. Все вкусы в наличии, доставка по РФ.",
      url,
      images: [
        {
          url: `/favicon/web-app-manifest-512x512`,
          alt: `IqosSticks`,
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
      <h1 className="page-title">Купить стики Terea</h1>
      <ClientFilters items={items} />
    </div>
  );
}
