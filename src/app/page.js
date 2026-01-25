export const dynamic = "force-dynamic";

import { headers } from "next/headers";
import Hero from "../../components/Home/Hero/Hero";
import Poster from "../../components/Home/Poster/Poster";
import Preview from "../../components/Home/Preview/Preview";
import About from "../../components/Home/About/About";
import New from "../../components/Home/New/New";
import Exclusive from "../../components/Home/Exclusive/Exclusive";
import Reviews from "../../components/Home/Reviews/Reviews";
import ModalManager from "../../components/ModalManager/ModalManager";

const cityNames = {
  msk: "Москве",
  moscow: "Москве",
  spb: "Санкт-Петербурге",
  ekb: "Екатеринбурге",
  kazan: "Казани",
  nn: "Нижнем Новгороде",
  chelyabinsk: "Челябинске",
  samara: "Самаре",
  omsk: "Омске",
  rostov: "Ростове-на-Дону",
  ufa: "Уфе",
  krasnoyarsk: "Красноярске",
  perm: "Перми",
  voronezh: "Воронеже",
  volgograd: "Волгограде",
  krasnodar: "Краснодаре",
  novosibirsk: "Новосибирске",
  nsk: "Новосибирске",
  khabarovsk: "Хабаровске",
  vladivostok: "Владивостоке",
  irkutsk: "Иркутске",
  kemerovo: "Кемерово",
  dnr: "Донецке",
  donetsk: "Донецке",
  kaliningrad: "Калининграде",
  krym: "Крыму",
};

export function generateMetadata() {
  const headersList = headers();
  const host = headersList.get("host") || "";

  let subdomain = host.split(".")[0];
  if (
    host === "iqos-iluma.com" ||
    host === "www.iqos-iluma.com" ||
    host === "localhost:3000"
  ) {
    subdomain = "moscow";
  }

  const city = cityNames[subdomain] || "России";

  const title = `IQOS Iluma купить в ${city} | Стики Terea | IqosSticks`;
  const description = `Оригинальные устройства IQOS Iluma и стики Terea. Низкие цены, доставка в ${city}. Гарантия качества и подлинности.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://${host}`,
    },
    openGraph: {
      title,
      description,
      url: `https://${host}`,
      images: [
        {
          url: `/favicon/web-app-manifest-512x512`,
          alt: `IqosIluma`,
        },
      ],
    },
  };
}

export default function Home() {
  return (
    <>
      <Hero />
      <Poster />
      <Preview />
      <Exclusive />
      <New />
      <About />
      <Reviews />
    </>
  );
}
