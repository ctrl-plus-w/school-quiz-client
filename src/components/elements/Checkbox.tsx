import React, { ChangeEvent, FunctionComponent } from 'react';

interface IProps {
  checked: boolean;
  setChecked: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: FunctionComponent<IProps> = ({ checked, setChecked }: IProps) => {
  return <input type="checkbox" checked={checked} onChange={setChecked} />;
};

export default Checkbox;
