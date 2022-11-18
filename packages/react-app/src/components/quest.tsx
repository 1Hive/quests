import { Card, useViewport } from '@1hive/1hive-ui';
import { ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ADDRESS_ZERO,
  ENUM_CLAIM_STATE,
  ENUM_PAGES,
  ENUM_QUEST_STATE,
  ENUM_TRANSACTION_STATUS,
  MAX_LINE_DESCRIPTION,
  QuestState,
} from 'src/constants';
import { QuestModel } from 'src/models/quest.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import * as QuestService from 'src/services/quest.service';
import { Logger } from 'src/utils/logger';
import styled, { css } from 'styled-components';
import { GUpx } from 'src/utils/style.util';
import { TokenModel } from 'src/models/token.model';
import { useWallet } from 'src/contexts/wallet.context';
import { IN_A_WEEK_IN_MS } from 'src/utils/date.utils';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { useIsMountedRef } from 'src/hooks/use-mounted.hook';
import { ClaimModel } from 'src/models/claim.model';
import { getNetwork } from 'src/networks';
import { DepositModel } from 'src/models/deposit-model';
import ScheduleClaimModal from './modals/schedule-claim-modal';
import FundModal from './modals/fund-modal';
import ReclaimFundsModal from './modals/reclaim-funds-modal';
import DateFieldInput from './field-input/date-field-input';
import AmountFieldInput from './field-input/amount-field-input';
import TextFieldInput from './field-input/text-field-input';
import ClaimList from './claim-list';
import { isQuestExpired, processQuestState as computeQuestState } from '../services/state-machine';
import { StateTag } from './state-tag';
import { AddressFieldInput } from './field-input/address-field-input';
import { ConditionalWrapper } from './utils/util';
import NumberFieldInput from './field-input/number-field-input';
import { ActionsPlaceholder } from './actions-placeholder';

// #region StyledComponents

const ClickableDivStyled = styled(Link)`
  text-decoration: none;
  width: 100%;
  height: 100%;
`;

const CardWrapperStyed = styled.div<{ compact: boolean }>`
  padding: ${({ compact }) => GUpx(compact ? 1 : 2)};
  height: 100%;
`;

const CardStyled = styled(Card)<{ isSummary: boolean; highlight: boolean }>`
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  min-height: 250px;
  ${({ isSummary, highlight }) =>
    isSummary &&
    highlight &&
    css`
      &:hover {
        box-shadow: 0px 0px 16px 4px rgba(247, 247, 206, 0.25);
      }
      cursor: pointer;
    `}
`;

const QuestFooterStyled = styled.div`
  width: 100%;
  text-align: right;
  padding: ${GUpx(2)};
  padding-top: ${GUpx(4)};
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  flex-wrap: wrap;
  row-gap: ${GUpx(2)};
`;
const LinkWrapperStyled = styled.div`
  padding-top: ${GUpx(2)};
`;
const RowStyled = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap-reverse;
  justify-content: space-between;
`;

const ContentWrapperStyled = styled.div<{ compact: boolean }>`
  padding: ${({ compact }) => (compact ? GUpx(2) : GUpx(3))};
  width: 100%;
  height: 100%;
  min-height: 340px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .UjkFY a {
    word-wrap: break-word;
  }
`;

const BountyWrapperStyled = styled.div`
  margin-left: auto;
  width: fit-content;
`;

const AddressFieldInputStyled = styled(AddressFieldInput)`
  z-index: 2;
