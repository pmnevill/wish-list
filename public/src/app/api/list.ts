export interface List {
  _id?: string;
  name?: string;
  items?: Item[];
  userId?: string;
  purchased?: boolean;
  available?: boolean;
}

export interface Item {
  _id?: string;
  name?: string;
  price?: number;
  url?: string;
  img?: string;
  purchased?: boolean;
  ignorePurchased?: boolean;
  list?: string;
  favorite?: boolean;
  hidden?: boolean;
}

