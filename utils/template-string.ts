const template = (strings: TemplateStringsArray, ...values: any[]) =>
  String.raw({raw: strings}, ...values);

export const sql = template;
export const html = template;
export const xml = template;
