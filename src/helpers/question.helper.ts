export const choiceSorter = (a: EditableInputValue, b: EditableInputValue): number => {
  return a.id - b.id;
};

export const generateChoices = (amount: number, prev: Array<EditableInputValue>): Array<EditableInputValue> => {
  return new Array(amount)
    .fill(0)
    .reduce((acc, _, index) => [...acc, { id: acc[prev.length - 1 + index]?.id + 1 || 0, name: '', checked: false }], prev);
};

export const removeChoices = (amount: number, prev: Array<EditableInputValue>): Array<EditableInputValue> => {
  return prev.sort(choiceSorter).slice(0, amount);
};
