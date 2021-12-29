import { ReactNode, useEffect, useState } from 'react';
import * as QuestService from 'src/services/quest.service';
import { Button, Timer, useToast } from '@1hive/1hive-ui';
import { GiBroadsword } from 'react-icons/gi';
import { ClaimModel } from 'src/models/claim.model';
import { useGovernQueueContract } from 'src/hooks/use-contract.hook';
import styled from 'styled-components';
import { CLAIM_STATUS, TRANSACTION_STATUS } from 'src/constants';
import { useTransactionContext } from 'src/contexts/transaction.context';

// #region StyledComponents

const TimerStyled = styled(Timer)`
  svg {
    color: white !important;
  }
`;

// #endregion

type Props = {
  claim: ClaimModel;
};

export function ExecuteClaim({ claim }: Props) {
  const toast = useToast();
  const governQueueContract = useGovernQueueContract();
  const { pushTransaction } = useTransactionContext()!;
  const [scheduleTimeout, setScheduleTimeout] = useState(false);

  useEffect(() => {
    if (claim.executionTime)
      setTimeout(() => {
        setScheduleTimeout(true);
      }, claim.executionTime - Date.now());
  }, []);

  const executeClaim = async () => {
    toast('Comming soon...');
    await QuestService.executeQuestClaim(governQueueContract, claim, undefined, (tx) =>
      pushTransaction({
        hash: tx,
        estimatedEnd: Date.now() + 10 * 1000,
        pendingMessage: 'Quest creating...',
        status: TRANSACTION_STATUS.Pending,
      }),
    );
    toast('Operation succeed');
  };

  const [buttonLabel, setButtonLabel] = useState<ReactNode>();

  useEffect(() => {
    if (claim.state === CLAIM_STATUS.Challenged) setButtonLabel('Challenged by someone');
    else if (!scheduleTimeout && claim.executionTime)
      setButtonLabel(
        <>
          Claimable in
          <TimerStyled end={new Date(claim.executionTime)} />
        </>,
      );
    else setButtonLabel('Claim');
  }, [claim.state, claim.executionTime, scheduleTimeout]);

  return (
    <>
      {claim.executionTime && (
        <Button
          icon={<GiBroadsword />}
          onClick={() => executeClaim()}
          label={buttonLabel}
          disabled={!scheduleTimeout || claim.state === CLAIM_STATUS.Challenged}
          mode="positive"
        />
      )}
    </>
  );
}
