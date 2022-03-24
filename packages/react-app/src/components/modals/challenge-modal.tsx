import { Button, useToast, IconFlag, Timer } from '@1hive/1hive-ui';
import { noop, uniqueId } from 'lodash-es';
import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import { ClaimModel } from 'src/models/claim.model';
import { ENUM, ENUM_TRANSACTION_STATUS } from 'src/constants';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { ChallengeModel } from 'src/models/challenge.model';
import { GUpx } from 'src/utils/style.util';
import { getNetwork } from 'src/networks';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { BigNumber } from 'ethers';
import { useWallet } from 'src/contexts/wallet.context';
import { TokenModel } from 'src/models/token.model';
import { computeTransactionErrorMessage } from 'src/utils/errors.util';
import { getLastBlockDate } from 'src/utils/date.utils';
import ModalBase, { ModalCallback } from './modal-base';
import * as QuestService from '../../services/quest.service';
import AmountFieldInput from '../field-input/amount-field-input';
import TextFieldInput from '../field-input/text-field-input';
import { Outset } from '../utils/spacer-util';
import { IconTooltip } from '../field-input/icon-tooltip';
import { WalletBallance } from '../wallet-balance';

// #region StyledComponents

const FormStyled = styled(Form)`
  width: 100%;
`;

const OpenButtonStyled = styled(Button)`
  margin: ${GUpx()};
  width: fit-content;
`;

const HeaderStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const OpenButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

// #endregion

type Props = {
  claim: ClaimModel;
  challengeDeposit: TokenAmountModel;
  onClose?: ModalCallback;
};

