type QuizCreationAttributes = {
  title: string;
  description: string;
  strict: boolean;
  shuffle: boolean;
};

type APIResponse = [boolean, { status: number; message: string } | undefined];
