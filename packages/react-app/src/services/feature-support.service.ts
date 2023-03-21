import { QuestModel } from 'src/models/quest.model';

export type FeatureSupportModel = {
  playableQuest?: boolean;
};

export function loadFeatureSupport(questModel: QuestModel) {
  if (questModel.version != null) {
    questModel.features = { playableQuest: questModel.version >= 1 };
  }
}
