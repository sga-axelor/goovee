export interface Category {
  id: number;
  name: string;
  parentCategory?: Category;
  childCategory: Category[];
  slug: string;
}
