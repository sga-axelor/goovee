import {clone} from '@/utils';

// ---- LOCAL IMPORTS ---- //
import MobileMenuCategory from '@/subapps/news/mobile-menu-category';
import {findCategories} from '@/subapps/news/common/orm/news';

export default async function Layout({children}: {children: React.ReactNode}) {
  const allCategories = await findCategories({
    showAllCategories: true,
  }).then(clone);

  return (
    <>
      {children}
      <MobileMenuCategory categories={allCategories} />
    </>
  );
}
