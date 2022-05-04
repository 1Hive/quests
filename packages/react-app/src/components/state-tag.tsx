import styled from 'styled-components';
import { Tag } from '@1hive/1hive-ui';
import { ENUM_CLAIM_STATE, ENUM_QUEST_STATE } from 'src/constants';
import { useEffect, useState } from 'react';

const StateTagStyled = styled(Tag)`
  width: ${(props: any) => (props.wide ? '100%' : 'fit-content')};
`;

const StateWrapperStyled = styled.div<{ visible: boolean }>`
  text-align: left;
  display: flex;
  justify-content: space-around;
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
`;

type Props = {
  state: string;
  size?: 'normal' | 'small';
  wide?: boolean;
  className?: string;
};

const VISIBLE_STATES = [
  ENUM_QUEST_STATE.Expired,
  ENUM_QUEST_STATE.Archived,
  ENUM_CLAIM_STATE.Scheduled,
  ENUM_CLAIM_STATE.Challenged,
  ENUM_CLAIM_STATE.Executed,
  ENUM_CLAIM_STATE.Cancelled,
  ENUM_CLAIM_STATE.Approved,
  ENUM_CLAIM_STATE.Rejected,
  ENUM_CLAIM_STATE.Vetoed,
];

export function StateTag({ state, size = 'normal', wide = false, className }: Props) {
  const [mode, setMode] = useState<string>();
  const [tooltip, setTooltip] = useState<string>();
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    switch (state) {
      // Quest states
      case ENUM_QUEST_STATE.Draft:
        setMode('new');
        setTooltip('Not saved yet');
        break;
      case ENUM_QUEST_STATE.Active:
        setMode('identifier');
        setTooltip('Active');
        break;
      case ENUM_QUEST_STATE.Expired:
        setMode('indicator');
        setTooltip('Expired but still have actions remaining');
        break;
      case ENUM_QUEST_STATE.Archived:
        setMode('activity');
        setTooltip('Expired and no more actions to do');
        break;
      // Claim states
      case ENUM_CLAIM_STATE.Scheduled:
        setMode('identifier');
        setTooltip('The claim is active and may pass when delay is over');
        break;
      case ENUM_CLAIM_STATE.Challenged:
        setMode('indicator');
        setTooltip('A dispute has been raised to Celeste');
        break;
      case ENUM_CLAIM_STATE.Cancelled:
      case ENUM_CLAIM_STATE.Rejected:
      case ENUM_CLAIM_STATE.Vetoed:
        setMode('activity');
        setTooltip('The claim has been denied');
        break;
      case ENUM_CLAIM_STATE.Executed:
      case ENUM_CLAIM_STATE.Approved:
        setMode('new');
        setTooltip('The player has successfully claimed the bounty');
        break;
      default:
        break;
    }
    setVisible(VISIBLE_STATES.includes(state));
  }, [state]);
  return (
    <>
      {/* <Tag mode="indicator">indicator</Tag>
      <Tag mode="identifier">identifier</Tag>
      <Tag mode="new">new</Tag>
      <Tag mode="activity">activity</Tag> */}
      {visible && (
        <StateWrapperStyled className={className} visible={visible}>
          <StateTagStyled wide={wide} title={tooltip} label={state} mode={mode} size={size} />
        </StateWrapperStyled>
      )}
    </>
  );
}
