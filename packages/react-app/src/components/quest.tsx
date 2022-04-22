import { Card, Button } from '@1hive/1hive-ui';
import { Form } from 'formik';
import { noop } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
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
import ScheduleClaimModal from './modals/schedule-claim-modal';
import FundModal from './modals/fund-modal';
import ReclaimFundsModal from './modals/reclaim-funds-modal';
import { DateFieldInputFormik } from './field-input/date-field-input';
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

const CardStyled = styled(Card)`
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: fit-content;
  min-height: 250px;
  ${({ isEdit }: any) => isEdit && 'border:none;'}
  & > div:first-child {
    padding-bottom: 0;
  }
`;

const QuestFooterStyled = styled.div`
  width: 100%;
  text-align: right;
  padding: ${GUpx(2)};
  padding-top: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
`;

const FormStyled = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  #description {
    height: 200px;
  }
`;

const WrapperStyled = styled.div<{ twoCol?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  ${(props) => (props.twoCol ? '' : 'flex-wrap: wrap;')}
`;

const FirstColStyled = styled.div<{ isEdit: boolean }>`
  margin: 0 ${GUpx(3)};
  overflow-wrap: break-word;
  ${(props) =>
    !props.isEdit &&
    css`
      width: 80%;
    `}
`;

const SecondColStyled = styled.div`
  margin: 0 ${GUpx(3)};
  max-width: 90%;
  flex-grow: 0;
  display: flex;
  flex-direction: column;
`;

const HeaderRowStyled = styled.div`
  max-width: 100%;
  overflow-wrap: break-word;
  display: flex;
  flex-direction: column;
`;

const RowColStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;

const FirstRowStyled = styled.div`
  margin: ${GUpx(3)} ${GUpx(3)} ${GUpx(0)} ${GUpx(3)};
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  max-width: 100%;
  overflow-wrap: break-word;
  justify-content: space-between;
`;

const SecondRowStyled = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  max-width: 100%;
  overflow-wrap: break-word;
  justify-content: space-between;
`;

const QuestHeaderStyled = styled.div<{ isEdit: boolean }>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap-reverse;
  justify-content: space-between;
  ${(props) =>
    !props.isEdit &&
    css`
      padding: ${GUpx(3)};
      padding-bottom: ${GUpx()};
    `}
  width: 100%;
`;

// #endregion

type Props = {
  dataState: { questData?: QuestModel; setQuestData?: (_questData: QuestModel) => void };
  isSummary?: boolean;
  isLoading?: boolean;
  onSave?: (_questAddress: string) => void;
};

