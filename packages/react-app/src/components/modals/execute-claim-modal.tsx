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
import { TokenAmountModel } from 'src/models/token-amount.model';
import { getLastBlockDate } from 'src/utils/date.utils';
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
  questTotalBounty?: TokenAmountModel;
  onClose?: Function;
};

export default function ExecuteClaimModal({ claim, questTotalBounty, onClose = noop }: Props) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<TokenAmountModel>();
  const [scheduleTimeout, setScheduleTimeout] = useState<boolean>();
  const [buttonLabel, setButtonLabel] = useState<ReactNode>('Claim');
  const governQueueContract = useGovernQueueContract();
  const { pushTransaction, updateTransactionStatus, updateLastTransactionStatus } =
    useTransactionContext()!;
  const toast = useToast();

  useEffect(() => {
    const launchTimeoutAsync = async (execTimeMs: number) => {
      const now = await getLastBlockDate();
      if (now > execTimeMs) setScheduleTimeout(true);
      else {
        setScheduleTimeout(false);
        setTimeout(() => {
          setScheduleTimeout(true);
        }, execTimeMs - now); // To ms
      }
      setLoading(false);
    };
    if (claim.executionTimeMs) launchTimeoutAsync(claim.executionTimeMs);
  }, []);

  useEffect(() => {
    if (scheduleTimeout === undefined) return;
    if (claim.state === CLAIM_STATUS.Challenged) setButtonLabel('Challenged by someone');
    else if (!scheduleTimeout && claim.executionTimeMs) setButtonLabel('Claimable in');
    else setButtonLabel('Claim');
  }, [claim.state, claim.executionTimeMs, scheduleTimeout]);

  useEffect(() => {
    if (claim.claimedAmount.parsedAmount) setAmount(claim.claimedAmount);
    else setAmount(questTotalBounty); // Claim all funds
  }, [claim.claimedAmount]);

  const onModalClose = () => {
    setOpened(false);
    onClose();
  };

  const claimTx = async () => {
    try {
      setLoading(true);
      toast('Sending claimed amount to your wallet...');
      const txReceipt: ethers.ContractReceipt = await QuestService.executeQuestClaim(
        governQueueContract,
        claim,
        (tx) =>
          pushTransaction({
            hash: tx,
            estimatedEnd: Date.now() + ENUM.ESTIMATED_TX_TIME_MS.ClaimExecuting,
            pendingMessage: 'Sending claimed amount to your wallet...',
            status: TRANSACTION_STATUS.Pending,
          }),
      );
      updateTransactionStatus({
        hash: txReceipt.transactionHash,
        status: txReceipt.status ? TRANSACTION_STATUS.Confirmed : TRANSACTION_STATUS.Failed,
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
              mode="positive"
              disabled={
                loading ||
                !scheduleTimeout ||
                claim.state === CLAIM_STATUS.Challenged ||
                !governQueueContract
              }
            />
            {!loading && !scheduleTimeout && claim.executionTimeMs && (
              <Timer end={new Date(claim.executionTimeMs)} />
            )}
          </OpenButtonWrapperStyled>
        }
        buttons={
          <Button
            onClick={() => claimTx()}
            icon={<IconCoin />}
            label="Claim"
            disabled={loading}
            wide
            mode="positive"
          />
        }
        onClose={onModalClose}
        isOpen={opened}
      >
        <Outset gu16>
          <AmountFieldInputFormik
            id="bounty"
            label="Claim amount"
            isLoading={loading}
            value={amount}
          />
          <Field label="will be send to">
            <IdentityBadge entity={claim.playerAddress} badgeOnly />
          </Field>
        </Outset>
      </ModalBase>
    </>
  );
}
