import styled from 'styled-components';
import { Tag } from '@1hive/1hive-ui';
import { QUEST_STATE } from 'src/constants';
import { useEffect, useState } from 'react';
import { GUpx } from 'src/utils/css.util';

const StateTagStyled = styled(Tag)`
  margin-left: ${GUpx()};
`;

type Props = {
  state: string;
  visible: boolean;
};

export function StateTag({ state, visible }: Props) {
  const [mode, setMode] = useState<string>();
  useEffect(() => {
    switch (state) {
      case QUEST_STATE.Draft:
        setMode('new');
        break;
      case QUEST_STATE.Active:
        setMode('indicator');
        break;
      case QUEST_STATE.Expired:
        setMode('identifier');
        break;
      case QUEST_STATE.Archived:
        setMode('identifier');
        break;
      default:
        break;
    }
  }, [state]);
  return <>{visible && <StateTagStyled mode={mode}>{state}</StateTagStyled>}</>;
}
