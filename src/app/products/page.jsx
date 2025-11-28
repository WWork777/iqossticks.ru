import './products.scss';
import '../../../components/Home/Hero/Hero.scss';
import Link from 'next/link';
import Image from 'next/image';
import Preview from '../../../components/Home/Preview/Preview';
import Exclusive from '../../../components/Home/Exclusive/Exclusive';
import { headers } from 'next/headers';

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get('host') || 'iqos-iluma.com';
  const domain = host.replace(/^www\./, '');

  return {
    title: "Купить IQOS ILUMA и стики Terea с доставкой по России",
    description: "Каталог устройств IQOS ILUMA и стиков Terea. Только оригинальная продукция. Быстрая доставка. IqosSticks.",
    alternates: {
      canonical: `https://${domain}/products`
    },
    openGraph: {
      title: "Купить IQOS ILUMA и стики Terea с доставкой по России",
      description: "Каталог устройств IQOS ILUMA и стиков Terea. Только оригинальная продукция. Быстрая доставка. IqosSticks.",
      url: `https://${domain}/products`,
      images: [
        {
          url: `/favicon/web-app-manifest-512x512`,
          alt: `IqosSticks`,
        },
      ],
    },
  };
}

export default function Products() {
  return (
    <div className="products-catalog-container">
      <h1>Каталог товаров</h1>
      <Preview />
      <h2>Популярное</h2>
      <Exclusive />
    </div>
  );
}
