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

type UINotificationType = 'INFO' | 'ERROR' | 'SUCCESS' | 'WARNING';

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

type MapperFunction = (value: any) => string | ReactElement;

type BadgeType = 'DEFAULT' | 'WARNING' | 'ERROR' | 'SUCCESS' | 'INFO';

type VoidFunction = () => void;

interface ILoadHookConfig {
  notFoundRedirect?: string;
  doNotRefetch?: boolean;
  onNotFoundDoNothing?: boolean;
}

interface ILoadHookReturnProperties {
  state: 'LOADING' | 'FULFILLED';

  run: () => void;
}

type ILoadHookRedirectFunction = (path?: string) => void;
