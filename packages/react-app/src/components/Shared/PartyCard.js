import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { GU, textStyle, useTheme } from '@1hive/1hive-ui';
import styled from 'styled-components';
import partySvg from '../../assets/party.svg';
// import { useWallet } from '../providers/Wallet'
// import { useUserClaimData } from '../hooks/useUserClaim'

// #region StyledComponents

const ContainerStyled = styled.div`
  padding: ${5 * GU}px;
  border: 1px solid ${({ border }) => border};
  background: white;
  border-radius: 10px;

  cursor: pointer;
  transition: box-shadow 0.4s ease;

  &:hover {
    box-shadow: 0px 1px 2px 0px rgb(0, 0, 0, 0.2);
  }
`;

const NameWrapperStyled = styled.div`
  display: flex;
  align-items: center;
`;

const NameContainerStyled = styled.div`
  margin-left: ${2 * GU}px;
  ${textStyle('title3')};
`;

const WrapperStyled = styled.div`
  margin-top: ${2 * GU}px;
`;

const LabelStyled = styled.label`
  color: ${({ color }) => color};
  margin-bottom: ${2 * GU}px;
`;

const BodyStyled = styled.div`
  ${textStyle('body2')};
`;

// #endregion

function PartyCard({ party }) {
  const theme = useTheme();
  const history = useHistory();
  // const { account } = useWallet()

  // const claimInfo = useUserClaimData(account, party.id)

  const handleSelect = useCallback(() => {
    history.push(`/party/${party.id}`);
  }, [history, party.id]);

  const vestedTokens = useMemo(
    () => party.vestings.reduce((acc, vesting) => acc.plus(vesting.amount), BigInt('0')),
    [party.vestings],
  );

  return (
    <ContainerStyled onClick={handleSelect} border={theme.border}>
      <NameWrapperStyled>
        <img src={partySvg} alt="" height="40" />
        <NameContainerStyled>{party.name}</NameContainerStyled>
      </NameWrapperStyled>
      <WrapperStyled>
        <LabelStyled color={theme.contentSecondary}>Vested tokens:</LabelStyled>
        <NameContainerStyled>{vestedTokens.toString()}</NameContainerStyled>
      </WrapperStyled>
      <WrapperStyled>
        <LabelStyled color={theme.contentSecondary}>Deposited tokens:</LabelStyled>
        <BodyStyled>0</BodyStyled>
      </WrapperStyled>
    </ContainerStyled>
  );
}

export default PartyCard;
