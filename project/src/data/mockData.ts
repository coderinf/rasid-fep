import { Company, NewsItem, SentimentData, SectorSentiment } from '../types';

export const companies: Company[] = [
  {
    id: '1',
    ticker: '1010',
    name: 'Saudi Aramco',
    nameAr: 'أرامكو السعودية',
    sector: 'Energy',
    logo: 'https://example.com/aramco.png',
  },
  {
    id: '2',
    ticker: '2222',
    name: 'Saudi Electricity Company',
    nameAr: 'الشركة السعودية للكهرباء',
    sector: 'Utilities',
    logo: 'https://example.com/sec.png',
  },
  {
    id: '3',
    ticker: '1150',
    name: 'Al Rajhi Bank',
    nameAr: 'مصرف الراجحي',
    sector: 'Financials',
    logo: 'https://example.com/alrajhi.png',
  },
  {
    id: '4',
    ticker: '2350',
    name: 'Saudi Telecom Company',
    nameAr: 'شركة الاتصالات السعودية',
    sector: 'Telecommunication',
    logo: 'https://example.com/stc.png',
  },
  {
    id: '5',
    ticker: '4240',
    name: 'SABIC',
    nameAr: 'سابك',
    sector: 'Materials',
    logo: 'https://example.com/sabic.png',
  },
];

export const getCompanySentiment = (companyId: string, days = 30): SentimentData[] => {
  const data: SentimentData[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Create some patterns in the data
    let baseScore = Math.sin(i / 10) * 0.5;
    
    // Add some randomness
    const randomFactor = Math.random() * 0.4 - 0.2;
    let score = baseScore + randomFactor;
    
    // Ensure score is between -1 and 1
    score = Math.max(-1, Math.min(1, score));
    
    data.push({
      id: `${companyId}-${i}`,
      companyId,
      date: date.toISOString().split('T')[0],
      score,
      volume: Math.floor(Math.random() * 100) + 20,
    });
  }
  
  return data;
};

