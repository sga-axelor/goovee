import axios from 'axios';

let bundle: Record<string, string> = {};

export namespace i18n {
  export async function load(code: string) {
    // load the translation catalog
    bundle = await axios
      .get(`${process.env.NEXT_PUBLIC_HOST}/api/locale/${code}`)
      .then(({data}) => data);
  }

  export function get(text: string, ...args: any[]): string {
    let message = bundle[text] || bundle[(text || '').trim()] || text;
    if (message && args.length) {
      for (let i = 0; i < args.length; i++) {
        let placeholder = new RegExp(`\\{${i}\\}`, 'g');
        let value = args[i];
        message = message.replace(placeholder, value);
      }
    }
    return message;
  }

  export function getValueAttribute(text: string, ...args: any[]): string {
    const key = `value:${text}`;
    const value = i18n.get(key);
    const translated = key !== value;

    return translated ? value : i18n.get(text);
  }
}
