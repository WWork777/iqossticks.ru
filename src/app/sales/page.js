import React from 'react'
import './style.scss'
import { headers } from 'next/headers';

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get('host') || 'iqos-iluma.com';
  const domain = host.replace(/^www\./, '');

  return {
    title: "Скидки и акции в магазине IqosSticks",
    description: "Скидки и акции в магазине IqosSticks - покупайте премиальные устройства IQOS ILUMA и стики Terea по привлекательным ценам",
    alternates: {
      canonical: `https://${domain}/sales`
    },
    openGraph: {
      title: "Скидки и акции в магазине IqosSticks",
      description: "Скидки и акции в магазине IqosSticks - покупайте премиальные устройства IQOS ILUMA и стики Terea по привлекательным ценам",
      url: `https://${domain}/sales`,
      images: [
        {
          url: `/favicon/web-app-manifest-512x512`,
          alt: `IqosSticks`,
        },
      ],
    },
  };
}

const Sales = () => {
    return (
        <div className="sales">
            <h1>Акции</h1> 
            <div className='sales-three'>
                <h3>Каждый 11-й блок стиков в подарок!</h3>
                <p>При покупке 10ти блоков - 11й в подарок</p>
            </div>
            
        </div>
    )
}

export default Sales