import { Button, useToast, IconCoin, Field, Timer } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { ReactNode, useEffect, useState } from 'react';
import { CLAIM_STATUS, ENUM, TRANSACTION_STATUS } from 'src/constants';
import { useGovernQueueContract } from 'src/hooks/use-contract.hook';
import { Logger } from 'src/utils/logger';
import { useTransactionContext } from 'src/contexts/transaction.context';
import styled from 'styled-components';
import { GUpx } from 'src/utils/css.util';
import { ClaimModel } from 'src/models/claim.model';
import { ethers } from 'ethers';
import * as QuestService from '../../services/quest.service';
import { AmountFieldInputFormik } from '../shared/field-input/amount-field-input';
import { Outset } from '../shared/utils/spacer-util';
import ModalBase from './modal-base';
import IdentityBadge from '../shared/identity-badge';

// #region StyledComponents

const OpenButtonStyled = styled(Button)`
  margin: 0 ${GUpx()};
  margin-bottom: ${GUpx()};
`;

const OpenButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

// #endregion

type Props = {
  claim: ClaimModel;
  onClose?: Function;
};

export default function ExecuteClaimModal({ claim, onClose = noop }: Props) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scheduleTimeout, setScheduleTimeout] = useState(false);
  const [buttonLabel, setButtonLabel] = useState<ReactNode>();
  const governQueueContract = useGovernQueueContract();
  const { pushTransaction, updateTransactionStatus, updateLastTransactionStatus } =
    useTransactionContext()!;
  const toast = useToast();

  useEffect(() => {
    if (claim.executionTime)
      setTimeout(() => {
        setScheduleTimeout(true);
      }, claim.executionTime - Date.now());
  }, []);

  useEffect(() => {
    if (claim.state === CLAIM_STATUS.Challenged) setButtonLabel('Challenged by someone');
    else if (!scheduleTimeout && claim.executionTime) setButtonLabel('Claimable in');
    else setButtonLabel('Claim');
  }, [claim.state, claim.executionTime, scheduleTimeout]);

  const onModalClose = () => {
    setOpened(false);
    onClose();
  };

  const reclaimFundModalTx = async (values: any, setSubmitting: Function) => {
    try {
      setLoading(true);
      const txReceipt: ethers.ContractReceipt = await QuestService.executeQuestClaim(
        governQueueContract!,
        claim,
        undefined,
        (tx) =>
          pushTransaction({
            hash: tx,
            estimatedEnd: Date.now() + ENUM.ESTIMATED_TX_TIME_MS.ClaimExecuting,
            pendingMessage: 'Sending claimed amount to you...',
            status: txReceipt.status ? TRANSACTION_STATUS.Confirmed : TRANSACTION_STATUS.Failed,
          }),
      );
      updateTransactionStatus({
        hash: txReceipt.transactionHash,
        status: TRANSACTION_STATUS.Confirmed,
      });
      onModalClose();
      if (txReceipt.status) toast('Operation succeed');
    } catch (e: any) {
      updateLastTransactionStatus(TRANSACTION_STATUS.Failed);
      Logger.error(e);
      toast(
        e.message.includes('\n') || e.message.length > 50
          ? 'Oops. Something went wrong.'
          : e.message,
      );
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <>
      <ModalBase
        title="Claim quest bounty"
        openButton={
          <OpenButtonWrapperStyled>
            <OpenButtonStyled
              onClick={() => setOpened(true)}
              icon={<IconCoin />}
              label={buttonLabel}
              mode="strong"
              disabled={
                !scheduleTimeout || claim.state === CLAIM_STATUS.Challenged || !governQueueContract
              }
            />
            {!scheduleTimeout && claim.executionTime && (
              <Timer end={new Date(claim.executionTime)} />
            )}
          </OpenButtonWrapperStyled>
        }
        buttons={
          <Button
            onClick={reclaimFundModalTx}
            icon={<IconCoin />}
            label="Claim bounty"
            wide
            mode="strong"
          />
        }
        onClose={onModalClose}
        isOpen={opened}
      >
        <Outset gu16>
          <AmountFieldInputFormik
            id="bounty"
            isEdit={false}
            label="Claim amount"
            isLoading={loading}
            value={claim.claimedAmount}
          />
          <Field label="will be send to">
            <IdentityBadge entity={claim.playerAddress} badgeOnly />
          </Field>
        </Outset>
      </ModalBase>
    </>
  );
}
