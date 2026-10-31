import { ethers } from 'ethers';
import { QuestPlayStatus } from 'src/enums/quest-play-status.enum';
import { QuestStatus } from 'src/enums/quest-status.enum';
import { FilterModel } from 'src/models/filter.model';
import { QuestModel } from 'src/models/quest.model';
import { TOKENS } from 'src/tokens';
import { ADDRESS_ZERO } from './constants';

// These are display-only examples. They have no quest contract or claim actions.
const examples = [
  {
    id: 'swap-ux',
    title: 'Make swaps easier to understand',
    description:
      'Improve a DEX swap flow with clear price impact, fees, and transaction feedback. Deliverable: a reviewed pull request and tests.',
    hny: 300,
  },
  {
    id: 'dao-dashboard',
    title: 'Design an accessible DAO dashboard',
    description:
      'Turn governance activity into a dashboard that community members can navigate confidently. Deliverable: a prototype and design handoff.',
    hny: 180,
  },
  {
    id: 'onboarding-guide',
    title: 'Write a contributor onboarding guide',
    description:
      'Help new contributors find a quest, submit work, and understand community review. Deliverable: a published guide reviewed by contributors.',
    hny: 75,
  },
  {
    id: 'public-goods-data',
    title: 'Map public goods funding on Gnosis',
    description:
      'Research funding activity and turn the findings into an open, reproducible report. Deliverable: a public dataset and research report.',
    hny: 125,
  },
] as const;

const showcaseExpiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

export const showcaseQuests: QuestModel[] = examples.map(({ id, title, description, hny }) => ({
  showcaseId: id,
  title,
  description,
  expireTime: showcaseExpiry,
  fallbackAddress: ADDRESS_ZERO,
  creatorAddress: ADDRESS_ZERO,
  unlimited: true,
  isWhitelist: false,
  players: [],
  status: QuestStatus.Active,
  features: {},
  rewardToken: {
    ...TOKENS.xdai.Honey,
    amount: ethers.utils.parseUnits(String(hny), 18).toString(),
  },
  bounty: {
    parsedAmount: hny,
    token: {
      ...TOKENS.xdai.Honey,
      amount: ethers.utils.parseUnits(String(hny), 18).toString(),
    },
  },
}));

export function filterShowcaseQuests(filter: FilterModel): QuestModel[] {
  if (filter.status === QuestStatus.Expired || filter.playStatus === QuestPlayStatus.Played)
    return [];
  if (filter.minExpireTime && filter.minExpireTime > showcaseExpiry) return [];
  const search = filter.search.trim().toLowerCase();
  if (!search) return showcaseQuests;
  return showcaseQuests.filter((quest) =>
    `${quest.title} ${quest.description}`.toLowerCase().includes(search),
  );
}
