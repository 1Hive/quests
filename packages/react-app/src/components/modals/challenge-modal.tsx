/* eslint-disable no-nested-ternary */
import { Button, useToast, IconFlag } from '@1hive/1hive-ui';
import { debounce, noop, uniqueId } from 'lodash-es';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { Formik, Form, FormikErrors } from 'formik';
import { ClaimModel } from 'src/models/claim.model';
import { ENUM, ENUM_CLAIM_STATE, ENUM_TRANSACTION_STATUS } from 'src/constants';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { ChallengeModel } from 'src/models/challenge.model';
import { GUpx } from 'src/utils/style.util';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { BigNumber } from 'ethers';
import { useWallet } from 'src/contexts/wallet.context';
import { TokenModel } from 'src/models/token.model';
import { computeTransactionErrorMessage } from 'src/utils/errors.util';
import { approveTokenTransaction } from 'src/services/transaction-handler';
import { useIsMountedRef } from 'src/hooks/use-mounted.hook';
import { TransactionModel } from 'src/models/transaction.model';
import { FaEdit, FaEye } from 'react-icons/fa';
import { getNetwork } from 'src/networks';
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

const LineStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ButtonLinkStyled = styled(Button)`
  border: none;
  box-shadow: none;
  padding: 0;
  height: fit-content;
  color: ${({ theme }: any) => theme.contentSecondary};
  font-weight: bold;
  background: transparent;
  padding-top: 4px;
`;

// #endregion

type Props = {
  claim: ClaimModel;
  challengeDeposit: TokenAmountModel;
  challengeData?: ChallengeModel;
  onClose?: ModalCallback;
};

const emptyChallengeData = {} as ChallengeModel;

export default function ChallengeModal({
  claim,
  challengeData = emptyChallengeData,
  challengeDeposit,
  onClose = noop,
}: Props) {
  const toast = useToast();
  const [opened, setOpened] = useState(false);
  const [isEnoughBalance, setIsEnoughBalance] = useState(false);
  const [isFeeDepositSameToken, setIsFeeDepositSameToken] = useState<boolean>();
  const [challengeFee, setChallengeFee] = useState<TokenAmountModel | undefined>(undefined);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [challengeDataState, setChallengeDataState] = useState<ChallengeModel>(challengeData);
  const { setTransaction } = useTransactionContext();
  const formRef = useRef<HTMLFormElement>(null);
  const { walletAddress } = useWallet();
  const modalId = useMemo(() => uniqueId('challenge-modal'), []);
  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    const fetchFee = async () => {
      const feeAmount = await QuestService.fetchChallengeFee();
      if (feeAmount && isMountedRef.current) setChallengeFee(feeAmount);
    };
    fetchFee();
  }, []);
  const debounceSave = useCallback(
    debounce((data: ChallengeModel) => setChallengeDataState(data), 500),
    [],
  );

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
    if (isFormValid) {
      try {
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
        const txPayload = {
          modalId,
          estimatedDuration: ENUM.ENUM_ESTIMATED_TX_TIME_MS.ClaimChallenging,
          message: `Challenging Quest (${isFeeDepositSameToken ? '2/2' : '3/3'})`,
          status: ENUM_TRANSACTION_STATUS.WaitingForSignature,
          type: 'ClaimChallenge',
          args: { questAddress: claim.questAddress, containerId: claim.container.id },
        } as TransactionModel;
        setTransaction(txPayload);
        const challengeTxReceipt = await QuestService.challengeQuestClaim(
          walletAddress,
          {
            reason: values.reason!,
            deposit: challengeDeposit,
            challengerAddress: walletAddress,
          },
          claim.container,
          (txHash) => {
            setTransaction({
              ...txPayload,
              hash: txHash,
              status: ENUM_TRANSACTION_STATUS.Pending,
            });
          },
        );
        setTransaction({
          ...txPayload,
          status: challengeTxReceipt?.status
            ? ENUM_TRANSACTION_STATUS.Confirmed
            : ENUM_TRANSACTION_STATUS.Failed,
        });
        if (!challengeTxReceipt?.status) throw new Error('Failed to challenge the quest');
        if (isMountedRef.current) {
          setChallengeDataState(emptyChallengeData);
        }
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
      }
    }
  };

  const validate = (values: ChallengeModel) => {
    const errors = {} as FormikErrors<ChallengeModel>;
    if (!values.reason) errors.reason = 'Challenge reason is required';
    debounceSave(values);
    setIsFormValid(Object.keys(errors).length === 0);
    return errors;
  };

  return (
    <ModalBase
      id={modalId}
      title="Challenge quests"
      openButton={
        <OpenButtonWrapperStyled>
          <OpenButtonStyled
            icon={<IconFlag />}
            onClick={() => setOpened(true)}
            label="Challenge"
            mode="negative"
            title={
              claim.state === ENUM_CLAIM_STATE.AvailableToExecute
                ? 'Challenge period is over'
                : "Open challenge for this quest's claim"
            }
            disabled={claim.state === ENUM_CLAIM_STATE.AvailableToExecute}
          />
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
          value={challengeDeposit}
          compact
        />,
        <AmountFieldInput
          key="challengeFee"
          id="challengeFee"
          label="Challenge fee"
          tooltip="This is the challenge cost defined by Celeste."
          isLoading={challengeFee === undefined}
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
          disabled={!isEnoughBalance || !isFormValid}
          title={!isFormValid ? 'Form not valid' : 'Challenge'}
          className="m-8"
        />,
      ]}
      onClose={closeModal}
      isOpen={opened}
    >
      <Formik
        initialValues={{ reason: challengeDataState.reason ?? '' } as any}
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
                isEdit={!showPreview}
                label={
                  <LineStyled>
                    Challenge reason
                    <Outset horizontal>
                      <ButtonLinkStyled
                        size="mini"
                        icon={showPreview ? <FaEdit /> : <FaEye />}
                        display="icon"
                        label={showPreview ? 'Edit' : 'Preview'}
                        onClick={() => setShowPreview((old) => !old)}
                        title={
                          showPreview
                            ? 'Back to edit mode'
                            : 'Show a preview of the challenge reason'
                        }
                      />
                    </Outset>
                  </LineStyled>
                }
                tooltip="Reason why this claim should be challenged."
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
