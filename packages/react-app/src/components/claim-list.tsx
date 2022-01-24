import { AddressField, Field, Accordion } from '@1hive/1hive-ui';
import { ClaimModel } from 'src/models/claim.model';
import { useWallet } from 'src/contexts/wallet.context';
import styled from 'styled-components';
import { GUpx } from 'src/utils/css.util';
import { ENUM_CLAIM_STATE } from 'src/constants';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { QuestModel } from 'src/models/quest.model';
import { useEffect, useState } from 'react';
import { Logger } from 'src/utils/logger';
import ChallengeModal from './modals/challenge-modal';
import ResolveChallengeModal from './modals/resolve-challenge-modal';
import { ChildSpacer, Outset } from './utils/spacer-util';
import AmountFieldInput from './field-input/amount-field-input';
import { IconTooltip } from './field-input/icon-tooltip';
import TextFieldInput from './field-input/text-field-input';
import * as QuestService from '../services/quest.service';
import ExecuteClaimModal from './modals/execute-claim-modal';
import { StateTag } from './state-tag';

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
  const { walletAddress } = useWallet();
  const [claims, setClaims] = useState<ClaimModel[]>();

  useEffect(() => {
    fetchClaims();
  }, []);

  useEffect(() => {
    if (newClaim) {
      if (!claims) fetchClaims();
      else fetchNewClaimChanges(true);
    }
  }, [newClaim]);

  const fetchClaims = async () => {
    const result = await QuestService.fetchQuestClaims(questData);
    setClaims(result);
    return result;
  };

  const fetchNewClaimChanges = (success: boolean, oldClaimsSnapshot?: string) => {
    oldClaimsSnapshot = oldClaimsSnapshot ?? JSON.stringify(claims);
    // Refresh until different
    if (success) {
      setTimeout(async () => {
        const newClaimsSnapshot = JSON.stringify(await fetchClaims());
        if (oldClaimsSnapshot === newClaimsSnapshot)
          fetchNewClaimChanges(success, oldClaimsSnapshot); // If same result keep pulling
      }, 1000);
    }
  };

  return (
    <WrapperStyled>
      {!!claims?.length && (
        <>
          <ClaimHeaderStyled>
            <HeaderStyled>Claims</HeaderStyled>
            <IconTooltip
              tooltip="Claims"
              tooltipDetail={`A claim includes the proof of the quest's completion.`}
            />
          </ClaimHeaderStyled>
          <Accordion
            items={claims.map((claim: ClaimModel) => {
              let actionButton;
              if (claim.state === ENUM_CLAIM_STATE.Scheduled) {
                if (walletAddress === claim.playerAddress)
                  actionButton = (
                    <ExecuteClaimModal
                      claim={claim}
                      questTotalBounty={questTotalBounty}
                      onClose={fetchNewClaimChanges}
                    />
                  );
                else
                  actionButton = (
                    <ChallengeModal
                      claim={claim}
                      challengeDeposit={challengeDeposit}
                      onClose={fetchNewClaimChanges}
                    />
                  );
              } else if (claim.state === ENUM_CLAIM_STATE.Challenged) {
                actionButton = (
                  <ResolveChallengeModal claim={claim} onClose={fetchNewClaimChanges} />
                );
              } else if (!claim.state) Logger.error(`Claim doesn't have state`, { claim });
              return [
                <div className="wide">
                  <Outset>
                    <ChildSpacer size={16} justify="start" align="center" buttonEnd>
                      <StateTag state={claim.state ?? ''} />
                      <Field
                        label={walletAddress === claim.playerAddress ? 'You' : 'Claiming player'}
                      >
                        <AddressField address={claim.playerAddress} autofocus={false} />
                      </Field>
                      {claim.claimedAmount.parsedAmount ? (
                        <AmountFieldInput
                          id="amount"
                          label="Claimed amount"
                          isLoading={
                            !claim.claimedAmount.parsedAmount && questTotalBounty === undefined
                          }
                          value={
                            claim.claimedAmount.parsedAmount || !questTotalBounty
                              ? claim.claimedAmount
                              : questTotalBounty
                          }
                        />
                      ) : (
                        <Field label="Claimed amount">All available</Field>
                      )}
                      {walletAddress && actionButton}
                    </ChildSpacer>
                  </Outset>
                </div>,
                <Outset gu8>
                  <TextFieldInput
                    id="evidence"
                    value={claim.evidence}
                    isMarkDown
                    wide
                    label="Evidence of completion"
                  />
                </Outset>,
              ];
            })}
          />
        </>
      )}
    </WrapperStyled>
  );
}
