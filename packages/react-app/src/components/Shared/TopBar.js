import { Bar, Button, GU } from '@1hive/1hive-ui';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useWallet } from '../../providers/Wallet';
import Filters from './Filters';
import Wizard from './wizard/Wizard';

// #region StyledComponents

const ContainerStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${1.5 * GU}px;
`;

// #endregion

function TopBar({ filters }) {
  const [opened, setOpened] = useState(false);
  const { account } = useWallet();

  const open = () => {
    setOpened(true);
  };
  const close = () => setOpened(false);

  return (
    <Bar>
      <ContainerStyled>
        {account ? <Filters filters={filters} /> : <div />}
        {account ? <Button label="Create party!" mode="strong" onClick={open} /> : <div />}
      </ContainerStyled>
      <Wizard opened={opened} close={close} />
    </Bar>
  );
}

export default TopBar;
