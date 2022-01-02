import styled from 'styled-components';
import { Tag } from '@1hive/1hive-ui';
import { QUEST_STATE } from 'src/constants';
import { useEffect, useState } from 'react';
import { GUpx } from 'src/utils/css.util';

const StateTagStyled = styled(Tag)`
  width: fit-content;
`;

const StateWrapperStyled = styled.div`
  width: 100%;
  text-align: left;
  padding: ${GUpx(1)};
`;

type Props = {
  state: string;
};

const VISIBLE_STATES = [QUEST_STATE.Expired, QUEST_STATE.Archived, QUEST_STATE.Draft];

export function StateTag({ state }: Props) {
  const [mode, setMode] = useState<string>();
  const [tooltip, setTooltip] = useState<string>();
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    switch (state) {
      case QUEST_STATE.Draft:
        setMode('new');
        setTooltip('Not yet saved');
        break;
      case QUEST_STATE.Active:
        setMode('indicator');
        setTooltip('Active');
        break;
      case QUEST_STATE.Expired:
        setMode('identifier');
        setTooltip('Expire time has reached');
        break;
      case QUEST_STATE.Archived:
        setMode('identifier');
        setTooltip('Expired and no funds');
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
          <StateTagStyled title={tooltip} mode={mode}>
            {state}
          </StateTagStyled>
        </StateWrapperStyled>
      )}
    </>
  );
}
