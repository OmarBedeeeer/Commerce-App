export interface UserRequestBody {
  email: string;
  password: string;
  username: string;
  phoneNumber: string;
  age: number;
  address: string;
  role?: string;
}
export interface userChangePasswordBody {
  oldPassword: string;
  newPassword: string;
}
export interface userParams {
  id: string;
}
export interface userLogin {
  userName: string;
  password: string;
}

export interface body {
  name?: string;
  description?: string;
  image?: string;
  quantity?: number;
  price?: number;
}

export interface subCatQuery {
  category_name: string;
}

export interface ParamsIds {
  categoryId?: string;
  subCategoryId?: string;
  productId?: string;
  cartId?: string;
}
export interface subCategoriesId {
  subcategoryId: string;
}
