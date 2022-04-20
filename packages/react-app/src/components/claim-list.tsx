import { Accordion, Box } from '@1hive/1hive-ui';
import { ClaimModel } from 'src/models/claim.model';
import { useWallet } from 'src/contexts/wallet.context';
import styled from 'styled-components';
import { GUpx } from 'src/utils/style.util';
import { ENUM_CLAIM_STATE } from 'src/constants';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { QuestModel } from 'src/models/quest.model';
import { useEffect, useState } from 'react';
import { Logger } from 'src/utils/logger';
import { getObjectFromIpfsSafe } from 'src/services/ipfs.service';
import ChallengeModal from './modals/challenge-modal';
import ResolveChallengeModal from './modals/resolve-challenge-modal';
import { ChildSpacer, Outset } from './utils/spacer-util';
import AmountFieldInput from './field-input/amount-field-input';
import { HelpTooltip } from './field-input/help-tooltip';
import TextFieldInput from './field-input/text-field-input';
import * as QuestService from '../services/quest.service';
import ExecuteClaimModal from './modals/execute-claim-modal';
import { StateTag } from './state-tag';
import { AddressFieldInput } from './field-input/address-field-input';
import { FieldInput } from './field-input/field-input';

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

const BoxStyled = styled(Box)`
  display: flex;
  justify-content: space-around;
`;

// #endregion

type Props = {
  questData: QuestModel;
  newClaim: number;
  challengeDeposit: TokenAmountModel;
  questTotalBounty?: TokenAmountModel | null;
};

export default function ClaimList({
  questData,
  newClaim,
  challengeDeposit,
  questTotalBounty,
}: Props) {
  const { walletAddress } = useWallet();
  const [claims, setClaims] = useState<ClaimModel[]>([
    { state: ENUM_CLAIM_STATE.None } as ClaimModel,
  ]);

  useEffect(() => {
    fetchClaims();
  }, []);

  useEffect(() => {
    // When a claim has been scheduled, newClaim will be increment by 1
    if (newClaim !== 0) {
      if (!claims) fetchClaims();
      else fetchNewClaimChanges(true);
    }
  }, [newClaim]);

  const fetchClaims = async () => {
    const result = await QuestService.fetchQuestClaims(questData);
    setClaims(result); // Fetch visible data
    setClaims(
      await Promise.all(
        result.map(async (claim) => ({
          ...claim,
          evidence: claim.evidenceIpfsHash
            ? await getObjectFromIpfsSafe(claim.evidenceIpfsHash)
            : 'No evidence',
        })),
      ),
    ); // Fetch evidence wich is currently hidden in accordion
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
      <ClaimHeaderStyled>
        <HeaderStyled>Claims</HeaderStyled>
        <HelpTooltip tooltip="A claim includes the proof of the quest's completion." />
      </ClaimHeaderStyled>
      {claims?.length ? (
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
              actionButton = <ResolveChallengeModal claim={claim} onClose={fetchNewClaimChanges} />;
            } else if (!claim.state) Logger.error(`Claim doesn't have state`, { claim });
            return [
              <div className="wide">
                <Outset>
                  <ChildSpacer size={16} justify="start" align="center" buttonEnd>
                    <FieldInput label="Status" isLoading={claim.state === ENUM_CLAIM_STATE.None}>
                      <StateTag state={claim.state ?? ''} className="pl-0" />
                    </FieldInput>
                    <AddressFieldInput
                      id="playerAddress"
                      value={claim.playerAddress}
                      label={walletAddress === claim.playerAddress ? 'You' : 'Claiming player'}
                      isLoading={!claim.playerAddress}
                    />
                    {claim.claimedAmount?.parsedAmount ? (
                      <AmountFieldInput
                        id="amount"
                        label="Claimed amount"
                        value={claim.claimedAmount}
                      />
                    ) : (
                      <FieldInput
                        label="Claimed amount"
                        isLoading={claim.state === ENUM_CLAIM_STATE.None}
                      >
                        All available
                      </FieldInput>
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
                  isLoading={!claim.evidence}
                />
              </Outset>,
            ];
          })}
        />
      ) : (
        <BoxStyled>
          <i>No claims</i>
        </BoxStyled>
      )}
    </WrapperStyled>
  );
}
