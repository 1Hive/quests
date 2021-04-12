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
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { QUEST_STATUS, TOKENS } from '../../../constants';
import { debounce } from '../../../utils/class-util';
import CreateQuestModal from '../../Modals/QuestModal';
import AmountFieldInput from '../../Shared/FieldInput/AmountFieldInput';
import TagFieldInput from '../../Shared/FieldInput/TagFieldInput';
import { Outset } from '../../Shared/Utils/spacer-util';
import Separator from '../../Shared/Utils/Separator';

// #region StyledComponent

const BoxStyled = styled(Box)`
  width: 100%;
  min-width: fit-content;
  margin-bottom: ${2 * GU}px;
`;

// #endregion

const questStatusOptions = Object.values(QUEST_STATUS).map((x) => x.label);

const defaultFilter = {
  search: '',
  status: null,
  expiration: { start: null, end: null },
  tags: [],
  bounty: { amount: 0, token: TOKENS.questgold },
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
      <Outset gu16>
        <BoxStyled heading="Filters">
          <Outset gu8>
            <Field label="Search">
              <SearchInput
                id="filterSearch"
                value={this.state.search}
                onChange={(x) => this.setFilter({ search: x }, true)}
                placeholder="keyword"
                wide
              />
            </Field>
            <Field label="filterStatus">
              <DropDown
                items={questStatusOptions}
                selected={Object.keys(QUEST_STATUS).indexOf(this.state.status)}
                onChange={(i) => this.setFilter({ status: Object.keys(QUEST_STATUS)[i] })}
                placeholder="All"
                wide
              />
            </Field>
            <Field label="Expiration">
              <DateRangePicker
                startDate={this.state.expiration.start}
                endDate={this.state.expiration.end}
                onChange={(val) => this.setFilter({ expiration: val })}
              />
            </Field>
            <AmountFieldInput
              id="filterBounty"
              label="Min bounty"
              value={this.state.bounty}
              onChange={(x) => this.setFilter({ bounty: x }, true)}
              wide
            />
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
            <CreateQuestModal create />
          </Outset>
        </BoxStyled>
      </Outset>
    );
  }
}

QuestListFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};
