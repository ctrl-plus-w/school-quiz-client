interface ILink {
  name: string;
  path: string;
  icon: React.ReactElement;
  active: boolean;
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

type AuthContextState = {
  token: string;
  setToken: (token: string) => void;
};

type EditableInputValue = { id: number; name: string; checked: boolean; defaultName?: string };

type AllOptional<T> = {
  [P in keyof T]?: T[P];
};

type Choice = {
  id: number;
  name: string;
  checked: boolean;
};

type MapperFunction = (value: any) => string;
