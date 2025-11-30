export const dynamic = "force-dynamic";
import ClientFilters from "./client";
import { headers } from "next/headers";

async function fetchItems(type, ref) {
  const res = await fetch(
    `https://iluma-store.ru/api/products/getproductinfo/${type}/${ref}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Ошибка загрузки товаров");
  return res.json();
}

export async function generateMetadata({ params }) {
  const { type, ref } = params;
  const headersList = headers();
  const host = headersList.get("host") || "iqossticks.ru";
  const domain = host.replace(/^www\./, "");

  let items = {};
  try {
    items = await fetchItems(type, ref);
  } catch (error) {
    console.error(error);
  }

  const url = `https://${domain}/products/product-info/${items.type}/${items.ref}`;

  return {
    title: `Купить ${items.name} с доставкой по России`,
    description: items.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `Купить ${items.name} с доставкой по России`,
      description: items.description,
      url,
      images: [
        {
          url: `/images/${items.image}`,
          alt: items.name,
        },
      ],
    },
  };
}

export default async function Page({ params }) {
  const { type, ref } = params;
  let items = {};
  try {
    items = await fetchItems(type, ref);
  } catch (error) {
    console.error(error);
    return <p>Ошибка загрузки данных</p>;
  }

  return <ClientFilters items={items} />;
}
