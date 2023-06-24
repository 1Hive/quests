/* eslint-disable no-nested-ternary */
import { Button, IconCaution, IconCoin, Info } from '@1hive/1hive-ui';
import { noop, uniqueId } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { useWallet } from 'src/contexts/wallet.context';
import { ClaimStatus } from 'src/enums/claim-status.enum';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { TransactionType } from 'src/enums/transaction-type.enum';
import { ClaimModel } from 'src/models/claim.model';
import { QuestModel } from 'src/models/quest.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { TransactionModel } from 'src/models/transaction.model';
import { computeTransactionErrorMessage } from 'src/utils/errors.util';
import { compareCaseInsensitive } from 'src/utils/string.util';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import * as QuestService from '../../services/quest.service';
import { AddressFieldInput } from '../field-input/address-field-input';
import AmountFieldInput from '../field-input/amount-field-input';
import { Outset } from '../utils/spacer-util';
import ModalBase, { ModalCallback } from './modal-base';

// #region StyledComponents

const OpenButtonStyled = styled(Button)`
  margin: ${GUpx(1)};
  width: fit-content;

  &,
  span {
    color: #242424;
  }
`;

const OpenButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

const OnlyStackholderWarnStyled = styled(Info)`
  padding: ${GUpx(1)};
  margin-top: ${GUpx(4)};
  display: flex;
  align-items: center;
`;

const WarningIconContainerStyled = styled.div`
  width: 32px;
`;

// #endregion

type Props = {
  claim: ClaimModel;
  questData: QuestModel;
  questTotalBounty?: TokenAmountModel | null;
  claimable: boolean;
  onClose?: ModalCallback;
};

export default function ExecuteClaimModal({
  claim,
  questData,
  questTotalBounty,
  onClose = noop,
  claimable,
}: Props) {
  const [opened, setOpened] = useState(false);
  const [amount, setAmount] = useState<TokenAmountModel>();
  const { setTransaction } = useTransactionContext();
  const { walletAddress } = useWallet();
  const modalId = useMemo(() => uniqueId('execute-claim-modal'), []);

  useEffect(() => {
    if (questTotalBounty) {
      if (claim.claimAll) setAmount(questTotalBounty);
      else setAmount(claim.claimedAmount); // Claim all funds
    }
  }, [claim.claimedAmount, questTotalBounty]);

  const onModalClosed = (success: boolean) => {
    setOpened(false);
    onClose(success);
  };

  const claimTx = async () => {
    try {
      let txPayload: TransactionModel = {
        modalId,
        message: 'Claiming bounty',
        status: TransactionStatus.WaitingForSignature,
        type: TransactionType.ClaimExecute,
        args: { questAddress: claim.questAddress, containerId: claim.container!.id },
      };
      setTransaction(txPayload);
      const txReceipt = await QuestService.executeQuestClaim(
        walletAddress,
        questData,
        claim,
        (txHash) => {
          txPayload = { ...txPayload, hash: txHash };
          setTransaction({
            ...txPayload,
            status: TransactionStatus.Pending,
          });
        },
      );
      setTransaction({
        ...txPayload,
        status: txReceipt?.status ? TransactionStatus.Confirmed : TransactionStatus.Failed,
      });
      if (!txReceipt?.status) throw new Error('Failed to execute claim');
    } catch (e: any) {
      setTransaction(
        (oldTx) =>
          oldTx && {
            ...oldTx,
            status: TransactionStatus.Failed,
            message: computeTransactionErrorMessage(e),
          },
      );
    }
  };

  return (
    <>
      <ModalBase
        id={modalId}
        title="Claim quest bounty"
        openButton={
          <OpenButtonWrapperStyled>
            <OpenButtonStyled
              onClick={() => setOpened(true)}
              icon={<IconCoin />}
              label="Execute"
              mode="positive"
              title={
                !claimable
                  ? 'Wait for the delay period to end before claiming...'
                  : questTotalBounty &&
                    claim.claimedAmount.parsedAmount > questTotalBounty?.parsedAmount
                  ? 'Not enough funds in Quest to claim'
                  : 'Open quest claim'
              }
              disabled={
                !questTotalBounty ||
                claim.claimedAmount.parsedAmount > questTotalBounty?.parsedAmount ||
                !claimable
              }
            />
          </OpenButtonWrapperStyled>
        }
        buttons={
          <Button
            onClick={claimTx}
            icon={<IconCoin />}
            label="Execute"
            disabled={claim.state === ClaimStatus.Challenged}
            title="Trigger claim operation in the chain"
            mode="positive"
          />
        }
        onModalClosed={onModalClosed}
        isOpened={opened}
        size="small"
      >
        <Outset gu16>
          <AmountFieldInput id="bounty" label="Claim amount" value={amount} />
          <AddressFieldInput
            id="playerAddress"
            label="will be sent to (Player)"
            value={claim.playerAddress}
          />
          {!compareCaseInsensitive(claim.playerAddress, walletAddress) && (
            <OnlyStackholderWarnStyled mode="warning">
              <WarningIconContainerStyled>
                <IconCaution />
              </WarningIconContainerStyled>
              <Outset>
                Anyone can execute this claim. If you didn&apos;t create the claim, consider
                contacting the Player after executing.
              </Outset>
            </OnlyStackholderWarnStyled>
          )}
        </Outset>
      </ModalBase>
    </>
  );
}
