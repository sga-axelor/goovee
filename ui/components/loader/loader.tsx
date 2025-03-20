// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';

export function Loader() {
  return <p>{i18n.t('Loading')}...</p>;
}

export default Loader;
