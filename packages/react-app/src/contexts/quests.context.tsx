import React, { createContext, useContext, useState } from 'react';
import { QuestModel } from 'src/models/quest.model';

type QuestsContextModel = {
  newQuest: QuestModel | undefined;
  // eslint-disable-next-line no-unused-vars
  setNewQuest: (quest: QuestModel) => void;
};

const QuestsContext = createContext<QuestsContextModel | undefined>(undefined);
export const useQuestsContext = () => useContext(QuestsContext);

type Props = {
  children: React.ReactNode;
};
export const QuestsContextProvider = ({ children }: Props) => {
  const [newQuest, setNewQuest] = useState<QuestModel>();

  return (
    <QuestsContext.Provider value={{ newQuest, setNewQuest }}>{children}</QuestsContext.Provider>
  );
};
