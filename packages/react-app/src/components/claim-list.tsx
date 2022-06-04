import { Accordion, Box } from '@1hive/1hive-ui';
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
import { HelpTooltip } from './field-input/help-tooltip';
import * as QuestService from '../services/quest.service';
import Claim from './claim';
import TextFieldInput from './field-input/text-field-input';

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

const BoxStyled = styled(Box)`
  display: flex;
  justify-content: space-around;
`;

const EvidenceWrapperStyled = styled.div`
  padding: ${GUpx(2)};
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
  const skeletonClaim = useMemo(() => {
    const fakeClaim = {} as ClaimModel;
    return [
      <Claim
        isLoading
        claim={fakeClaim}
        questData={questData}
        challengeDeposit={challengeDeposit}
      />,
      <EvidenceWrapperStyled>
        <TextFieldInput id="evidence" isLoading />
      </EvidenceWrapperStyled>,
    ];
  }, []);

  const accordionItems = useMemo(() => {
    const items = claims.map((claim: ClaimModel) => [
      <Claim
        claim={claim}
        challengeDeposit={challengeDeposit}
        questData={questData}
        isLoading={isLoading}
      />,
      <EvidenceWrapperStyled>
        <TextFieldInput
          id="evidence"
          value={claim.evidence}
          isMarkDown
          wide
          blockVisibility="collapsed"
          label="Evidence of completion"
        />
        {claim.contactInformation && (
          <TextFieldInput
            id="contact"
            value={claim.contactInformation}
            wide
            label="Contact information"
          />
        )}
      </EvidenceWrapperStyled>,
    ]);
    if (loadingClaim) {
      items.unshift(skeletonClaim);
    }
    return items;
  }, [claims, loadingClaim, questData.bounty, isLoading, challengeDeposit]);

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
      const results = await QuestService.fetchQuestClaims(questData);
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
        <Accordion items={accordionItems} className="accordion-fit-content" />
      ) : (
        <BoxStyled>
          <i>No claims</i>
        </BoxStyled>
      )}
    </WrapperStyled>
  );
}
