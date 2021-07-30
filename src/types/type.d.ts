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

type UINotificationType = 'info' | 'error';

type UINotification = {
  type: UINotificationType;
  content: string;
  id: string;
};

type DropdownValues = Array<{ name: string; slug: string }>;

type NotificationContextState = {
  notifications: Array<UINotification>;
  addNotification: (notifications: UINotification) => void;
  removeNotification: (notifications: UINotification) => void;
};
