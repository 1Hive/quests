import styled from 'styled-components';
import { Tag } from '@1hive/1hive-ui';
import { useEffect, useState } from 'react';
import { GUpx } from 'src/utils/style.util';
import { QuestStatus } from 'src/enums/quest-status.enum';
import { ClaimStatus } from 'src/enums/claim-status.enum';

const StateTagStyled = styled(Tag)`
  width: ${(props: any) => (props.wide ? '100%' : 'fit-content')};
`;

const StateWrapperStyled = styled.div<{ visible: boolean }>`
  text-align: left;
  display: flex;
  justify-content: flex-start;
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  margin-bottom: ${GUpx(1)};
`;

type Props = {
  status: QuestStatus | ClaimStatus | undefined;
  size?: 'normal' | 'small';
  wide?: boolean;
  className?: string;
};

const VISIBLE_STATES = [
  QuestStatus.Expired,
  QuestStatus.Archived,
  ClaimStatus.Scheduled,
  ClaimStatus.AvailableToExecute,
  ClaimStatus.Challenged,
  ClaimStatus.Executed,
  ClaimStatus.Cancelled,
  ClaimStatus.Approved,
  ClaimStatus.Rejected,
  ClaimStatus.Vetoed,
];

export function StatusTag({ status, size = 'normal', wide = false, className }: Props) {
  const [mode, setMode] = useState<string>();
  const [tooltip, setTooltip] = useState<string>();
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    switch (status) {
      // Quest states
      case QuestStatus.Draft:
        setMode('new');
        setTooltip('Not saved yet');
        break;
      case QuestStatus.Active:
        setMode('identifier');
        setTooltip('Active');
        break;
      case QuestStatus.Expired:
        setMode('indicator');
        setTooltip('Expired but still have actions remaining');
        break;
      case QuestStatus.Archived:
        setMode('activity');
        setTooltip('Expired and no more actions to do');
        break;
      // Claim states
      case ClaimStatus.Scheduled:
        setMode('identifier');
        setTooltip('The claim is in a review period');
        break;
      case ClaimStatus.AvailableToExecute:
        setMode('identifier');
        setTooltip('The review period is over and the claim is available to execute');
        break;
      case ClaimStatus.Challenged:
        setMode('indicator');
        setTooltip('A dispute has been raised to Celeste');
        break;
      case ClaimStatus.Cancelled:
      case ClaimStatus.Rejected:
      case ClaimStatus.Vetoed:
        setMode('activity');
        setTooltip('The claim has been denied');
        break;
      case ClaimStatus.Executed:
      case ClaimStatus.Approved:
        setMode('new');
        setTooltip('The player has successfully claimed the bounty');
        break;
      default:
        break;
    }
    setVisible(status ? VISIBLE_STATES.includes(status) : false);
  }, [status]);
  return (
    <>
      {/* <Tag mode="indicator">indicator</Tag>
      <Tag mode="identifier">identifier</Tag>
      <Tag mode="new">new</Tag>
      <Tag mode="activity">activity</Tag> */}
      {visible && (
        <StateWrapperStyled className={className} visible={visible}>
          <StateTagStyled wide={wide} title={tooltip} label={status} mode={mode} size={size} />
        </StateWrapperStyled>
      )}
    </>
  );
}
