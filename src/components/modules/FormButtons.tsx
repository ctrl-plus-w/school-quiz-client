import React, { ReactElement } from 'react';

import Button from '@element/Button';
import LinkButton from '@element/LinkButton';

interface IProps {
  href: string;
  valid: boolean;
  update?: boolean;
}

const FormButtons = ({ href, valid, update = false }: IProps): ReactElement => {
  return (
    <div className="flex mt-auto ml-auto">
      <LinkButton href={href} primary={false} className="mr-6">
        Annuler
      </LinkButton>

      <Button submit={true} disabled={!valid}>
        {update ? 'Modifier' : 'Créer'}
      </Button>
    </div>
  );
};

export default FormButtons;
