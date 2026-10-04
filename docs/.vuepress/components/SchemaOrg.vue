<template>
  <component :is="'script'" type="application/ld+json" v-html="schemaData" />
</template>

<script setup>
import { computed } from 'vue';
import { usePageData, usePageFrontmatter } from '@vuepress/client';

const pageData = usePageData();
const frontmatter = usePageFrontmatter();

const schemaData = computed(() => {
  const baseUrl = 'https://clash-jichang.com';
  const path = pageData.value.path;
  const title = frontmatter.value.title || pageData.value.title;
  const description = frontmatter.value.description || '';

  // 首页：网站 + 组织
  if (path === '/') {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          url: baseUrl,
          name: 'Clash机场推荐指南 - 科学上网机场测评与VPN梯子推荐',
          description: '2026年机场推荐与VPN梯子指南，持续更新稳定机场、便宜机场、性价比机场和IPLC/IEPL专线测评，并提供Clash、Shadowrocket、V2Ray配置教程。',
          inLanguage: 'zh-CN',
          publisher: {
            '@id': `${baseUrl}/#organization`,
          },
        },
        {
          '@type': 'Organization',
          '@id': `${baseUrl}/#organization`,
          name: '机场推荐指南',
          url: baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`,
          },
          sameAs: [],
        },
      ],
    });
  }

  // 机场推荐页：列表页
  if (path === '/airport/' || path === '/airport/index.html') {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description: description,
      url: `${baseUrl}${path}`,
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
      },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '稳定机场推荐', url: `${baseUrl}/airport/best-airport-2026.html` },
          { '@type': 'ListItem', position: 2, name: '便宜机场推荐', url: `${baseUrl}/airport/cheap-airport.html` },
          { '@type': 'ListItem', position: 3, name: 'IPLC/IEPL专线机场', url: `${baseUrl}/airport/iepl-iplc.html` },
          { '@type': 'ListItem', position: 4, name: '机场订阅导入教程', url: `${baseUrl}/airport/subscription-guide.html` },
        ],
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: '首页',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '机场推荐',
            item: `${baseUrl}/airport/`,
          },
        ],
      },
    });
  }

  // 单个机场评测：产品评测
  if (path.includes('/airport/') && !path.endsWith('README.md')) {
    const airportName = title.split('-')[0]?.trim() || title;

    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: {
        '@type': 'Product',
        name: airportName,
        description: description,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '4.5',
        bestRating: '5',
      },
      author: {
        '@type': 'Organization',
        name: '机场推荐指南',
      },
      reviewBody: description,
      datePublished: pageData.value.git?.createdTime
        ? new Date(pageData.value.git.createdTime).toISOString()
        : new Date().toISOString(),
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: '首页',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '机场推荐',
            item: `${baseUrl}/airport/`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: airportName,
            item: `${baseUrl}${path}`,
          },
        ],
      },
    });
  }

  // FAQ 页：FAQ Schema
  if (path.includes('/faq/')) {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      name: title,
      description: description,
      mainEntity: [
        {
          '@type': 'Question',
          name: '机场和 VPN 有什么区别？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '机场是基于 Shadowsocks、V2Ray、Trojan 等协议的代理服务，支持多节点订阅和自动分流；VPN 是传统虚拟专用网络，通常单节点连接，易被检测封禁。',
          },
        },
        {
          '@type': 'Question',
          name: 'Clash 订阅链接如何导入？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '打开 Clash 客户端，点击「配置」或「订阅」，粘贴机场提供的订阅链接，点击下载或更新即可。',
          },
        },
        {
          '@type': 'Question',
          name: '为什么晚高峰速度变慢？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '晚高峰（19:00-23:00）是网络使用高峰期，线路拥堵导致速度下降。建议选择 IEPL/IPLC 专线机场，或在非高峰时段使用。',
          },
        },
        {
          '@type': 'Question',
          name: '如何防止机场跑路？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '首选月付模式，避免大额年付；优先选择运营 2 年以上老牌机场；备用 1-2 个低价机场；关注 TG 群动态。',
          },
        },
        {
          '@type': 'Question',
          name: '什么是 IEPL 和 IPLC 专线？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'IEPL 和 IPLC 是国际专线，点对点直连，不经过公网，抗封锁能力强，速度稳定，延迟低，价格较高。',
          },
        },
      ],
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: '首页',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '常见问题',
            item: `${baseUrl}/faq/`,
          },
        ],
      },
    });
  }

  // 默认：文章页
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: `${baseUrl}${path}`,
    datePublished: pageData.value.git?.createdTime
      ? new Date(pageData.value.git.createdTime).toISOString()
      : new Date().toISOString(),
    dateModified: pageData.value.git?.updatedTime
      ? new Date(pageData.value.git.updatedTime).toISOString()
      : new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: '机场推荐指南',
    },
    publisher: {
      '@type': 'Organization',
      name: '机场推荐指南',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    inLanguage: 'zh-CN',
  });
});
</script>
