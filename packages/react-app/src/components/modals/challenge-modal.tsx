/* eslint-disable no-undef */
import { Button, useToast, IconFlag, Timer } from '@1hive/1hive-ui';
import { noop, uniqueId } from 'lodash-es';
import { useState, useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Formik, Form, FormikErrors } from 'formik';
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
import { approveTokenTransaction } from 'src/services/transaction-handler';
import ModalBase, { ModalCallback } from './modal-base';
import * as QuestService from '../../services/quest.service';
import AmountFieldInput from '../field-input/amount-field-input';
import TextFieldInput from '../field-input/text-field-input';
import { Outset } from '../utils/spacer-util';
import { WalletBallance } from '../wallet-balance';

// #region StyledComponents

const FormStyled = styled(Form)`
  width: 100%;
`;

const OpenButtonStyled = styled(Button)`
  margin: ${GUpx(1)};
  width: fit-content;
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
  const [isFormValid, setIsFormValid] = useState(false);
  const { setTransaction, transaction } = useTransactionContext();
  const formRef = useRef<HTMLFormElement>(null);
  const { walletAddress } = useWallet();
  const modalId = useMemo(() => uniqueId('challenge-modal'), []);

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

  const challengeTx = async (values: Partial<ChallengeModel>) => {
    if (!values.reason) {
      toast('Reason is required');
    } else {
      try {
        setLoading(true);
        const { governQueueAddress } = getNetwork();
        if (
          challengeFee?.parsedAmount &&
          (!isFeeDepositSameToken || !+claim.container!.config.challengeDeposit.amount)
        ) {
          await approveTokenTransaction(
            modalId,
            challengeFee.token,
            governQueueAddress,
            'Approving challenge fee (1/3)',
            walletAddress,
            setTransaction,
          );
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
          await approveTokenTransaction(
            modalId,
            tokenToApprove,
            governQueueAddress,
            isFeeDepositSameToken
              ? 'Approving challenge fee + deposit (1/2)'
              : 'Approving challenge deposit  (2/3)',
            walletAddress,
            setTransaction,
          );
        }

        if (!claim.container) throw new Error('Container is not defined');
        setTransaction({
          modalId,
          estimatedDuration: ENUM.ENUM_ESTIMATED_TX_TIME_MS.ClaimChallenging,
          message: `Challenging Quest (${isFeeDepositSameToken ? '2/2' : '3/3'})`,
          status: ENUM_TRANSACTION_STATUS.WaitingForSignature,
          type: 'ClaimChallenge',
          args: { questAddress: claim.questAddress, containerId: claim.container.id },
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
        setLoading(false);
      }
    }
  };
  const validate = (values: ChallengeModel) => {
    const errors = {} as FormikErrors<ChallengeModel>;
    if (!values.reason) errors.reason = 'Challenge reason is required';

    setIsFormValid(Object.keys(errors).length === 0);
    return errors;
  };

  return (
    <ModalBase
      id={modalId}
      title="Challenge quests"
      openButton={
        <OpenButtonWrapperStyled>
          {buttonLabel && (
            <OpenButtonStyled
              icon={<IconFlag />}
              onClick={() => setOpened(true)}
              label={buttonLabel}
              mode="negative"
              title={challengeTimeout ? "This claim can't be challenged anymore" : buttonLabel}
              disabled={
                !buttonLabel ||
                loading ||
                !walletAddress ||
                challengeTimeout ||
                (transaction && transaction.modalId !== modalId)
              }
            />
          )}
          {!loading && challengeTimeout === false && claim.executionTimeMs && (
            <Timer end={new Date(claim.executionTimeMs)} />
          )}
        </OpenButtonWrapperStyled>
      }
      buttons={[
        <WalletBallance
          key="WalletBallance-1"
          askedTokenAmount={
            isFeeDepositSameToken && challengeFee
              ? {
                  parsedAmount: challengeDeposit.parsedAmount + challengeFee.parsedAmount,
                  token: challengeDeposit.token,
                }
              : challengeDeposit
          }
          setIsEnoughBalance={setIsEnoughBalance}
          isLoading={loading}
        />,
        challengeFee && !isFeeDepositSameToken && (
          <WalletBallance
            key="WalletBallance-2"
            askedTokenAmount={challengeFee}
            setIsEnoughBalance={setIsEnoughBalance}
          />
        ),
        <AmountFieldInput
          key="challengeDeposit"
          id="challengeDeposit"
          label="Challenge Deposit"
          tooltip="This amount will be staked when challenging this claim. If this challenge is denied, you will lose this deposit."
          isLoading={loading}
          value={challengeDeposit}
          compact
        />,
        <AmountFieldInput
          key="challengeFee"
          id="challengeFee"
          label="Challenge fee"
          tooltip="This is the challenge cost defined by Celeste."
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
          disabled={
            loading || !walletAddress || !isEnoughBalance || challengeTimeout || !isFormValid
          }
          className="m-8"
        />,
      ]}
      onClose={closeModal}
      isOpen={opened}
    >
      <Formik
        initialValues={{ reason: '' } as any}
        onSubmit={(values) => {
          validate(values); // validate one last time before submiting
          if (isFormValid) {
            challengeTx({
              reason: values.reason,
              deposit: challengeDeposit,
            });
          }
        }}
        validateOnChange
        validate={validate}
      >
        {({ values, handleSubmit, handleChange, errors, touched, handleBlur }) => (
          <FormStyled id="form-challenge" onSubmit={handleSubmit} ref={formRef}>
            <Outset gu16>
              <TextFieldInput
                id="reason"
                isEdit
                label="Challenge reason"
                tooltip="Reason why this claim should be challenged."
                isLoading={loading}
                value={values.reason}
                onChange={handleChange}
                multiline
                error={touched.reason && errors.reason}
                onBlur={handleBlur}
                wide
                isMarkDown
              />
            </Outset>
          </FormStyled>
        )}
      </Formik>
    </ModalBase>
  );
}
