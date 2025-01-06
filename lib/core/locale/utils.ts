export function translate(
  translations: Record<string, string>,
  text: string,
  ...interpolations: string[]
) {
  const key = text?.trim();
  let translation = translations[key] || key;

  interpolations?.forEach((interpolation: string, index) => {
    const placeholder = new RegExp(`\\{${index}\\}`, 'g');
    translation = translation.replace(placeholder, interpolation);
  });

  return translation;
}

export function getLocaleFromAcceptLanguage(
  languages: string | null,
): string | null {
  if (!languages) return null;

  return (
    languages
      .split(',')
      .map(
        (
          lang,
        ): {
          code: string;
          quality: number;
        } => {
          const [code, qValue] = lang.trim().split(';q=');
          return {
            code,
            quality: qValue ? parseFloat(qValue) : 1.0,
          };
        },
      )
      .sort((a, b) => b.quality - a.quality)[0]?.code || null
  );
}

export function transformLocale(locale: string) {
  return locale?.replaceAll('_', '-');
}
