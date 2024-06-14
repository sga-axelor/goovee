import {ThemeOptions} from '@/types/ThemeOptions';

const generateCssVar = (css: ThemeOptions) => {
  const dynamicCss = `
    :root {
        --body-light: ${css?.colors?.body?.light};
        --main-purple: ${css?.colors?.main?.purple};
        --detail-blue: ${css?.colors?.detail?.blue};
        --link-blue: ${css?.colors?.link?.blue};
        --success-light: ${css?.colors?.success?.light};
        --success-dark: ${css?.colors?.success?.dark};
        --error-light: ${css?.colors?.error?.light};
        --error-dark:${css?.colors?.error?.light};
        --warning-light: ${css?.colors?.warning?.light};
        --warning-dark: ${css?.colors?.warning?.dark};
        --primary-light: ${css?.colors?.primary?.light};
        --primary-dark: ${css?.colors?.primary?.dark};
        --secondary-light: ${css?.colors?.secondary?.light};
        --secondary-dark: ${css?.colors?.secondary?.dark};
        --default-light: ${css?.colors?.default?.light};
        --default-dark: ${css?.colors?.default?.dark};
        --background: ${css?.colors?.background};
        --foreground: ${css?.colors?.foreground};

        --primary: ${css?.colors?.primary?.DEFAULT};
        --primary-foreground: ${css?.colors?.primary?.foreground};
        --secondary: ${css?.colors?.secondary?.DEFAULT};
        --secondary-foreground: ${css?.colors?.secondary?.foreground};
        --destructive: ${css?.colors?.destructive?.DEFAULT};
        --destructive-foreground:${css?.colors?.destructive?.foreground};
        --muted: ${css?.colors?.muted?.DEFAULT};
        --muted-foreground: ${css?.colors?.muted?.foreground};
        --accent: ${css?.colors?.accent?.DEFAULT};
        --accent-foreground: ${css?.colors?.accent?.foreground};
        --card: ${css?.colors?.card?.DEFAULT};
        --card-foreground: ${css?.colors?.card?.foreground};
        --popover:${css?.colors?.popover?.DEFAULT};
        --popover-foreground: ${css?.colors?.popover?.foreground};
        --input: ${css?.colors?.input};
        --ring:${css?.colors?.ring};
        --border: ${css?.colors?.border};
    }

    body : {
      font-family : ${css.fontFamily} !important
    }
    `;
  return dynamicCss;
};
export default generateCssVar;
