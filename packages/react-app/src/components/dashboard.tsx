import { GU, useTheme, textStyle } from '@1hive/1hive-ui';
import { useEffect, useState } from 'react';
import { ENUM_QUEST_VIEW_MODE } from 'src/constants';
import { DashboardModel } from 'src/models/dashboard.model';
import { getDashboardInfo } from 'src/services/quest.service';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import { FieldInput } from './field-input/field-input';
import QuestModal from './modals/quest-modal';
import { ChildSpacer } from './utils/spacer-util';

// #region StyledComponents

const BoxStyled = styled.div`
  background: ${({ theme }: any) => theme.accent};
  border-radius: 8px;
  width: 100%;
  margin-right: ${GUpx(4)};
  padding: ${GUpx(2)};
`;

const TextStyled = styled.span`
  color: ${({ theme }: any) => theme.positive};
  font-weight: bold !important;
  ${textStyle('title3')};
`;

const SpacerStyled = styled.div`
  padding-bottom: 8px;
`;

const LabelStyled = styled.div`
  ${textStyle('label1')};
  font-weight: bold !important;
  color: ${({ theme }: any) => theme.accentContent};
`;

// #endregion

export default function Dashboard() {
  const theme = useTheme();
  const [dashboardModel, setDashboardModel] = useState<DashboardModel>();
  useEffect(() => {
    let isSubscribed = true;
    getDashboardInfo().then((innerDashboardModel) => {
      if (isSubscribed) {
        setDashboardModel(innerDashboardModel);
      }
    });
    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <BoxStyled padding={2 * GU} theme={theme}>
      <ChildSpacer justify="space-around" align="center">
        <FieldInput
          label={<LabelStyled>Bounty Pool</LabelStyled>}
          tooltip="Not yet implemented"
          tooltipDetail="Total of the quest bounties converted into USD"
          isLoading={!dashboardModel}
        >
          <TextStyled theme={theme}>$ {dashboardModel?.totalFunds}</TextStyled>
        </FieldInput>
        <FieldInput
          label={<LabelStyled>Open Quests</LabelStyled>}
          tooltip="Number of active Quests"
          tooltipDetail="All the quests that are currently not expired or closed"
          isLoading={!dashboardModel}
        >
          <TextStyled theme={theme}>{dashboardModel?.questCount}</TextStyled>
        </FieldInput>
        <SpacerStyled>
          <QuestModal questMode={ENUM_QUEST_VIEW_MODE.Create} />
        </SpacerStyled>
      </ChildSpacer>
    </BoxStyled>
  );
}
