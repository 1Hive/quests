/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button, useToast, IconFlag, Timer } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import { Logger } from 'src/utils/logger';
import { ClaimModel } from 'src/models/claim.model';
import { ENUM, ENUM_TRANSACTION_STATUS } from 'src/constants';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { ChallengeModel } from 'src/models/challenge.model';
import { GUpx } from 'src/utils/css.util';
import { getNetwork } from 'src/networks';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { BigNumber } from 'ethers';
import { useWallet } from 'src/contexts/wallet.context';
import ModalBase from './modal-base';
import {
  useCelesteContract,
  useERC20Contract,
  useGovernQueueContract,
} from '../../hooks/use-contract.hook';
import * as QuestService from '../../services/quest.service';
import { AmountFieldInputFormik } from '../shared/field-input/amount-field-input';
import TextFieldInput from '../shared/field-input/text-field-input';
import { Outset } from '../shared/utils/spacer-util';
import { HelpIcon } from '../shared/field-input/icon-tooltip';
import { getLastBlockDate } from '../../utils/date.utils';

// #region StyledComponents

const FormStyled = styled(Form)`
  width: 100%;
`;

const OpenButtonStyled = styled(Button)`
  margin: ${GUpx()};
`;

const HeaderStyled = styled.div`
  width: 18%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const OpenButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

// #endregion

type Props = {
  claim: ClaimModel;
  challengeDeposit: TokenAmountModel;
  onClose?: Function;
};

export default function ChallengeModal({ claim, challengeDeposit, onClose = noop }: Props) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const [challengeTimeout, setChallengedTimeout] = useState<boolean | undefined>(undefined);
  const [openButtonLabel, setOpenButtonLabel] = useState<string>();
  const [challengeFee, setChallengeFee] = useState<TokenAmountModel | undefined>(undefined);
  const { pushTransaction, updateTransactionStatus, updateLastTransactionStatus } =
    useTransactionContext()!;
  const formRef = useRef<HTMLFormElement>(null);
  const governQueueContract = useGovernQueueContract();
  const erc20DepositContract = useERC20Contract(challengeDeposit.token);
  const erc20FeeContract = useERC20Contract(challengeFee?.token);
  const celesteContract = useCelesteContract();
  const wallet = useWallet();

  useEffect(() => {
    const fetchFee = async () => {
      const feeAmount = await QuestService.fetchChallengeFee(celesteContract);
      setChallengeFee(feeAmount);
    };
    if (celesteContract) {
      fetchFee();
    }
  }, [celesteContract.instance?.address]);

  useEffect(() => {
    let handle: any;
    const launchSetTimeoutAsync = async (execTimeMs: number) => {
      const now = await getLastBlockDate();
      if (now > execTimeMs) setChallengedTimeout(true);
      else {
        setChallengedTimeout(false);
        setTimeout(() => {
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

  const onModalClose = () => {
    setOpened(false);
    onClose();
  };

  const challengeTx = async (values: Partial<ChallengeModel>, setSubmitting: Function) => {
    if (!values.reason) {
      toast('Validation : Reason is required');
    } else {
      try {
        setLoading(true);
        const { governQueueAddress } = getNetwork();
        const feeAndDepositSameToken =
          challengeFee?.token?.token === claim.container?.config.challengeDeposit.token;
        if (
          challengeFee?.parsedAmount &&
          (!feeAndDepositSameToken || !+claim.container!.config.challengeDeposit.amount)
        ) {
          const pendingMessage = 'Approving challenge fee...';
          toast(pendingMessage);
          const approveTxReceipt = await QuestService.approveTokenAmount(
            erc20FeeContract,
            governQueueAddress,
            challengeFee.token,
            (tx) => {
              pushTransaction({
                hash: tx,
                estimatedEnd: Date.now() + ENUM.ENUM_ESTIMATED_TX_TIME_MS.TokenAproval,
                pendingMessage,
                status: ENUM_TRANSACTION_STATUS.Pending,
              });
            },
          );
          updateTransactionStatus({
            hash: approveTxReceipt.transactionHash!,
            status: approveTxReceipt.status
              ? ENUM_TRANSACTION_STATUS.Confirmed
              : ENUM_TRANSACTION_STATUS.Failed,
          });
          if (!approveTxReceipt.status) throw new Error('Failed to approve fee');
        }
        if (+claim.container!.config.challengeDeposit.amount) {
          const pendingMessage = feeAndDepositSameToken
            ? 'Approving challenge fee + deposit...'
            : 'Approving challenge deposit...';
          if (feeAndDepositSameToken) {
            const approvingAmount = BigNumber.from(claim.container!.config.challengeDeposit);
            approvingAmount.add(BigNumber.from(challengeFee?.token?.amount ?? '0'));
            claim.container!.config.challengeDeposit.amount = approvingAmount.toString();
          }
          toast(pendingMessage);
          const approveTxReceipt = await QuestService.approveTokenAmount(
            erc20DepositContract,
            governQueueAddress,
            claim.container!.config.challengeDeposit,
            (tx) => {
              pushTransaction({
                hash: tx,
                estimatedEnd: Date.now() + ENUM.ENUM_ESTIMATED_TX_TIME_MS.TokenAproval,
                pendingMessage,
                status: ENUM_TRANSACTION_STATUS.Pending,
              });
            },
          );
          updateTransactionStatus({
            hash: approveTxReceipt.transactionHash!,
            status: approveTxReceipt.status
              ? ENUM_TRANSACTION_STATUS.Confirmed
              : ENUM_TRANSACTION_STATUS.Failed,
          });
          if (!approveTxReceipt.status) throw new Error('Failed to approve deposit');
        }

        if (!claim.container) throw new Error('Container is not defined');
        const pendingMessage = 'Challenging Quest...';
        toast(pendingMessage);
        const challengeTxReceipt = await QuestService.challengeQuestClaim(
          governQueueContract,
          {
            reason: values.reason,
            deposit: challengeDeposit,
            challengerAddress: wallet.account,
          },
          claim.container,
          (tx) => {
            pushTransaction({
              hash: tx,
              estimatedEnd: Date.now() + ENUM.ENUM_ESTIMATED_TX_TIME_MS.ClaimChallenging,
              pendingMessage,
              status: ENUM_TRANSACTION_STATUS.Pending,
            });
          },
        );
        updateTransactionStatus({
          hash: challengeTxReceipt.transactionHash!,
          status: challengeTxReceipt.status
            ? ENUM_TRANSACTION_STATUS.Confirmed
            : ENUM_TRANSACTION_STATUS.Failed,
        });
        if (!challengeTxReceipt.status) throw new Error('Failed to challenge the quest');
        toast('Operation succeed');
        onModalClose();
      } catch (e: any) {
        updateLastTransactionStatus(ENUM_TRANSACTION_STATUS.Failed);
        Logger.error(e);
        toast(
          e.message.includes('\n') || e.message.length > 75
            ? 'Oops. Something went wrong.'
            : e.message,
        );
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    }
  };

  return (
    <ModalBase
      title={
        <HeaderStyled>
          <h1>Challenge quest</h1>{' '}
          <HelpIcon
            tooltip="What is a challenge?"
            tooltipDetail="A challenge allows you to deny a claim. It will be raised to Celeste and conviction voting will be used to determine the validity of this challenge."
          />
        </HeaderStyled>
      }
      openButton={
        <OpenButtonWrapperStyled>
          {openButtonLabel && (
            <OpenButtonStyled
              icon={<IconFlag />}
              onClick={() => setOpened(true)}
              label={openButtonLabel}
              mode="negative"
              disabled={
                !openButtonLabel ||
                loading ||
                challengeTimeout ||
                !erc20DepositContract ||
                !erc20FeeContract ||
                !governQueueContract
              }
            />
          )}
          {!loading && challengeTimeout === false && claim.executionTimeMs && (
            <Timer end={new Date(claim.executionTimeMs)} />
          )}
        </OpenButtonWrapperStyled>
      }
      buttons={[
        <AmountFieldInputFormik
          key="challengeDeposit"
          id="challengeDeposit"
          label="Challenge Deposit"
          tooltip="Challenge Deposit"
          tooltipDetail="This amount will be staked when challenging this claim. If this challenge is denied, you will lose this deposit."
          isLoading={loading}
          value={challengeDeposit}
          compact
        />,
        <AmountFieldInputFormik
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
          label="Challenge"
          mode="negative"
          type="submit"
          form="form-challenge"
          disabled={loading}
        />,
      ]}
      onClose={onModalClose}
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
