import { AddressField, Field, Accordion } from '@1hive/1hive-ui';
import { ClaimModel } from 'src/models/claim.model';
import { useWallet } from 'src/contexts/wallet.context';
import styled from 'styled-components';
import { GUpx } from 'src/utils/css.util';
import { DEAULT_CLAIM_EXECUTION_DELAY_MS, ENUM_CLAIM_STATE } from 'src/constants';
import { roundNumber } from 'src/utils/math.utils';
import { ONE_DAY_IN_MS } from 'src/utils/date.utils';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { QuestModel } from 'src/models/quest.model';
import { useEffect, useState } from 'react';
import ChallengeModal from './modals/challenge-modal';
import ResolveChallengeModal from './modals/resolve-challenge-modal';
import { Outset } from './utils/spacer-util';
import AmountFieldInput from './field-input/amount-field-input';
import { IconTooltip } from './field-input/icon-tooltip';
import TextFieldInput from './field-input/text-field-input';
import * as QuestService from '../services/quest.service';
import ExecuteClaimModal from './modals/execute-claim-modal';

// #region StyledComponents

const WrapperStyled = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const RowStyled = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin: ${GUpx()};
`;

const ClaimStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 8%;
`;

const HeaderStyled = styled.h1`
  font-size: large;
  margin-left: ${GUpx()};
`;

// #endregion

type Props = {
  questData: QuestModel;
  newClaim: number;
  challengeDeposit: TokenAmountModel;
  questTotalBounty?: TokenAmountModel;
};

export default function ClaimList({
  questData,
  newClaim,
  challengeDeposit,
  questTotalBounty,
}: Props) {
  const wallet = useWallet();
  const [claims, setClaims] = useState<ClaimModel[]>();
  const [currentPlayerClaim, setCurrentPlayerClaim] = useState<ClaimModel | null>();

  useEffect(() => {
    if (wallet.account) {
      if (claims) {
        const result = claims.find((x) => x.playerAddress === wallet.account);
        setCurrentPlayerClaim(result ?? null);
      }
    }
  }, [claims, wallet.account]);

  useEffect(() => {
    if (!claims) fetchClaims();
    else fetchNewClaimChanges(true);
  }, [newClaim]);

  const fetchClaims = async () => {
    const result = await QuestService.fetchQuestClaims(questData);
    setClaims(result);
    return result;
  };

  const fetchNewClaimChanges = (success: boolean) => {
    const oldClaimsSnapshot = JSON.stringify(claims);
    // Refresh until different
    if (success) {
      const intervalHandle = setInterval(async () => {
        console.log('Fetching again');
        const newClaimsSnapshot = JSON.stringify(await fetchClaims());
        if (oldClaimsSnapshot !== newClaimsSnapshot) clearInterval(intervalHandle); // If new result, stop interval pulling
      }, 1000);
    }
  };

  const actionButton = (claim: ClaimModel) => {
    if (claim.state === ENUM_CLAIM_STATE.Challenged) {
      return <ResolveChallengeModal claim={claim} onClose={fetchNewClaimChanges} />;
    }
    if (currentPlayerClaim) {
      return (
        <ExecuteClaimModal
          claim={currentPlayerClaim}
          questTotalBounty={questTotalBounty}
          onClose={fetchNewClaimChanges}
        />
      );
    }
    return (
      <ChallengeModal
        claim={claim}
        challengeDeposit={challengeDeposit}
        onClose={fetchNewClaimChanges}
      />
    );
  };

  return (
    <WrapperStyled>
      <Outset>
        {!!claims?.length && (
          <>
            <ClaimStyled>
              <HeaderStyled>Claims </HeaderStyled>
              <IconTooltip
                tooltip="Claims"
                tooltipDetail={`A claim includes the proof of the quest's completion. This claim can be challenged within ${roundNumber(
                  DEAULT_CLAIM_EXECUTION_DELAY_MS / ONE_DAY_IN_MS,
                  0,
                )} days.`}
              />
            </ClaimStyled>

            <Accordion
              items={claims.map((x: ClaimModel) => [
                <RowStyled>
                  <Field label={wallet?.account === x.playerAddress ? 'You' : 'Claiming player'}>
                    <AddressField address={x.playerAddress} autofocus={false} />
                  </Field>
                  <AmountFieldInput
                    id="amount"
                    label="Claimed amount"
                    isLoading={!x.claimedAmount.parsedAmount && questTotalBounty === undefined}
                    value={
                      x.claimedAmount.parsedAmount || !questTotalBounty
                        ? x.claimedAmount
                        : questTotalBounty
                    }
                  />
                  {wallet?.account && currentPlayerClaim !== undefined && actionButton(x)}
                </RowStyled>,
                <Outset gu8>
                  <TextFieldInput
                    id="evidence"
                    value={x.evidence}
                    isMarkDown
                    wide
                    label="Evidence of completion"
                  />
                </Outset>,
              ])}
            />
          </>
        )}
      </Outset>
    </WrapperStyled>
  );
}
