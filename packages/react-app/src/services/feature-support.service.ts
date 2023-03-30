import { QuestModel } from 'src/models/quest.model';

export type FeatureSupportModel = {
  playableQuest?: boolean;
  communicationLink?: boolean;
};

export function loadFeatureSupport(questModel: QuestModel) {
  if (questModel.version != null) {
    questModel.features = {
      playableQuest: questModel.version >= 1,
      communicationLink: typeof questModel.communicationLink === 'string',
    };
  }
}
