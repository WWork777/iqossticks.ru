import { fetchPosts } from '@/lib/fetch-posts'

// Генерация метаданных для статьи
export async function generateMetadata({ params }) {
  const { slug } = params
  const posts = await fetchPosts()
  const post = posts.find(item => item.url === slug)

  if (!post) {
    return {
      title: 'Статья не найдена',
      description: 'Запрошенная статья не существует или была удалена',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://iqossticks.ru'
  const postUrl = `${siteUrl}/blog/${post.url}`
  const imageUrl = `${siteUrl}/Blog/img/${post.url}.png`

  return {
    title: `${post.title} | Название Статьи`,
    description: post.text?.slice(0, 160) || 'Интересная статья в нашем блоге',
    keywords: post.tags?.join(', ') || 'блог, статья',

    openGraph: {
      title: post.title,
      description: post.text?.slice(0, 100) || 'Читайте статью в нашем блоге',
      url: postUrl,
      type: 'article',
      publishedTime: post.date,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.text?.slice(0, 100) || 'Новая статья в блоге',
      images: [imageUrl],
    },

    alternates: {
      canonical: postUrl,
    },
  }
}

import BlogArticle from '../../../../components/Blog/BlogArticle'
import BlogArticleSkeleton from '../../../../components/Blog/BlogArticleSkeleton'

const BlogArticlePage = async ({ params }) => {
  const { slug } = params
  const posts = await fetchPosts()
  const post = posts.find(item => item.url === slug)
  if (!post) {
    return <BlogArticleSkeleton />
  }
  return <BlogArticle post={post} />
}

export default BlogArticlePage
