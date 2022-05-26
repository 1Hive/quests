import { ENUM_QUEST_VIEW_MODE } from '../constants';
import { useWallet } from '../contexts/wallet.context';
import QuestModal from './modals/create-quest-modal';
import { Filter } from './filter';
import { Outset } from './utils/spacer-util';

export default function Sidebar() {
  const { walletAddress } = useWallet();
  return (
    <Outset horizontal gu16 className="pb-0 pt-24">
      <Filter />
      {walletAddress && <QuestModal questMode={ENUM_QUEST_VIEW_MODE.Create} />}
    </Outset>
  );
}
