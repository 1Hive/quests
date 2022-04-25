import { Card, useViewport } from '@1hive/1hive-ui';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ENUM_PAGES, ENUM_QUEST_STATE } from 'src/constants';
import { QuestModel } from 'src/models/quest.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import * as QuestService from 'src/services/quest.service';
import { Logger } from 'src/utils/logger';
import styled, { css } from 'styled-components';
import { GUpx } from 'src/utils/style.util';
import { TokenModel } from 'src/models/token.model';
import { useWallet } from 'src/contexts/wallet.context';
import { IN_A_WEEK_IN_MS } from 'src/utils/date.utils';
import ScheduleClaimModal from './modals/schedule-claim-modal';
import FundModal from './modals/fund-modal';
import ReclaimFundsModal from './modals/reclaim-funds-modal';
import DateFieldInput from './field-input/date-field-input';
import AmountFieldInput from './field-input/amount-field-input';
import TextFieldInput from './field-input/text-field-input';
import ClaimList from './claim-list';
import { processQuestState } from '../services/state-machine';
import { StateTag } from './state-tag';
import { AddressFieldInput } from './field-input/address-field-input';

// #region StyledComponents

const TitleLinkStyled = styled(Link)`
  font-weight: 100;
`;

const LinkStyled = styled(Link)`
  font-weight: 100;
`;

const CardWrapperStyed = styled.div<{ compact: boolean }>`
  padding: ${({ compact }) => GUpx(compact ? 1 : 2)};
`;

const CardStyled = styled(Card)<{ isSummary: boolean }>`
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: fit-content;
  min-height: 250px;
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
  min-height: 225px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const BountyWrapperStyled = styled.div`
  margin-left: auto;
  width: fit-content;
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
  },
  isLoading = false,
  isSummary = false,
}: Props) {
  const { walletAddress } = useWallet();
  const [bounty, setBounty] = useState<TokenAmountModel | null>();
  const [claimUpdated, setClaimUpdate] = useState(0);
  const [claimDeposit, setClaimDeposit] = useState<TokenAmountModel | undefined>();
  const [challengeDeposit, setChallengeDeposit] = useState<TokenAmountModel | null>();
  const { below } = useViewport();

  let isSubscribed = true;

  useEffect(() => {
    if (!isSummary) {
      // Don't show deposit of expired
      if (
        questData.state === ENUM_QUEST_STATE.Archived ||
        questData.state === ENUM_QUEST_STATE.Expired
      ) {
        setClaimDeposit(undefined);
      } else {
        try {
          QuestService.fetchDeposits().then(({ challenge, claim }) => {
            if (isSubscribed) {
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
      isSubscribed = false;
    };
  }, []);

  useEffect(() => {
    if (!questData.rewardToken) {
      setBounty(null);
    } else if (questData.address) {
      fetchBalanceOfQuest(questData.address, questData.rewardToken);
    }
  }, [questData.address, questData.rewardToken]);

  const fetchBalanceOfQuest = (address: string, token: TokenModel | string) => {
    QuestService.getBalanceOf(token, address)
      .then((result) => {
        if (isSubscribed) {
          questData.bounty = result ?? undefined;
          processQuestState(questData);
          setBounty(result);
        }
      })
      .catch((err) => {
        Logger.exception(err);
        setBounty(undefined);
      });
  };

  const onScheduleModalClosed = (success: boolean) => {
    if (success) {
      setClaimUpdate(claimUpdated + 1); // Trigger a claim update in claim list
    }
  };

  const onFundModalClosed = (success: boolean) => {
    setTimeout(() => {
      if (success && questData.address && questData.rewardToken) {
        fetchBalanceOfQuest(questData.address, questData.rewardToken);
        setClaimUpdate(claimUpdated + 1);
      }
    }, 500);
  };

  const titleInput = (
    <TextFieldInput
      id="title"
      isLoading={isLoading || !questData}
      placeHolder="Quest title"
      value={questData?.title}
      fontSize="24px"
      tooltip="Title should resume the Quest and be short and clear."
    />
  );

  const fieldsRow = (
    <RowStyled>
      <AddressFieldInput
        id="address"
        label="Quest Address"
        isLoading={isLoading || !questData}
        value={questData?.address}
      />

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

      {!isSummary && (
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
      <CardStyled style={css} isSummary={isSummary} id={questData?.address}>
        <ContentWrapperStyled compact={below('medium')}>
          <StateTag state={questData?.state ?? ''} />
          <RowStyled className="pb-0">
            {isSummary ? (
              <TitleLinkStyled to={`/${ENUM_PAGES.Detail}?id=${questData?.address}`}>
                {titleInput}
              </TitleLinkStyled>
            ) : (
              titleInput
            )}
            <BountyWrapperStyled>
              <AmountFieldInput
                id={`bounty-${questData?.address}`}
                key={`bounty-${questData?.address}`}
                compact
                tagOnly
                showUsd
                value={questData?.bounty}
                isLoading={isLoading || !bounty}
              />
            </BountyWrapperStyled>
          </RowStyled>

          {!isSummary && fieldsRow}
          <TextFieldInput
            id="description"
            value={questData?.description}
            isLoading={isLoading || !questData}
            tooltip={
              <>
                <b>The quest description should include:</b>
                <br />- Details about what the quest entails. <br />- What evidence must be
                submitted by users claiming a reward for completing the quest. <br />- The payout
                amount. This could be a constant amount for quests that payout multiple times, a
                range with reference to what determines what amount, the contracts balance at time
                of claim. <br />
                ⚠️<i>The description should not include any sensitive information.</i>
              </>
            }
            multiline
            isMarkDown
            maxLine={isSummary ? 5 : undefined}
            ellipsis={
              <LinkStyled to={`/${ENUM_PAGES.Detail}?id=${questData?.address}`}>
                Read more
              </LinkStyled>
            }
          />
          {isSummary && fieldsRow}
        </ContentWrapperStyled>
        {!isSummary && challengeDeposit && (
          <ClaimList
            newClaim={claimUpdated}
            questData={questData}
            questTotalBounty={bounty}
            challengeDeposit={challengeDeposit}
            isLoading={isLoading}
          />
        )}
        {!isSummary && questData.address && walletAddress && bounty && (
          <QuestFooterStyled>
            {questData?.state === ENUM_QUEST_STATE.Active ? (
              <>
                <FundModal quest={questData} onClose={onFundModalClosed} />
                {claimDeposit && (
                  <ScheduleClaimModal
                    questAddress={questData.address}
                    questTotalBounty={bounty}
                    claimDeposit={claimDeposit}
                    onClose={onScheduleModalClosed}
                  />
                )}
              </>
            ) : (
              <>
                {!!bounty?.parsedAmount && (
                  <ReclaimFundsModal bounty={bounty} questData={questData} />
                )}
              </>
            )}
          </QuestFooterStyled>
        )}
      </CardStyled>
    </CardWrapperStyed>
  );
}