export default function ChallengeModal({ claim, challengeDeposit, onClose = noop }: Props) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const [challengeTimeout, setChallengedTimeout] = useState<boolean | undefined>(undefined);
  const [buttonLabel, setOpenButtonLabel] = useState<string>();
  const [isEnoughBalance, setIsEnoughBalance] = useState(false);
  const [isFeeDepositSameToken, setIsFeeDepositSameToken] = useState<boolean>();
  const [challengeFee, setChallengeFee] = useState<TokenAmountModel | undefined>(undefined);
  const { setTransaction } = useTransactionContext();
  const formRef = useRef<HTMLFormElement>(null);
  const { walletAddress } = useWallet();

  useEffect(() => {
    const fetchFee = async () => {
      const feeAmount = await QuestService.fetchChallengeFee();
      if (feeAmount) setChallengeFee(feeAmount);
    };
    fetchFee();
  }, [walletAddress]);

  useEffect(() => {
    let handle: number;
    const launchSetTimeoutAsync = async (execTimeMs: number) => {
      const now = Date.now();

      if (now > execTimeMs) setChallengedTimeout(true);
      else {
        setChallengedTimeout(false);
        handle = window.setTimeout(() => {
          setChallengedTimeout(true);
        }, execTimeMs - now); // To ms
      }
    };
    if (claim.executionTimeMs) launchSetTimeoutAsync(claim.executionTimeMs);
    return () => {
      if (handle) clearTimeout(handle);
    };
  }, [claim.executionTimeMs]);

  useEffect(() => {
    if (challengeTimeout !== undefined) {
      if (challengeTimeout)
        // wait to load
        setOpenButtonLabel('Challenge period over');
      else setOpenButtonLabel('Challenge');
    }
  }, [claim.state, challengeTimeout]);

  useEffect(() => {
    if (challengeFee)
      setIsFeeDepositSameToken(
        challengeFee.token.token.toLowerCase() === challengeDeposit.token.token.toLowerCase(),
      );
  }, [challengeDeposit, challengeFee]);

  const closeModal = (success: boolean) => {
    setOpened(false);
    onClose(success);
  };

  const challengeTx = async (values: Partial<ChallengeModel>, setSubmitting: Function) => {
    if (!values.reason) {
      toast('Validation : Reason is required');
    } else {
      try {
        setLoading(true);
        const { governQueueAddress } = getNetwork();

        if (
          challengeFee?.parsedAmount &&
          (!isFeeDepositSameToken || !+claim.container!.config.challengeDeposit.amount)
        ) {
          setTransaction({
            id: uniqueId(),
            estimatedDuration: ENUM.ENUM_ESTIMATED_TX_TIME_MS.TokenAproval,
            message: 'Approving challenge fee',
            status: ENUM_TRANSACTION_STATUS.WaitingForSignature,
          });
          const approveTxReceipt = await QuestService.approveTokenAmount(
            walletAddress,
            governQueueAddress,
            challengeFee.token,
            (txHash) =>
              setTransaction(
                (oldTx) =>
                  oldTx && {
                    ...oldTx,
                    hash: txHash,
                    status: ENUM_TRANSACTION_STATUS.Pending,
                  },
              ),
          );
          setTransaction(
            (oldTx) =>
              oldTx && {
                ...oldTx,
                status: approveTxReceipt?.status
                  ? ENUM_TRANSACTION_STATUS.Confirmed
                  : ENUM_TRANSACTION_STATUS.Failed,
              },
          );
          if (!approveTxReceipt?.status) throw new Error('Failed to approve fee');
        }
        if (+claim.container!.config.challengeDeposit.amount) {
          let tokenToApprove: TokenModel;
          if (isFeeDepositSameToken && challengeFee?.token?.amount) {
            let approvingAmount = BigNumber.from(claim.container!.config.challengeDeposit.amount);
            approvingAmount = approvingAmount.add(BigNumber.from(challengeFee.token.amount));
            tokenToApprove = {
              ...challengeFee.token,
              amount: approvingAmount.toString(),
            };
          } else {
            tokenToApprove = claim.container!.config.challengeDeposit;
          }
          setTransaction({
            id: uniqueId(),
            estimatedDuration: ENUM.ENUM_ESTIMATED_TX_TIME_MS.ClaimChallenging,
            message: isFeeDepositSameToken
              ? 'Approving challenge fee + deposit'
              : 'Approving challenge deposit',
            status: ENUM_TRANSACTION_STATUS.WaitingForSignature,
          });
          const approveTxReceipt = await QuestService.approveTokenAmount(
            walletAddress,
            governQueueAddress,
            tokenToApprove,
            (txHash) => {
              setTransaction(
                (oldTx) =>
                  oldTx && {
                    ...oldTx,
                    hash: txHash,
                    status: ENUM_TRANSACTION_STATUS.Pending,
                  },
              );
            },
          );
          setTransaction(
            (oldTx) =>
              oldTx && {
                ...oldTx,
                status: approveTxReceipt?.status
                  ? ENUM_TRANSACTION_STATUS.Confirmed
                  : ENUM_TRANSACTION_STATUS.Failed,
              },
          );
          if (!approveTxReceipt?.status) throw new Error('Failed to approve deposit');
        }

        if (!claim.container) throw new Error('Container is not defined');
        setTransaction({
          id: uniqueId(),
          estimatedDuration: ENUM.ENUM_ESTIMATED_TX_TIME_MS.TokenAproval,
          message: 'Challenging Quest',
          status: ENUM_TRANSACTION_STATUS.WaitingForSignature,
        });
        const challengeTxReceipt = await QuestService.challengeQuestClaim(
          walletAddress,
          {
            reason: values.reason,
            deposit: challengeDeposit,
            challengerAddress: walletAddress,
          },
          claim.container,
          (txHash) => {
            setTransaction(
              (oldTx) =>
                oldTx && {
                  ...oldTx,
                  hash: txHash,
                  status: ENUM_TRANSACTION_STATUS.Pending,
                },
            );
          },
        );
        setTransaction(
          (oldTx) =>
            oldTx && {
              ...oldTx,
              status: challengeTxReceipt?.status
                ? ENUM_TRANSACTION_STATUS.Confirmed
                : ENUM_TRANSACTION_STATUS.Failed,
            },
        );
        if (!challengeTxReceipt?.status) throw new Error('Failed to challenge the quest');
      } catch (e: any) {
        setTransaction(
          (oldTx) =>
            oldTx && {
              ...oldTx,
              message: computeTransactionErrorMessage(e),
              status: ENUM_TRANSACTION_STATUS.Failed,
            },
        );
        toast(computeTransactionErrorMessage(e));
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    }
  };

  return (
    <ModalBase
      id="challenge-modal"
      title={
        <HeaderStyled>
          <h1>Challenge quests</h1>
          <IconTooltip
            tooltip="What is a challenge?"
            tooltipDetail="A challenge allows you to deny a claim. It will be raised to Celeste and disputable voting will be used to determine the validity of this challenge."
          />
        </HeaderStyled>
      }
      openButton={
        <OpenButtonWrapperStyled>
          {buttonLabel && (
            <OpenButtonStyled
              icon={<IconFlag />}
              onClick={() => setOpened(true)}
              label={buttonLabel}
              mode="negative"
              title="This claim can't be challenged anymore"
              disabled={!buttonLabel || loading || challengeTimeout || !walletAddress}
            />
          )}
          {!loading && challengeTimeout === false && claim.executionTimeMs && (
            <Timer end={new Date(claim.executionTimeMs)} />
          )}
        </OpenButtonWrapperStyled>
      }
      buttons={[
        <WalletBallance
          askedTokenAmount={
            isFeeDepositSameToken && challengeFee
              ? {
                  parsedAmount: challengeDeposit.parsedAmount + challengeFee.parsedAmount,
                  token: challengeDeposit.token,
                }
              : challengeDeposit
          }
          setIsEnoughBalance={setIsEnoughBalance}
        />,
        challengeFee && !isFeeDepositSameToken && (
          <WalletBallance askedTokenAmount={challengeFee} setIsEnoughBalance={setIsEnoughBalance} />
        ),
        <AmountFieldInput
          key="challengeDeposit"
          id="challengeDeposit"
          label="Challenge Deposit"
          tooltip="Challenge Deposit"
          tooltipDetail="This amount will be staked when challenging this claim. If this challenge is denied, you will lose this deposit."
          isLoading={loading}
          value={challengeDeposit}
          compact
        />,
        <AmountFieldInput
          key="challengeFee"
          id="challengeFee"
          label="Challenge fee"
          tooltip="Challenge fee"
          tooltipDetail="This is the challenge cost defined by Celeste."
          isLoading={loading || challengeFee === undefined}
          value={challengeFee}
          compact
        />,
        <Button
          key="confirmButton"
          icon={<IconFlag />}
          label={buttonLabel}
          mode="negative"
          type="submit"
          form="form-challenge"
          disabled={loading || !walletAddress || !isEnoughBalance || challengeTimeout}
        />,
      ]}
      onClose={closeModal}
      isOpen={opened}
    >
      <Formik
        initialValues={{ reason: '' }}
        onSubmit={(values, { setSubmitting }) => {
          challengeTx(
            {
              reason: values.reason,
              deposit: challengeDeposit,
            },
            setSubmitting,
          );
        }}
      >
        {({ values, handleSubmit, handleChange }) => (
          <FormStyled id="form-challenge" onSubmit={handleSubmit} ref={formRef}>
            <Outset gu16>
              <TextFieldInput
                id="reason"
                isEdit
                label="Challenge reason"
                tooltip="Challenge reason"
                tooltipDetail="Reason why this claim should be challenged."
                isLoading={loading}
                value={values.reason}
                onChange={handleChange}
                multiline
                wide
              />
            </Outset>
          </FormStyled>
        )}
      </Formik>
    </ModalBase>
  );
}
