interface ILink {
  name: string;
  path: string;
  active?: boolean;
}

interface IMenu {
  title: string;
  links: Array<ILink>;
}

interface IBasicModel {
  id?: number;
  name: string;
  slug: string;
}

type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  gender: boolean | null;
  createdAt: Date;
  updatedAt: Date;
};

type Group = {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

type Role = {
  name: string;
  slug: string;
  permission: number;
  createdAt: Date;
  updatedAt: Date;
};

type DropdownValues = Array<{ name: string; slug: string }>;
