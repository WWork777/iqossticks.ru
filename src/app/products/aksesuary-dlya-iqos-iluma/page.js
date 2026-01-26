import { headers } from "next/headers";

export const dynamic = "force-dynamic";
import ClientFilters from "./client";

async function fetchItems() {
  const res = await fetch("https://iluma-store.ru/api/products/getdevices", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Ошибка загрузки товаров");
  return res.json();
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
      title: `Аксессуары для IQOS`,
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
      <h1 className="page-title">Купить аксессуары для IQOS ILUMA</h1>
      <ClientFilters items={items} />
    </div>
  );
}
