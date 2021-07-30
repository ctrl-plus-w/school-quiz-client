import React, { ChangeEvent } from 'react';

interface IProps {
  checked: boolean;
  setChecked: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = ({ checked, setChecked }: IProps) => {
  return <input type="checkbox" checked={checked} onChange={setChecked} />;
};

export default Checkbox;
