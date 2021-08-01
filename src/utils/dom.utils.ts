export const hasClass = (el: Element, className: string): boolean => {
  return Array.from(el.classList).includes(className);
};

export const hasClasses = (el: Element, classNames: Array<string>): boolean => {
  return Array.from(el.classList).some((className) => classNames.includes(className));
};
