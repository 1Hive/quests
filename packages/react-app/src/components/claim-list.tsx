import { Accordion, Box } from '@1hive/1hive-ui';
import { ClaimModel } from 'src/models/claim.model';
import styled from 'styled-components';
import { GUpx } from 'src/utils/style.util';
import { ENUM_CLAIM_STATE, ENUM_TRANSACTION_STATUS } from 'src/constants';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { QuestModel } from 'src/models/quest.model';
import { useEffect, useState } from 'react';
import { getObjectFromIpfs, ipfsTheGraph } from 'src/services/ipfs.service';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { HelpTooltip } from './field-input/help-tooltip';
import * as QuestService from '../services/quest.service';
import Claim from './claim';
import { Outset } from './utils/spacer-util';
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

// #endregion

type Props = {
  questData: QuestModel;
  challengeDeposit: TokenAmountModel;
  isLoading?: boolean;
};

const loadingClaim = { state: ENUM_CLAIM_STATE.None } as ClaimModel;

export default function ClaimList({ questData, challengeDeposit, isLoading = false }: Props) {
  const [claims, setClaims] = useState<ClaimModel[]>([loadingClaim]);
  const [isLoadingState, setIsLoading] = useState(isLoading);
  const { transaction } = useTransactionContext();
  let isMounted = true;
  useEffect(
    () => () => {
      isMounted = false;
    },
    [],
  );

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (questData.address) {
      fetchClaims();
    }
  }, [questData.address]);

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
      claimsCount = claims.length;
      setClaims([loadingClaim, ...claims]);
    }
    setTimeout(async () => {
      const results = await QuestService.fetchQuestClaims(questData);
      if (!isMounted) return;
      if (results.length === claimsCount) {
        fetchClaimsUntilNew(claimsCount);
      } else {
        setClaims(results);
        setIsLoading(false);
        fetchEvidenceOfCompletions(results);
      }
    }, 1000);
  };

  const fetchClaims = async () => {
    setIsLoading(true);
    const results = await QuestService.fetchQuestClaims(questData);
    if (!isMounted) return;
    setClaims(results); // Fetch visible data
    setIsLoading(false);
    await fetchEvidenceOfCompletions(results);
  };

  const fetchEvidenceOfCompletions = async (result: ClaimModel[]) => {
    const claimsRes = await Promise.all(
      result.map(async (claim) => ({
        ...claim,
        evidence: claim.evidenceIpfsHash
          ? await getObjectFromIpfs(claim.evidenceIpfsHash, ipfsTheGraph)
          : 'No evidence',
      })),
    );
    if (!isMounted) return;
    setClaims(claimsRes); // Fetch evidence wich is currently hidden in accordion
  };

  return (
    <WrapperStyled>
      <ClaimHeaderStyled>
        <HeaderStyled>Claims</HeaderStyled>
        <HelpTooltip tooltip="A claim includes the proof of the quest's completion." />
      </ClaimHeaderStyled>
      {claims?.length || isLoadingState ? (
        <Accordion
          items={claims.map((claim: ClaimModel) => [
            <Claim
              claim={claim}
              challengeDeposit={challengeDeposit}
              isLoading={isLoadingState}
              questData={questData}
            />,
            <Outset gu8>
              <TextFieldInput
                id="evidence"
                value={claim.evidence}
                isMarkDown
                wide
                label="Evidence of completion"
                isLoading={isLoading || !claim.evidence}
              />
            </Outset>,
          ])}
        />
      ) : (
        <BoxStyled>
          <i>No claims</i>
        </BoxStyled>
      )}
    </WrapperStyled>
  );
}
