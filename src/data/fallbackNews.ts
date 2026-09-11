import type { NewsItem } from '../types/news';

export const fallbackNews: NewsItem[] = [
  {
    id: 'demo-1',
    title: 'Exemplo de notícia do ROUTS',
    description:
      'Este conteúdo aparece apenas como fallback para testar a interface enquanto a API não está disponível.',
    content:
      'Conteúdo demonstrativo do ROUTS. Quando o backend estiver configurado, as notícias reais serão carregadas pela API.',
    url: '#',
    image: null,
    publishedAt: new Date().toISOString(),
    source: {
      name: 'ROUTS Demo',
      url: '#',
    },
  },
];
