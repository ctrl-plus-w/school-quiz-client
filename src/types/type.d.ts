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
  groups: Array<Group>;
  role?: Role;
  createdAt: Date;
  updatedAt: Date;
};

type Group = {
  id: number;
  name: string;
  slug: string;
  labels: Array<Label>;
  createdAt: Date;
  updatedAt: Date;
};

type Label = {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

type State = {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

type Role = {
  id: number;
  name: string;
  slug: string;
  permission: number;
  createdAt: Date;
  updatedAt: Date;
};

type UINotificationType = 'INFO' | 'ERROR';

type UINotification = {
  type: UINotificationType;
  content: string;
  id?: string;
};

type DropdownValues = Array<{ name: string; slug: string }>;

type NotificationContextState = {
  notifications: Array<UINotification>;
  addNotification: (notifications: UINotification) => void;
  removeNotification: (notifications: UINotification) => void;
};
