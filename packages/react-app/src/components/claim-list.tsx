import { ClaimModel } from 'src/models/claim.model';
import styled from 'styled-components';
import { GUpx } from 'src/utils/style.util';
import { ENUM_TRANSACTION_STATUS } from 'src/constants';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { QuestModel } from 'src/models/quest.model';
import { useEffect, useMemo, useState } from 'react';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { useIsMountedRef } from 'src/hooks/use-mounted.hook';
import { noop } from 'lodash';
import { ThemeInterface } from 'src/styles/theme';
import { useThemeContext } from 'src/contexts/theme.context';
import { HelpTooltip } from './field-input/help-tooltip';
import * as QuestService from '../services/quest.service';
import Claim from './claim';

// #region StyledComponents

const ClaimHeaderStyled = styled.div`
  display: flex;
  align-items: center;
`;

const WrapperStyled = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: ${GUpx(2)};
`;

const HeaderStyled = styled.h1`
  font-size: large;
  margin-left: ${GUpx(1)};
`;

const ClaimsWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const NoClaimBoxStyled = styled.div<{ theme: ThemeInterface }>`
  background: ${({ theme }: any) => theme.surfaceUnder} !important;
  padding: ${GUpx(2)};
  border-radius: 8px;
  width: 95%;
  margin-left: ${GUpx(2)};
  margin-top: ${GUpx(2)};
  box-shadow: 10px 10px 15px 5px #00000029;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
`;

// #endregion

type Props = {
  questData: QuestModel;
  challengeDeposit: TokenAmountModel;
  isLoading?: boolean;
  onClaimsFetched?: (_claims: ClaimModel[]) => void;
};

export default function ClaimList({
  questData,
  challengeDeposit,
  isLoading = false,
  onClaimsFetched = noop,
}: Props) {
  const [claims, setClaims] = useState<ClaimModel[]>([]);
  const [loadingClaim, setLoadingClaim] = useState(true);
  const { transaction } = useTransactionContext();
  const isMountedRef = useIsMountedRef();
  const { currentTheme } = useThemeContext();

  const skeletonClaim = useMemo(() => {
    const fakeClaim = {} as ClaimModel;
    return (
      <Claim
        isLoading
        claim={fakeClaim}
        questData={questData}
        challengeDeposit={challengeDeposit}
      />
    );
  }, []);

  useEffect(() => {
    if (questData.address) {
      fetchClaims();
    }
  }, [questData.address]);

  useEffect(() => {
    onClaimsFetched(claims);
  }, [claims]);

  useEffect(() => {
    // If tx completion impact Claims, update them
    if (
      transaction?.status === ENUM_TRANSACTION_STATUS.Confirmed &&
      transaction?.args?.questAddress === questData.address &&
      transaction?.type === 'ClaimSchedule'
    ) {
      fetchClaimsUntilNew();
    }
  }, [transaction?.status, transaction?.type]);

  const fetchClaimsUntilNew = (claimsCount?: number) => {
    if (!claimsCount) {
      setLoadingClaim(true);
      claimsCount = claims.length;
    }
    setTimeout(async () => {
      const results = await QuestService.fetchQuestClaims(questData, false);
      if (!isMountedRef.current) return;
      if (results.length === claimsCount) {
        fetchClaimsUntilNew(claimsCount);
      } else {
        setClaims(results);
        setLoadingClaim(false);
      }
    }, 1000);
  };

  const fetchClaims = async () => {
    setLoadingClaim(true);
    const results = await QuestService.fetchQuestClaims(questData);
    if (!isMountedRef.current) return;
    setClaims(results); // Fetch visible data
    setLoadingClaim(false);
  };

  return (
    <WrapperStyled>
      <ClaimHeaderStyled>
        <HeaderStyled>Claims</HeaderStyled>
        <HelpTooltip tooltip="A claim includes the proof of the quest's completion." />
      </ClaimHeaderStyled>
      {claims?.length || loadingClaim ? (
        <ClaimsWrapperStyled>
          {loadingClaim && skeletonClaim}
          {claims.map((claim) => (
            <Claim
              challengeDeposit={challengeDeposit}
              claim={claim}
              questData={questData}
              isLoading={isLoading}
              key={claim.container?.id}
            />
          ))}
        </ClaimsWrapperStyled>
      ) : (
        <ClaimsWrapperStyled>
          <NoClaimBoxStyled theme={currentTheme}>No claims</NoClaimBoxStyled>
        </ClaimsWrapperStyled>
      )}
    </WrapperStyled>
  );
}
