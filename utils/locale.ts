export function getLanguageCode(localization: string) {
  return localization?.split('_')?.[0];
}

export function getLanguageCodeFromAcceptLanguage(
  languages: string | null,
): string | null {
  if (!languages) return null;

  return languages
    .split(',')
    .map(lang => {
      const [code, qValue] = lang?.trim()?.split(';q=');
      return {code, quality: qValue ? parseFloat(qValue) : 1.0};
    })
    .sort((a, b) => b?.quality - a?.quality)?.[0]?.code;
}
