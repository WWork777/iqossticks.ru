export const dynamic = 'force-dynamic';

import './style.scss';
import Link from 'next/link';
import Map from '../../../components/YandexMap/Map';
import { headers } from 'next/headers';

const cityNames = {
  msk: 'Москва',
  moscow: 'Москва',
  spb: 'Санкт-Петербург',
  ekb: 'Екатеринбург',
  kazan: 'Казань',
  nn: 'Нижний Новгород',
  chelyabinsk: 'Челябинск',
  samara: 'Самара',
  omsk: 'Омск',
  rostov: 'Ростов-на-Дону',
  ufa: 'Уфа',
  krasnoyarsk: 'Красноярск',
  perm: 'Пермь',
  voronezh: 'Воронеж',
  volgograd: 'Волгоград',
  krasnodar: 'Краснодар',
  novosibirsk: 'Новосибирск',
  nsk: 'Новосибирск',
  khabarovsk: 'Хабаровск',
  vladivostok: 'Владивосток',
  irkutsk: 'Иркутск',
  kemerovo: 'Кемерово',
  kaliningrad: 'Калининград',
  dnr:'Донецк',
  donetsk:'Донецк',
  krym:'Крым',
};

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get('host') || 'iqos-iluma.com';
  let subdomain = host.split('.')[0];
    if (host === 'iqos-iluma.com' || host === 'www.iqos-iluma.com' || host === 'localhost:3000') {
    subdomain = 'moscow';
  }
  const city = cityNames[subdomain]
  const title = `Контакты | IqosSticks ${city}`;
  const description = "Свяжитесь с магазином устройствв IQOS ILUMA и стики Terea – только оригинальная продукция. Быстрая доставка по всей России и скидки для постоянных клиентов.";
  const url = `https://${host}/contacts`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: `/favicon/web-app-manifest-512x512`,
          alt: `IqosILuma`,
        },
      ],
    },
  };
}

const Contacts = () => {
  const headersList = headers();
  const host = headersList.get('host') || '';
  let subdomain = host.split('.')[0];

  if (host === 'iqos-iluma.com' || host === 'www.iqos-iluma.com' || host === 'localhost:3000') {
    subdomain = 'moscow';
  }

  const showOffice = subdomain === 'moscow';
  const city = cityNames[subdomain] || 'Вашем городе';

  return (
    <div className='contacts'>
      <h1>Контакты</h1>

      <div className='adress'>
        <h3>Адрес</h3>
        {showOffice ? (
          <p>г. Москва - ул. Римского-Корсакова, 11, корп. 8 <br />Ориентир: Пункт OZON</p>
        ) : (
          <p>г. {city} (пункт СДЭК)</p>
        )}
        <p>Телефон: <Link href='tel:+7 (995) 153-80-19'>+7 (995) 153-80-19</Link></p>
        {showOffice && (
          <p>Время работы: с 10:00 до 23:00, без выходных</p>
        )}
      </div>

      <div className='social'>
        <h3>Социальные сети</h3>
        <p>Telegram: <Link href='https://t.me/Ilumastore2025'>@IqosIlumaRU</Link></p>
        <p>Whatsapp: <Link href='https://api.whatsapp.com/send/?phone=79951538019&text=Здравствуйте%21+Хочу+оформить+заказ&type=phone_number&app_absent=0'>@IqosIluma</Link></p>
      </div>

      {showOffice && <Map />}
    </div>
  );
};

export default Contacts;
