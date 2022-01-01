import styled from 'styled-components';
import { Tag } from '@1hive/1hive-ui';
import { QUEST_STATE } from 'src/constants';
import { useEffect, useState } from 'react';
import { GUpx } from 'src/utils/css.util';

const StateTagStyled = styled(Tag)`
  width: fit-content;
  margin-left: ${GUpx(2)};
`;

type Props = {
  state: string;
  visible: boolean;
};

export function StateTag({ state, visible }: Props) {
  const [mode, setMode] = useState<string>();
  const [tooltip, setTooltip] = useState<string>();
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
  }, [state]);
  return (
    <>
      {visible && (
        <StateTagStyled title={tooltip} mode={mode}>
          {state}
        </StateTagStyled>
      )}
    </>
  );
}
