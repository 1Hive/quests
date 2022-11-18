/* eslint-disable no-nested-ternary */
import { Button, IconRotateLeft, IconCaution, Info } from '@1hive/1hive-ui';
import { noop, uniqueId } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { ENUM_TRANSACTION_STATUS, ENUM } from 'src/constants';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { QuestModel } from 'src/models/quest.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import styled from 'styled-components';
import { GUpx } from 'src/utils/style.util';
import { useWallet } from 'src/contexts/wallet.context';
import { computeTransactionErrorMessage } from 'src/utils/errors.util';
import { getTokenInfo } from 'src/utils/contract.util';
import { toTokenAmountModel } from 'src/utils/data.utils';
import { TokenModel } from 'src/models/token.model';
import { useIsMountedRef } from 'src/hooks/use-mounted.hook';
import { TransactionModel } from 'src/models/transaction.model';
import * as QuestService from '../../services/quest.service';
import { AmountFieldInputFormik } from '../field-input/amount-field-input';
import { Outset } from '../utils/spacer-util';
import ModalBase, { ModalCallback } from './modal-base';
import { FieldInput } from '../field-input/field-input';
import { AddressFieldInput } from '../field-input/address-field-input';

// #region StyledComponents

const OpenButtonStyled = styled(Button)`
  margin: 0 ${GUpx(1)};
  width: fit-content;
`;

const RowStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const OnlyStackholderWarnStyled = styled(Info)`
  padding: ${GUpx(1)};
  margin-top: ${GUpx(4)};
  display: flex;
  align-items: center;
`;

const AmoutWrapperStyled = styled.div`
  padding: ${GUpx(2)};
  min-width: 200px;
`;

// #endregion

type Props = {
  questData: QuestModel;
  bounty?: TokenAmountModel | null;
  isDepositReleased: boolean;
  onClose?: ModalCallback;
  pendingClaims: boolean;
};

export default function ReclaimFundsModal({
  questData,
  bounty,
  onClose = noop,
  isDepositReleased,
  pendingClaims,
}: Props) {
  const [opened, setOpened] = useState(false);
  const { setTransaction } = useTransactionContext();
  const { walletAddress } = useWallet();
  const [depositTokenAmount, setDepositTokenAmount] = useState<TokenAmountModel>();
  const modalId = useMemo(() => uniqueId('reclaim-funds-modal'), []);
  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    if (questData.createDeposit) {
      const depositAmount = questData.createDeposit;
      getTokenInfo(questData.createDeposit?.token).then((token) => {
        if (isMountedRef.current) {
          setDepositTokenAmount(
            toTokenAmountModel({
              ...token,
              amount: depositAmount.amount.toString(),
            } as TokenModel),
          );
        }
      });
    }
  }, []);

  const recoverFundTx = async () => {
    try {
      let txPayload = {
        modalId,
        estimatedDuration: ENUM.ENUM_ESTIMATED_TX_TIME_MS.QuestFundsReclaiming,
        message: 'Reclaiming funds and deposit',
        status: ENUM_TRANSACTION_STATUS.WaitingForSignature,
        type: 'QuestReclaimFunds',
        args: { questAddress: questData.address },
      } as TransactionModel;
      setTransaction(txPayload);
      const txReceipt = await QuestService.recoverFundsAndDeposit(
        walletAddress,
        questData,
        (txHash) => {
          txPayload = { ...txPayload, hash: txHash };
          setTransaction({
            ...txPayload,
            status: ENUM_TRANSACTION_STATUS.Pending,
          });
        },
      );
      setTransaction({
        ...txPayload,
        status: txReceipt?.status
          ? ENUM_TRANSACTION_STATUS.Confirmed
          : ENUM_TRANSACTION_STATUS.Failed,
      });
      if (!txReceipt?.status) throw new Error('Failed to reclaim funds');
    } catch (e: any) {
      setTransaction(
        (oldTx) =>
          oldTx && {
            ...oldTx,
            status: ENUM_TRANSACTION_STATUS.Failed,
            message: computeTransactionErrorMessage(e),
          },
      );
    }
  };

  const closeModal = (success: boolean) => {
    setOpened(false);
    onClose(success);
  };

  return (
    <>
      <ModalBase
        id={modalId}
        title="Recover remaining funds and deposit"
        openButton={
          <OpenButtonStyled
            onClick={() => setOpened(true)}
            icon={<IconRotateLeft />}
            label="Recover"
            mode="strong"
            title="Recover remaining funds and deposit"
          />
        }
        buttons={
          <Button
            onClick={recoverFundTx}
            icon={<IconRotateLeft />}
            label="Recover"
            mode="strong"
            title="Recover remaining funds and deposit"
          />
        }
        onClose={closeModal}
        isOpen={opened}
      >
        <RowStyled>
          <AmoutWrapperStyled>
            <AmountFieldInputFormik id="bounty" label="Unused funds" value={bounty} />
          </AmoutWrapperStyled>
          <Outset gu16>
            <FieldInput label="Recovery address">
              <AddressFieldInput id="RecoveryAddress" value={questData.fallbackAddress} />
            </FieldInput>
          </Outset>
        </RowStyled>
        {depositTokenAmount && !isDepositReleased && (
          <RowStyled>
            <AmoutWrapperStyled>
              <AmountFieldInputFormik id="bounty" label="Deposit" value={depositTokenAmount} />
            </AmoutWrapperStyled>
            <Outset gu16>
              <FieldInput label="Creator address">
                <AddressFieldInput id="CreatorAddress" value={questData.creatorAddress} />
              </FieldInput>
            </Outset>
          </RowStyled>
        )}
        {pendingClaims && (
          <OnlyStackholderWarnStyled mode="warning">
            <IconCaution />
            <Outset>
              There is pending claim in this quest that has not been executed. Are you sure that you
              want to empty the bounty pool ?
            </Outset>
          </OnlyStackholderWarnStyled>
        )}
      </ModalBase>
    </>
  );
}
