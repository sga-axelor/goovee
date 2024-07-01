'use client';

import React, {useState, useMemo} from 'react';
import {
  MdApps,
  MdNewspaper,
  MdNotificationsNone,
  MdClose,
  MdArrowBackIos,
  MdArrowForwardIos,
} from 'react-icons/md';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {Avatar, AvatarImage} from '@/ui/components/avatar';

// ---- LOCAL IMPORTS ---- //
import {Category} from '@/subapps/news/common/types';
import {buildCategoryHierarchy} from '@/subapps/news/common/utils';

enum MenuState {
  Hidden,
  Main,
  SubMenu,
}

interface MenuBarProps {
  categories: Category[];
}

interface CategoryListProps {
  categories: Category[];
  onMenu: (category: Category) => void;
  onChevron: (category: Category) => void;
  parentCategory?: Category | null;
  menuState: MenuState;
  onBack: () => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onMenu,
  onChevron,
  parentCategory,
  menuState,
  onBack,
}) => (
  <>
    {menuState !== MenuState.Main && (
      <div
        className="flex items-center p-2 cursor-pointer border-b border-palette-gray-100"
        onClick={onBack}>
        <MdArrowBackIos />
        {parentCategory && (
          <div className="ml-2 font-semibold text-base">
            {parentCategory.name}
          </div>
        )}
      </div>
    )}
    {categories.map((category, i) => (
      <div
        key={category.id}
        className={`px-6 py-6 flex justify-between ${
          i === categories.length - 1 ? '' : 'border-b border-palette-gray-100'
        }`}>
        <div className="cursor-pointer" onClick={() => onMenu(category)}>
          {category.name}
        </div>
        {category.childCategory && category.childCategory.length > 0 && (
          <MdArrowForwardIos
            className="cursor-pointer"
            onClick={() => onChevron(category)}
          />
        )}
      </div>
    ))}
  </>
);

export const MenuBar: React.FC<MenuBarProps> = ({categories}) => {
  const [menuState, setMenuState] = useState<MenuState>(MenuState.Hidden);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [categoryStack, setCategoryStack] = useState<Category[]>([]);

  const router = useRouter();

  const categoryHierarchy = useMemo(() => {
    return buildCategoryHierarchy(categories);
  }, [categories]);

  const handleOpenMainMenu = () => setMenuState(MenuState.Main);

  const handleClose = () => {
    setMenuState(MenuState.Hidden);
    setSelectedCategory(null);
    setCategoryStack([]);
  };

  const handleMenu = (category: Category) => {
    const currentStack = selectedCategory
      ? [...categoryStack, selectedCategory]
      : categoryStack;
    handleRoute([...currentStack, category]);
  };

  const handleChevron = (category: Category) => {
    if (category.childCategory && category.childCategory.length > 0) {
      if (selectedCategory) {
        setCategoryStack(prevStack => [...prevStack, selectedCategory]);
      }
      setSelectedCategory(category);
      setMenuState(MenuState.SubMenu);
    }
  };

  const handleBack = () => {
    setCategoryStack(prevStack => {
      const newStack = [...prevStack];
      const parentCategory = newStack.pop() || null;
      setSelectedCategory(parentCategory);
      setMenuState(parentCategory ? MenuState.SubMenu : MenuState.Main);
      return newStack;
    });
  };

  const handleRoute = (categoryPath: Category[]) => {
    const path = categoryPath.map(category => category.slug).join('/');
    router.push(`/news/${path}`);
  };

  return (
    <div>
      <div className="md:hidden w-full bg-palette-purple-100 fixed z-10 bottom-0 flex py-4 px-8 justify-between">
        <MdApps className="text-2xl cursor-pointer" />
        <MdNewspaper
          className="text-2xl cursor-pointer"
          onClick={handleOpenMainMenu}
        />
        <MdNotificationsNone className="text-2xl cursor-pointer" />

        <Avatar className={`rounded-full w-8 h-8 cursor-pointer`}>
          <AvatarImage src="/images/no-image.png" />
        </Avatar>
      </div>
      {menuState !== MenuState.Hidden && (
        <div className="bg-white w-11/12 h-screen rounded-r-lg mr-4 fixed z-10 top-0 overflow-auto">
          <div className="flex justify-end p-4">
            <MdClose onClick={handleClose} />
          </div>
          <div className="flex flex-col mb-10">
            {menuState === MenuState.Main && (
              <CategoryList
                categories={categoryHierarchy}
                onMenu={handleMenu}
                onChevron={handleChevron}
                menuState={menuState}
                onBack={handleBack}
              />
            )}
            {menuState === MenuState.SubMenu && selectedCategory && (
              <CategoryList
                categories={selectedCategory.childCategory!}
                onMenu={handleMenu}
                onChevron={handleChevron}
                parentCategory={selectedCategory}
                menuState={menuState}
                onBack={handleBack}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuBar;