export default function Quest({
  dataState,
  isLoading = false,
  isSummary = false,
  onSave = noop,
}: Props) {
  const { walletAddress } = useWallet();
  const formRef = useRef<HTMLFormElement>(null);
  const { questData, setQuestData } = dataState;
  const [loading, setLoading] = useState(isLoading);
  const [bounty, setBounty] = useState<TokenAmountModel | null>();
  const [claimUpdated, setClaimUpdate] = useState(0);
  const [claimDeposit, setClaimDeposit] = useState<TokenAmountModel | null>();
  const [challengeDeposit, setChallengeDeposit] = useState<TokenAmountModel | null>();

  let isSubscribed = true;

  useEffect(() => {
    if (!questData) return;

    const getClaimDeposit = async () => {
      // Don't show deposit of expired
      if (!isSummary) {
        if (
          questData.state === ENUM_QUEST_STATE.Archived ||
          questData.state === ENUM_QUEST_STATE.Expired
        ) {
          setClaimDeposit(null);
        } else {
          try {
            const { challenge, claim } = await QuestService.fetchDeposits();
            setClaimDeposit(claim);
            setChallengeDeposit(challenge);
          } catch (error) {
            Logger.exception(error);
          }
        }
      }
    };

    if (!questData.rewardToken) {
      setBounty(null);
    } else if (questData.address) {
      fetchBalanceOfQuest(questData.address, questData.rewardToken);
    }

    if (!isSummary) {
      getClaimDeposit();
    }

    // eslint-disable-next-line consistent-return
    return () => {
      isSubscribed = false;
    };
  }, [questData, walletAddress]);

  const fetchBalanceOfQuest = (address: string, token: TokenModel | string) => {
    if (!questData) return;
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
    if (!questData) return;
    setTimeout(() => {
      if (success && questData.address && questData.rewardToken && walletAddress) {
        fetchBalanceOfQuest(questData.address, questData.rewardToken);
        setClaimUpdate(claimUpdated + 1);
      }
    }, 500);
  };

  const refresh = (data?: QuestModel) => {
    if (data) {
      setQuestData?.(data);
    }
  };

  const questContent = () => {
    const titleInput = (
      <TextFieldInput
        id="title"
        label="Title"
        isLoading={loading || !questData}
        placeHolder="Quest title"
        value={questData?.title}
        fontSize="24px"
        tooltip="Title should resume the Quest and be short and clear."
        wide
      />
    );

    const claimList = !loading && questData?.address && (
      <>
        {!isSummary && challengeDeposit && (
          <ClaimList
            newClaim={claimUpdated}
            questData={questData}
            questTotalBounty={bounty}
            challengeDeposit={challengeDeposit}
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
      </>
    );

    return (
      <WrapperStyled>
        <>
          <QuestHeaderStyled isEdit={false}>
            {isSummary ? (
              <TitleLinkStyled to={`/${ENUM_PAGES.Detail}?id=${questData?.address}`}>
                {titleInput}
              </TitleLinkStyled>
            ) : (
              titleInput
            )}
          </QuestHeaderStyled>
          {claimList}
        </>
      </WrapperStyled>
    );
  };

  return (
    <CardStyled style={css} isSummary id={questData?.address} isEdit={false}>
      <RowColStyled className="pb-0">
        <StateTag state={questData?.state ?? ''} />

        <AmountFieldInput
          id={`balance-${questData?.address}`}
          key={`balance-${questData?.address}`}
          compact
          value={questData?.bounty}
        />
      </RowColStyled>
      <FirstColStyled className="pb-0" isEdit={false}>
        <TextFieldInput
          id="title"
          isLoading={loading || !questData}
          placeHolder="Quest title"
          value={questData?.title}
          fontSize="24px"
          tooltip="Title should resume the Quest and be short and clear."
          wide
        />
        <TextFieldInput
          id="description"
          label="Description"
          value={questData?.description}
          isLoading={loading || !questData}
          placeHolder="Quest description"
          tooltip={
            <>
              <b>The quest description should include:</b>
              <br />- Details about what the quest entails. <br />- What evidence must be submitted
              by users claiming a reward for completing the quest. <br />- The payout amount. This
              could be a constant amount for quests that payout multiple times, a range with
              reference to what determines what amount, the contracts balance at time of claim.{' '}
              <br />
              ⚠️<i>The description should not include any sensitive information.</i>
            </>
          }
          wide
          multiline
          isMarkDown
          maxLine={isSummary ? 5 : undefined}
          ellipsis={
            <LinkStyled to={`/${ENUM_PAGES.Detail}?id=${questData?.address}`}>Read more</LinkStyled>
          }
        />
      </FirstColStyled>
      <RowColStyled>
        <SecondRowStyled className="pb-0">
          <FirstColStyled isEdit={false}>
            <AddressFieldInput
              id="address"
              label="Quest Address"
              value={questData?.address}
              isLoading={loading || !questData}
              wide={false}
            />
          </FirstColStyled>
          <SecondColStyled>
            <DateFieldInputFormik
              id="expireTime"
              label="Expire time"
              tooltip="The expiry time for the quest completion. Past expiry time, funds will only be sendable to the fallback address."
              isEdit={false}
              isLoading={loading || !questData}
              value={questData?.expireTime}
              wide
              formik={formRef}
            />
          </SecondColStyled>
        </SecondRowStyled>
      </RowColStyled>
    </CardStyled>
  );
}