export const getRecentNews = (count = 10): NewsItem[] => {
  const news: NewsItem[] = [
    {
      id: '1',
      title: 'Saudi Aramco reports strong Q3 earnings',
      titleAr: 'أرامكو السعودية تعلن عن أرباح قوية للربع الثالث',
      content: 'Saudi Aramco reported a 12% increase in net income for Q3 2025, exceeding analyst expectations.',
      contentAr: 'أعلنت أرامكو السعودية عن زيادة بنسبة 12% في صافي الدخل للربع الثالث من عام 2025، متجاوزة توقعات المحللين.',
      source: 'Reuters',
      url: 'https://example.com/news/1',
      publishedAt: '2025-06-15T09:30:00Z',
      sentiment: 0.78,
      relatedCompanies: ['1'],
      language: 'en'
    },
    {
      id: '2',
      title: 'SEC announces new renewable energy project',
      titleAr: 'الشركة السعودية للكهرباء تعلن عن مشروع جديد للطاقة المتجددة',
      content: 'Saudi Electricity Company has launched a new solar power project valued at $2 billion.',
      contentAr: 'أطلقت الشركة السعودية للكهرباء مشروعاً جديداً للطاقة الشمسية بقيمة 2 مليار دولار.',
      source: 'Al Eqtisadiah',
      url: 'https://example.com/news/2',
      publishedAt: '2025-06-14T14:15:00Z',
      sentiment: 0.65,
      relatedCompanies: ['2'],
      language: 'ar'
    },
    {
      id: '3',
      title: 'Al Rajhi Bank faces regulatory scrutiny',
      titleAr: 'مصرف الراجحي يواجه تدقيقًا تنظيميًا',
      content: 'Regulators are examining Al Rajhi Bank\'s compliance procedures following concerns about transactions.',
      contentAr: 'تقوم الجهات التنظيمية بفحص إجراءات الامتثال في مصرف الراجحي بعد مخاوف بشأن المعاملات.',
      source: 'Bloomberg',
      url: 'https://example.com/news/3',
      publishedAt: '2025-06-13T11:45:00Z',
      sentiment: -0.52,
      relatedCompanies: ['3'],
      language: 'en'
    },
    {
      id: '4',
      title: 'STC launches new 6G research initiative',
      titleAr: 'شركة الاتصالات السعودية تطلق مبادرة بحثية جديدة للجيل السادس',
      content: 'Saudi Telecom Company is investing $300 million in advanced 6G technology research.',
      contentAr: 'تستثمر شركة الاتصالات السعودية 300 مليون دولار في بحوث تقنية الجيل السادس المتقدمة.',
      source: 'Tech Daily',
      url: 'https://example.com/news/4',
      publishedAt: '2025-06-12T16:30:00Z',
      sentiment: 0.81,
      relatedCompanies: ['4'],
      language: 'en'
    },
    {
      id: '5',
      title: 'SABIC reports production issues at Jubail facility',
      titleAr: 'سابك تبلغ عن مشاكل في الإنتاج في منشأة الجبيل',
      content: 'SABIC\'s Jubail petrochemical facility is experiencing temporary production delays due to maintenance issues.',
      contentAr: 'تواجه منشأة سابك للبتروكيماويات في الجبيل تأخيرات مؤقتة في الإنتاج بسبب مشاكل في الصيانة.',
      source: 'Argaam',
      url: 'https://example.com/news/5',
      publishedAt: '2025-06-11T10:20:00Z',
      sentiment: -0.38,
      relatedCompanies: ['5'],
      language: 'ar'
    },
    {
      id: '6',
      title: 'Saudi Aramco signs deal with Chinese firms',
      titleAr: 'أرامكو السعودية توقع اتفاقية مع شركات صينية',
      content: 'Aramco has entered into a strategic partnership with leading Chinese energy companies.',
      contentAr: 'دخلت أرامكو في شراكة استراتيجية مع شركات الطاقة الصينية الرائدة.',
      source: 'Saudi Gazette',
      url: 'https://example.com/news/6',
      publishedAt: '2025-06-10T08:45:00Z',
      sentiment: 0.42,
      relatedCompanies: ['1'],
      language: 'en'
    },
    {
      id: '7',
      title: 'SEC dividend announcement disappoints investors',
      titleAr: 'إعلان أرباح الشركة السعودية للكهرباء يخيب آمال المستثمرين',
      content: 'Saudi Electricity Company\'s latest dividend announcement was lower than market expectations.',
      contentAr: 'جاء أحدث إعلان عن توزيعات الأرباح للشركة السعودية للكهرباء أقل من توقعات السوق.',
      source: 'CNBC Arabia',
      url: 'https://example.com/news/7',
      publishedAt: '2025-06-09T13:10:00Z',
      sentiment: -0.61,
      relatedCompanies: ['2'],
      language: 'ar'
    },
    {
      id: '8',
      title: 'Al Rajhi Bank expands digital services',
      titleAr: 'مصرف الراجحي يوسع الخدمات الرقمية',
      content: 'Al Rajhi Bank has launched new digital banking features targeting younger customers.',
      contentAr: 'أطلق مصرف الراجحي ميزات مصرفية رقمية جديدة تستهدف العملاء الأصغر سنا.',
      source: 'Arab News',
      url: 'https://example.com/news/8',
      publishedAt: '2025-06-08T09:55:00Z',
      sentiment: 0.73,
      relatedCompanies: ['3'],
      language: 'en'
    },
    {
      id: '9',
      title: 'STC faces new competition from foreign telecom',
      titleAr: 'شركة الاتصالات السعودية تواجه منافسة جديدة من شركات اتصالات أجنبية',
      content: 'New foreign telecom operators are challenging STC\'s market dominance following regulatory changes.',
      contentAr: 'تتحدى شركات الاتصالات الأجنبية الجديدة هيمنة شركة الاتصالات السعودية على السوق بعد التغييرات التنظيمية.',
      source: 'Financial Times',
      url: 'https://example.com/news/9',
      publishedAt: '2025-06-07T15:40:00Z',
      sentiment: -0.45,
      relatedCompanies: ['4'],
      language: 'en'
    },
    {
      id: '10',
      title: 'SABIC announces new sustainable product line',
      titleAr: 'سابك تعلن عن خط إنتاج مستدام جديد',
      content: 'SABIC is launching a new line of eco-friendly products to meet growing market demand.',
      contentAr: 'تطلق سابك خطًا جديدًا من المنتجات الصديقة للبيئة لتلبية الطلب المتزايد في السوق.',
      source: 'Al Arabiya',
      url: 'https://example.com/news/10',
      publishedAt: '2025-06-06T12:25:00Z',
      sentiment: 0.58,
      relatedCompanies: ['5'],
      language: 'ar'
    }
  ];
  
  return news.slice(0, count);
};

export const getSectorSentiment = (): SectorSentiment[] => {
  return [
    {
      sector: 'Energy',
      averageSentiment: 0.48,
      change: 0.12,
      volume: 230,
      companies: 12
    },
    {
      sector: 'Financials',
      averageSentiment: 0.31,
      change: -0.04,
      volume: 185,
      companies: 18
    },
    {
      sector: 'Materials',
      averageSentiment: 0.26,
      change: 0.07,
      volume: 142,
      companies: 15
    },
    {
      sector: 'Telecommunication',
      averageSentiment: 0.53,
      change: 0.09,
      volume: 98,
      companies: 4
    },
    {
      sector: 'Utilities',
      averageSentiment: -0.12,
      change: -0.21,
      volume: 78,
      companies: 6
    },
    {
      sector: 'Consumer Staples',
      averageSentiment: 0.17,
      change: 0.03,
      volume: 65,
      companies: 9
    },
    {
      sector: 'Health Care',
      averageSentiment: 0.43,
      change: 0.15,
      volume: 53,
      companies: 7
    },
    {
      sector: 'Real Estate',
      averageSentiment: -0.08,
      change: -0.11,
      volume: 112,
      companies: 11
    }
  ];
};