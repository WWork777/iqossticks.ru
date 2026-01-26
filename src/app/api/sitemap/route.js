import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://iqossticks.ru";
  const subdomains = [
    "msk",
    "moscow",
    "spb",
    "ekb",
    "kazan",
    "nn",
    "chelyabinsk",
    "samara",
    "omsk",
    "rostov",
    "ufa",
    "krasnoyarsk",
    "perm",
    "voronezh",
    "volgograd",
    "krasnodar",
    "novosibirsk",
    "nsk",
    "khabarovsk",
    "vladivostok",
    "irkutsk",
    "kemerovo",
    "krym",
    "donetsk",
    "dnr",
    "kaliningrad",
  ];

  // Пути, которые должны быть на всех доменах (основном и поддоменах)
  const commonPaths = [
    "", // Главная
    "/contacts",
    "/products",
    "/products/ustrojstva-iqos-iluma",
    "/products/stiki-terea-dlya-iqos-iluma",
    "/products/aksesuary-dlya-iqos-iluma",
  ];

  // Генерация URL для основного домена
  const mainUrls = commonPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastmod: new Date().toISOString(),
    changefreq: "daily",
    priority: path === "" ? 1.0 : 0.8,
  }));

  // Генерация URL для всех поддоменов
  const subdomainUrls = subdomains.flatMap((sub) =>
    commonPaths.map((path) => ({
      url: `https://${sub}.iqossticks.ru${path}`,
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: path === "" ? 0.9 : 0.7, // Поддомены получают немного меньший приоритет
    })),
  );

  const allUrls = [...mainUrls, ...subdomainUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(
      ({ url, lastmod, changefreq, priority }) => `
    <url>
      <loc>${url}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>${changefreq}</changefreq>
      <priority>${priority}</priority>
    </url>
  `,
    )
    .join("")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
