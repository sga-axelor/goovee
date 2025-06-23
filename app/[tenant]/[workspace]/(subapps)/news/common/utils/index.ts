export * from './common';

export function getSocialURL(code: string) {
  switch (code) {
    case 'linkedin':
      return getLinkedinURL();
    case 'twitter':
      return getTwitterURL();
    case 'instagram':
      return getInstagramURL();
    case 'whatsapp':
      return getWhatsappURL();
    default:
      return '';
  }
}

export function getLinkedinURL() {
  return process.env.GOOVEE_PUBLIC_LINKEDIN_URL;
}

export function getTwitterURL() {
  return process.env.GOOVEE_PUBLIC_TWITTER_URL;
}

export function getInstagramURL() {
  return process.env.GOOVEE_PUBLIC_INSTAGRAM_URL;
}

export function getWhatsappURL() {
  return process.env.GOOVEE_PUBLIC_WHATSAPP_URL;
}
