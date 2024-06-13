import {ThemeOptions} from '@/types/ThemeOptions';

const generateCssVar = (css: ThemeOptions) => {
  const dynamicCss = `
    :root {
        
    }
    `;
  return dynamicCss;
};
export default generateCssVar;
