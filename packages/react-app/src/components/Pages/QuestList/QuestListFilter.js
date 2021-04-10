import PropTypes from 'prop-types';
import React from 'react';
import {
  Box,
  Button,
  DateRangePicker,
  DropDown,
  Field,
  GU,
  IconClose,
  SearchInput,
  Switch,
} from '@1hive/1hive-ui';
import styled from 'styled-components';
import { CRYPTOS, QUEST_STATUS } from '../../../constants';

import { debounce } from '../../../utils/class-util';
import { Spacer16 } from '../../Shared/Utils/Spacer';
import Separator from '../../Shared/Utils/Splitter';
import AmountFieldInput from '../../Shared/FieldInput/AmountFieldInput';
import TagFieldInput from '../../Shared/FieldInput/TagFieldInput';
import CreateQuestModal from '../../Modals/QuestModal';

// #region StyledComponent

const BoxStyled = styled(Box)`
  width: fit-content;
  margin-bottom: ${2 * GU}px;
`;

// #endregion

const questStatusOptions = Object.values(QUEST_STATUS).map((x) => x.label);

const defaultFilter = {
  search: '',
  status: null,
  expiration: { start: null, end: null },
  tags: [],
  bounty: { amount: 0, token: CRYPTOS.questgold },
  showFull: false,
};

export default class QuestListFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...defaultFilter,
      createdQuests: false,
      playedQuests: false,
      foundedQuests: false,
    };
    this.tagRef = React.createRef();
  }

  setFilter(filter, shouldDebounce = false) {
    const callback = () => this.props.onFilterChange(this.state);
    this.setState({ ...filter }, shouldDebounce ? debounce(callback, 500) : callback);
  }

  render() {
    return (
      <BoxStyled heading="Filters">
        <Spacer16>
          <Field label="Search">
            <SearchInput
              id="filterSearch"
              value={this.state.search}
              onChange={(x) => this.setFilter({ search: x }, true)}
              placeholder="keyword"
              wide
            />
          </Field>
        </Spacer16>
        <Spacer16>
          <Field label="filterStatus">
            <DropDown
              items={questStatusOptions}
              selected={Object.keys(QUEST_STATUS).indexOf(this.state.status)}
              onChange={(i) => this.setFilter({ status: Object.keys(QUEST_STATUS)[i] })}
              placeholder="All"
              wide
            />
          </Field>
        </Spacer16>
        <Spacer16>
          <Field label="Expiration">
            <DateRangePicker
              startDate={this.state.expiration.start}
              endDate={this.state.expiration.end}
              onChange={(val) => this.setFilter({ expiration: val })}
            />
          </Field>
        </Spacer16>
        <Spacer16>
          <AmountFieldInput
            id="filterBounty"
            label="Min bounty"
            value={this.state.bounty}
            onChange={(x) => this.setFilter({ bounty: x }, true)}
            wide
          />
        </Spacer16>
        <Spacer16>
          <TagFieldInput
            id="filterTags"
            label="Tags"
            placeholder="Search"
            value={this.state.tags}
            onChange={(x) => this.setFilter({ tags: x })}
          />
          <Button
            icon={<IconClose />}
            label="clear"
            wide
            onClick={() => this.setFilter(defaultFilter)}
          />
          <Separator />
          <Field label="Created quests">
            <Switch
              checked={this.state.createdQuests}
              onChange={(x) => this.setFilter({ createdQuests: x })}
            />
          </Field>
          <Field label="Played quests">
            <Switch
              checked={this.state.playedQuests}
              onChange={(x) => this.setFilter({ playedQuests: x })}
            />
          </Field>
          <Field label="Founded quests">
            <Switch
              checked={this.state.foundedQuests}
              onChange={(x) => this.setFilter({ foundedQuests: x })}
            />
          </Field>
          <CreateQuestModal onClose={() => this.props.onFilterChange(this.state)} />
        </Spacer16>
      </BoxStyled>
    );
  }
}

QuestListFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};
