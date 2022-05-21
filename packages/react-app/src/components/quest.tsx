import { Card, useViewport } from '@1hive/1hive-ui';
import { ReactNode, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  ADDRESS_ZERO,
  ENUM_PAGES,
  ENUM_QUEST_STATE,
  ENUM_TRANSACTION_STATUS,
  MAX_LINE_DESCRIPTION,
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

// #region StyledComponents

const ClickableDivStyled = styled.div`
  text-decoration: none;
  width: 100%;
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
  justify-content: space-around;
`;

const BountyWrapperStyled = styled.div`
  margin-left: auto;
  width: fit-content;
`;

const AddressFieldInputStyled = styled(AddressFieldInput)`
  z-index: 2;
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
  const { walletAddress } = useWallet();
  const history = useHistory();
  const [bounty, setBounty] = useState<TokenAmountModel | null>();
  const [highlight, setHighlight] = useState<boolean>(true);
  const [claimDeposit, setClaimDeposit] = useState<TokenAmountModel | undefined>();
  const [isDepositReleased, setIsDepositReleased] = useState<boolean>(false);
  const [challengeDeposit, setChallengeDeposit] = useState<TokenAmountModel | null>();
  const [state, setState] = useState(questData.state);
  const { below } = useViewport();
  const { transaction } = useTransactionContext();
  const [waitForClose, setWaitForClose] = useState(false);
  let isMounted = true;

  useEffect(() => {
    if (!isSummary) {
      // Don't show deposit of expired
      if (state === ENUM_QUEST_STATE.Archived || state === ENUM_QUEST_STATE.Expired) {
        setClaimDeposit(undefined);
      } else {
        try {
          QuestService.fetchDeposits().then(({ challenge, claim }) => {
            if (isMounted) {
              setClaimDeposit(claim);
              setChallengeDeposit(challenge);
            }
          });
        } catch (error) {
          Logger.exception(error);
        }
      }
    }
    return () => {
      isMounted = false;
    };
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
        // Should wait for close beecause changing the state will cause QuestReclaimFunds to be removed from DOM
        setWaitForClose(true);
      } else if (transaction?.status === ENUM_TRANSACTION_STATUS.Confirmed) {
        setBounty(null);
        setTimeout(() => {
          if (questData.address && questData.rewardToken) {
            fetchBalanceOfQuest(questData.address, questData.rewardToken);
          }
        }, 500);
      }
    }
  }, [transaction?.type, transaction?.status]);

  useEffect(() => {
    setState(questData.state);
  }, [questData.state]);

  useEffect(() => {
    // If tx completion impact Quest bounty, update it
    if (
      transaction?.status === ENUM_TRANSACTION_STATUS.Confirmed &&
      transaction.args?.questAddress === questData.address &&
      (transaction?.type === 'ClaimChallengeResolve' ||
        transaction?.type === 'ClaimExecute' ||
        transaction?.type === 'QuestFund' ||
        transaction?.type === 'QuestReclaimFunds')
    ) {
      setBounty(undefined);
      setTimeout(() => {
        if (questData.address && questData.rewardToken) {
          fetchBalanceOfQuest(questData.address, questData.rewardToken);
        }
      }, 500);
    }
  }, [transaction?.type, transaction?.status, transaction?.args?.questAddress]);

  useEffect(() => {
    if (!questData.rewardToken) {
      setBounty(undefined);
    } else if (questData.address) {
      fetchBalanceOfQuest(questData.address, questData.rewardToken);
    }
  }, [questData.address, questData.rewardToken]);

  const fetchBalanceOfQuest = async (address: string, token: TokenModel | string) => {
    try {
      if (questData.address) {
        let depositReleased = false;
        if (isQuestExpired(questData)) {
          depositReleased = await QuestService.isQuestDepositReleased(questData.address);
        }
        const result = await QuestService.getBalanceOf(
          token,
          address,
          depositReleased ? undefined : questData.deposit,
        );
        if (isMounted) {
          questData.bounty = result;
          setIsDepositReleased(depositReleased);
          computeQuestState(questData, depositReleased);
          setState(questData.state);
          setBounty(result);
        }
      }
    } catch (error) {
      Logger.exception(error);
      setBounty(undefined);
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

      {!isSummary && (
        <DateFieldInput
          id="creationTime"
          label="Creation time"
          isLoading={isLoading || !questData}
          value={questData.creationTime}
        />
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
              onClick={() => history.push(`/${ENUM_PAGES.Detail}?id=${questData?.address}`)}
              onMouseEnter={() => setHighlight(true)}
            >
              {children}
            </ClickableDivStyled>
          )}
        >
          <ContentWrapperStyled compact={below('medium')}>
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
              value={questData?.description}
              isLoading={isLoading || !questData}
              multiline
              isMarkDown
              disableLinks={isSummary}
              showBlocks={!isSummary}
              maxLine={isSummary ? MAX_LINE_DESCRIPTION : undefined}
            />
            {isSummary && fieldsRow}
          </ContentWrapperStyled>
          {!isSummary && challengeDeposit && (
            <ClaimList
              questData={questData}
              questTotalBounty={bounty}
              challengeDeposit={challengeDeposit}
              isLoading={isLoading}
            />
          )}
          {!isSummary && questData.address && walletAddress && (
            <QuestFooterStyled>
              {questData?.state === ENUM_QUEST_STATE.Active ? (
                <>
                  <FundModal quest={questData} />
                  {claimDeposit && (
                    <ScheduleClaimModal
                      questAddress={questData.address}
                      questTotalBounty={bounty}
                      claimDeposit={claimDeposit}
                    />
                  )}
                </>
              ) : (
                <>
                  {(state === ENUM_QUEST_STATE.Expired || waitForClose) && (
                    <ReclaimFundsModal
                      bounty={bounty}
                      questData={questData}
                      isDepositReleased={isDepositReleased}
                      onClose={() => setWaitForClose(false)}
                    />
                  )}
                </>
              )}
            </QuestFooterStyled>
          )}
        </ConditionalWrapper>
      </CardStyled>
    </CardWrapperStyed>
  );
}