`;

const HeaderWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

// #endregion

type Props = {
  questData?: QuestModel;
  isSummary?: boolean;
  isLoading?: boolean;
};

export default function Quest({
  questData = {
    expireTime: new Date(IN_A_WEEK_IN_MS + 24 * 36000),
    state: ENUM_QUEST_STATE.Draft,
    fallbackAddress: ADDRESS_ZERO,
    creatorAddress: ADDRESS_ZERO,
  },
  isLoading = false,
  isSummary = false,
}: Props) {
  const { walletConnected } = useWallet();
  const [bounty, setBounty] = useState<TokenAmountModel | undefined | null>(questData?.bounty);
  const [highlight, setHighlight] = useState<boolean>(true);
  const [claims, setClaims] = useState<ClaimModel[]>();
  const [claimDeposit, setClaimDeposit] = useState<TokenAmountModel | undefined>();
  const [isDepositReleased, setIsDepositReleased] = useState<boolean>(false);
  const [challengeDeposit, setChallengeDeposit] = useState<TokenAmountModel | null>();
  const [state, setState] = useState<QuestState>(questData.state);
  const { below } = useViewport();
  const { transaction } = useTransactionContext();
  const [waitForClose, setWaitForClose] = useState(false);
  const isMountedRef = useIsMountedRef();
  const { chainId } = getNetwork();

  useEffect(() => {
    if (!isSummary) {
      // Don't show deposit of expired
      if (state === ENUM_QUEST_STATE.Archived || state === ENUM_QUEST_STATE.Expired) {
        setClaimDeposit(undefined);
      } else {
        try {
          QuestService.fetchDeposits().then(({ challenge, claim }) => {
            if (isMountedRef.current) {
              setClaimDeposit(claim);
              setChallengeDeposit(challenge);
            }
          });
        } catch (error) {
          Logger.exception(error);
        }
      }
    }
  }, []);

  useEffect(() => {
    // If tx completion impact Quest bounty, update it
    if (
      transaction?.args?.questAddress === questData.address &&
      (transaction?.type === 'ClaimChallengeResolve' ||
        transaction?.type === 'ClaimExecute' ||
        transaction?.type === 'QuestFund' ||
        transaction?.type === 'QuestReclaimFunds')
    ) {
      if (
        transaction?.status === ENUM_TRANSACTION_STATUS.Pending &&
        transaction?.type === 'QuestReclaimFunds'
      ) {
        // Should wait for close because changing the state will cause QuestReclaimFunds to be removed from DOM
        setWaitForClose(true);
      } else if (transaction?.status === ENUM_TRANSACTION_STATUS.Confirmed) {
        setBounty(null);
        setTimeout(() => {
          if (questData.address && questData.rewardToken) {
            fetchBalanceOfQuest(questData.address, questData.rewardToken, true);
          }
        }, 500);
      }
    }
  }, [transaction?.type, transaction?.status, transaction?.args?.questAddress]);

  useEffect(() => {
    setState(questData.state);
  }, [questData.state]);

  useEffect(() => {
    if (!questData.rewardToken) {
      setBounty(undefined);
    } else if (questData.address) {
      fetchBalanceOfQuest(questData.address, questData.rewardToken);
    }
  }, [questData.address, questData.rewardToken, questData.playDeposit, questData.playDeposit]);

  const fetchBalanceOfQuest = async (
    address: string,
    token: TokenModel | string,
    forceCacheRefresh: boolean = false,
  ) => {
    try {
      if (questData.address) {
        let createDepositReleased = false;
        if (isQuestExpired(questData)) {
          createDepositReleased = await QuestService.isCreateQuestDepositReleased(
            questData.address,
          );
        }
        const depositLocked: DepositModel[] = [];
        if (!createDepositReleased && questData.createDeposit) {
          depositLocked.push(questData.createDeposit);
        }
        if (questData.players?.length && questData.playDeposit) {
          // Multiply by the number of players (each one has a deposit locked)
          questData.playDeposit.amount = questData.playDeposit.amount.mul(questData.players.length);
          depositLocked.push(questData.playDeposit);
        }
        const result = await QuestService.getBalanceOf(
          token,
          address,
          depositLocked,
          forceCacheRefresh,
        );
        if (isMountedRef.current) {
          questData.bounty = result;
          setIsDepositReleased(createDepositReleased);
          computeQuestState(questData, createDepositReleased);
          setState(questData.state);
          setBounty(result);
        }
      }
    } catch (error) {
      if (isMountedRef.current) {
        Logger.exception(error);
        setBounty(undefined);
      }
    }
  };

  const HighlightBlocker = ({ children }: { children: ReactNode }) => (
    <div
      onMouseLeave={() => setHighlight(true)}
      onMouseEnter={() => setHighlight(false)}
      className="max-width-100"
    >
      {children}
    </div>
  );

  const fieldsRow = (
    <RowStyled>
      <HighlightBlocker>
        <AddressFieldInputStyled
          id="address"
          label="Quest Address"
          isLoading={isLoading || !questData}
          value={questData?.address}
        />
      </HighlightBlocker>
      {isSummary && (
        <NumberFieldInput
          value={questData?.activeClaimCount}
          label="Claims"
          isLoading={isLoading}
        />
      )}
      {!isSummary && (
        <>
          <AddressFieldInputStyled
            id="creator"
            label="Creator"
            isLoading={isLoading || !questData}
            value={questData?.creatorAddress}
          />
          {questData?.maxPlayers != null && (
            <TextFieldInput
              id="players"
              label="Players"
              isLoading={isLoading || !questData}
              value={`${questData?.players?.length ?? 0} / ${
                questData.unlimited ? '∞' : questData.maxPlayers
              }`}
            />
          )}
          <DateFieldInput
            id="creationTime"
            label="Creation time"
            isLoading={isLoading || !questData}
            value={questData.creationTime}
          />
        </>
      )}

      <DateFieldInput
        id="expireTime"
        label="Expire time"
        tooltip="The expiry time for the quest completion. Past expiry time, funds will only be sendable to the fallback address."
        isLoading={isLoading || !questData}
        value={questData?.expireTime}
      />

      {!isSummary && state === ENUM_QUEST_STATE.Active && (
        <AmountFieldInput
          id="claimDeposit"
          label="Claim deposit"
          tooltip="This amount will be staked when claiming a bounty. If the claim is challenged and ruled in favor of the challenger, you will lose this deposit."
          value={claimDeposit}
          isLoading={isLoading || !claimDeposit}
        />
      )}
    </RowStyled>
  );
  return (
    <CardWrapperStyed compact={below('medium')}>
      <CardStyled
        className="card"
        style={css}
        isSummary={isSummary}
        highlight={highlight}
        id={questData?.address}
      >
        <ConditionalWrapper
          condition={isSummary && !isLoading}
          wrapper={(children) => (
            <ClickableDivStyled
              className="quest"
              to={
                highlight
                  ? `/${ENUM_PAGES.Detail}?id=${questData?.address}&chainId=${chainId}`
                  : '#'
              }
              onMouseEnter={() => setHighlight(true)}
            >
              {children}
            </ClickableDivStyled>
          )}
        >
          <ContentWrapperStyled compact={below('medium')}>
            <HeaderWrapperStyled>
              <StateTag state={questData?.state ?? ''} />
              <RowStyled className="pb-0">
                <TextFieldInput
                  id="title"
                  isLoading={isLoading || !questData}
                  value={questData?.title}
                  fontSize="24px"
                />
                <BountyWrapperStyled>
                  <HighlightBlocker>
                    <AmountFieldInput
                      id={`bounty-${questData?.address}`}
                      key={`bounty-${questData?.address}`}
                      className="bounty"
                      compact
                      tagOnly
                      showUsd
                      value={questData?.bounty}
                      isLoading={isLoading || !bounty}
                    />
                  </HighlightBlocker>
                </BountyWrapperStyled>
              </RowStyled>

              {!isSummary && fieldsRow}

              <TextFieldInput
                id="description"
                label={isSummary ? undefined : 'Description'}
                value={questData?.description}
                isLoading={isLoading || !questData}
                multiline
                isMarkDown
                disableLinks={isSummary}
                blockVisibility={isSummary ? 'hidden' : 'visible'}
                maxLine={isSummary ? MAX_LINE_DESCRIPTION : undefined}
                wide
              />
              {!isSummary && (
                <LinkWrapperStyled>
                  <TextFieldInput
                    id="communication-link"
                    label={isSummary ? undefined : 'Communication method'}
                    value={questData?.communicationLink ?? '*No communication link provided*'}
                    isLoading={isLoading || !questData}
                    isMarkDown
                    wide
                    compact
                  />
                </LinkWrapperStyled>
              )}
            </HeaderWrapperStyled>

            {isSummary && fieldsRow}
          </ContentWrapperStyled>
          {!isSummary && challengeDeposit && (
            <ClaimList
              questData={{ ...questData, bounty, state }}
              challengeDeposit={challengeDeposit}
              isLoading={isLoading}
              onClaimsFetched={setClaims}
            />
          )}
          {!isSummary && questData.address && (
            <QuestFooterStyled>
              {walletConnected ? (
                <>
                  <>
                    <FundModal quest={questData} />
                    {claimDeposit && (
                      <ScheduleClaimModal
                        questData={{ ...questData, state }}
                        questAddress={questData.address}
                        questTotalBounty={bounty}
                        claimDeposit={claimDeposit}
                      />
                    )}
                  </>
                  <>
                    {(state === ENUM_QUEST_STATE.Expired || waitForClose) && (
                      <ReclaimFundsModal
                        bounty={bounty}
                        questData={{ ...questData, state }}
                        isDepositReleased={isDepositReleased}
                        onClose={() => setWaitForClose(false)}
                        pendingClaims={
                          !!claims?.find(
                            (claim) =>
                              claim.state === ENUM_CLAIM_STATE.Scheduled ||
                              claim.state === ENUM_CLAIM_STATE.AvailableToExecute,
                          )
                        }
                      />
                    )}
                  </>
                </>
              ) : (
                <ActionsPlaceholder />
              )}
            </QuestFooterStyled>
          )}
        </ConditionalWrapper>
      </CardStyled>
    </CardWrapperStyed>
  );
}
