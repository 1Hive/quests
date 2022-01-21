import styled from 'styled-components';
import { Tag } from '@1hive/1hive-ui';
import { ENUM_CLAIM_STATE, ENUM_QUEST_STATE } from 'src/constants';
import { useEffect, useState } from 'react';
import { GUpx } from 'src/utils/css.util';

const StateTagStyled = styled(Tag)`
  width: ${(props: any) => (props.wide ? '100%' : 'fit-content')};
`;

const StateWrapperStyled = styled.div`
  text-align: left;
  padding: ${GUpx(1)};
  display: flex;
  justify-content: space-around;
`;

type Props = {
  state: string;
  size?: 'normal' | 'small';
  wide?: boolean;
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

export function StateTag({ state, size = 'normal', wide = false }: Props) {
  const [mode, setMode] = useState<string>();
  const [tooltip, setTooltip] = useState<string>();
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    switch (state) {
      // Quest states
      case ENUM_QUEST_STATE.Draft:
        setMode('new');
        setTooltip('Not yet saved');
        break;
      case ENUM_QUEST_STATE.Active:
        setMode('activity');
        setTooltip('Active');
        break;
      case ENUM_QUEST_STATE.Expired:
        setMode('indicator');
        setTooltip('Expire time has reached');
        break;
      case ENUM_QUEST_STATE.Archived:
        setMode('identifier');
        setTooltip('Expired and no funds');
        break;
      // Claim states
      case ENUM_CLAIM_STATE.Scheduled:
        setMode('activity');
        setTooltip('The claim is active and may pass when delay is over');
        break;
      case ENUM_CLAIM_STATE.Challenged:
        setMode('indicator');
        setTooltip('A dispute has been raised to Celeste');
        break;
      case ENUM_CLAIM_STATE.Cancelled:
      case ENUM_CLAIM_STATE.Rejected:
      case ENUM_CLAIM_STATE.Vetoed:
        setMode('identifier');
        setTooltip('The claim has been denied');
        break;
      case ENUM_CLAIM_STATE.Executed:
      case ENUM_CLAIM_STATE.Approved:
        setMode('new');
        setTooltip('The player has successfully claim the bounty');
        break;
      default:
        break;
    }
    setVisible(VISIBLE_STATES.includes(state));
  }, [state]);
  return (
    <>
      {visible && (
        <StateWrapperStyled>
          <StateTagStyled wide={wide} title={tooltip} label={state} mode={mode} size={size} />
        </StateWrapperStyled>
      )}
    </>
  );
}
