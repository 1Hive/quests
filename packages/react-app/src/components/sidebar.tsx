import { Box } from '@1hive/1hive-ui';
import styled from 'styled-components';
import { ENUM_QUEST_VIEW_MODE } from '../constants';
import { useWallet } from '../contexts/wallet.context';
import QuestModal from './modals/quest-modal';
import { Filter } from './filter';
import { Outset } from './utils/spacer-util';

// #region StyledComponent

const BoxStyled = styled(Box)`
  width: 100%;
  min-width: fit-content;
`;
const DivStyled = styled.div`
  background-color: red;
`;

// #endregion

export default function Sidebar() {
  const { walletAddress } = useWallet();
  return (
    <Outset horizontal gu16 className="pb-0 pt-24">
      <BoxStyled>
        <Outset>
          <>
            {walletAddress && (
              <>
                <QuestModal questMode={ENUM_QUEST_VIEW_MODE.Create} />
                <Outset gu16 />
              </>
            )}
            <Filter />
          </>
        </Outset>
      </BoxStyled>
    </Outset>
  );
}
