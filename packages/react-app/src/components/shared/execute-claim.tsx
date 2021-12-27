import { useEffect, useState } from 'react';
import * as QuestService from 'src/services/quest.service';
import { Button, Timer, useToast } from '@1hive/1hive-ui';
import { GiBroadsword } from 'react-icons/gi';
import { ClaimModel } from 'src/models/claim.model';
import { useGovernQueueContract } from 'src/hooks/use-contract.hook';
import styled from 'styled-components';

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
  const [scheduleTimeout, setScheduleTimeout] = useState(false);
  useEffect(() => {
    if (claim.executionTime)
      setTimeout(() => {
        setScheduleTimeout(true);
      }, claim.executionTime - Date.now());
  }, []);

  const executeClaim = async () => {
    toast('Comming soon ...');
    await QuestService.executeQuestClaim(governQueueContract, claim);
    // toast('Operation succeed');
  };

  return (
    <>
      {claim.executionTime && (
        <Button
          icon={<GiBroadsword />}
          onClick={() => executeClaim()}
          label={
            <>
              Execute claim
              {!scheduleTimeout && claim.executionTime && (
                <TimerStyled end={new Date(claim.executionTime)} />
              )}
            </>
          }
          disabled={!scheduleTimeout}
          mode="positive"
        />
      )}
    </>
  );
}
