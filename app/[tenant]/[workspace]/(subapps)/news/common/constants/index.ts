export const DEFAULT_LIMIT = 16;
export const DEFAULT_PAGE = 1;
export const DEFAULT_NEWS_ASIDE_LIMIT = 5;

// Button Labels
export const SUBSCRIBE = 'SUBSCRIBE';
export const SEND = 'SEND';

// Input
// Placeholder
export const SEARCH_HERE = 'Search here';

// Grid/List Titles
export const FEATURED_NEWS = 'Featured News';
export const LATEST_NEWS = 'Latest News';
export const RELATED_NEWS = 'Related News';
export const RECOMMENDED_NEWS = 'Recommended news';
export const CATEGORIES = 'Categories';
export const RELATED_FILES = 'Related files';

// Others
export const SHARE_ON_SOCIAL_MEDIA = 'Share on social media';
export const NO_NEWS_AVAILABLE = 'No news available.';
export const SOCIAL_ICONS = [
  {
    key: 1,
    name: 'linkedin',
    color: '#E0ECFF',
    image: '/images/linkedin.png',
    redirectUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL,
  },
  {
    key: 2,
    name: 'twitter',
    color: '#E6E7E7',
    image: '/images/twitter-x.png',
    redirectUrl: process.env.NEXT_PUBLIC_TWITTER_URL,
  },
  {
    key: 3,
    name: 'instagram',
    color: '#FEF1CC',
    image: '/images/instagram.png',
    redirectUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
  },
  {
    key: 4,
    name: 'whatsapp',
    color: '#EBFFF0',
    image: '/images/whatsapp.png',
    redirectUrl: process.env.NEXT_PUBLIC_WHATSAPP_URL,
  },
];
export const NEWS = 'News';
export const COMMENTS = 'Comments';
export const POSTED_ON = 'Posted on';
export const PUBLISHED_ON = 'Published on';
export const WRITE_YOUR_COMMENT = 'Write your comment';
