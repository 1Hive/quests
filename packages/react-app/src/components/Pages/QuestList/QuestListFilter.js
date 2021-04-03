import React from 'react';
import {
  Box,
  Button,
  DateRangePicker,
  DropDown,
  Field,
  IconClose,
  SearchInput,
  Tag,
  TextInput,
  TokenBadge,
  _AutoComplete as AutoComplete,
} from '@1hive/1hive-ui';
import { CRYPTOS, QUEST_STATUS } from '../../../constants';

import { debounce } from '../../../utils/class-util';

const currencyOptions = Object.values(CRYPTOS).map((c) => c.symb);
const questStatusOptions = Object.values(QUEST_STATUS).map((x) => x.label);
const tagSuggestion = ['FrontEnd', 'Angular', 'React', 'CoolStuff'];
const defaultFilter = {
  search: '',
  status: null,
  expiration: { start: null, end: null },
  tags: [],
  minBounty: 0,
  bountyCurrency: currencyOptions[0],
  showFull: false,
};

export default class QuestListFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultFilter;
    this.tagRef = React.createRef();
  }

  onTagDelete(i) {
    const tags = this.state.tags.slice(0);
    tags.splice(i, 1);
    this.setFilter({ tags });
  }

  onTagAddition(tag) {
    if (!this.state.tags.includes(tag)) {
      const tags = this.state.tags.concat(tag);
      this.setFilter({ tags });
    }
    this.tagRef.current.value = '';
  }

  setFilter(filter, shouldDebounce) {
    const callback = () => this.props.onFilterChange(this.state);
    this.setState({ ...filter }, shouldDebounce ? debounce(callback, 500) : callback);
  }

  render() {
    return (
      <Box heading="Filters" className="fit-content mb-16">
        <div className="m-16">
          <Field label="Search">
            <SearchInput
              value={this.state.search}
              onChange={(x) => this.setFilter({ search: x }, true)}
              wide
            />
          </Field>
        </div>
        <div className="m-16">
          <Field label="Status">
            <DropDown
              items={questStatusOptions}
              selected={Object.keys(QUEST_STATUS).indexOf(this.state.status)}
              onChange={(i) => this.setFilter({ status: Object.keys(QUEST_STATUS)[i] })}
              placeholder="All"
              wide
            />
          </Field>
        </div>
        <div className="m-16">
          <Field label="Expiration">
            <DateRangePicker
              startDate={this.state.expiration.start}
              endDate={this.state.expiration.end}
              onChange={(val) => this.setFilter({ expiration: val })}
              wide
            />
          </Field>
        </div>
        <div className="m-16">
          <Field label="Min bounty">
            <div className="inline-flex" css={{ height: 40 }}>
              <TextInput
                value={this.state.minBounty}
                onChange={(event) => {
                  this.setFilter({ minBounty: event.target.value }, true);
                }}
                type="number"
              />
              <TokenBadge
                symbol={CRYPTOS.honey.symb}
                address={CRYPTOS.honey.address}
                networkType="private"
                size="normal"
              />
              {/* <DropDown
                items={currencyOptions}
                selected={currencyOptions.indexOf(this.state.bountyCurrency)}
                onChange={(x) =>
                  this.setFilter({ bountyCurrency: currencyOptions[x] })
                }
              ></DropDown> */}
            </div>
          </Field>
        </div>
        <div className="m-16">
          <Field label="Tags">
            <AutoComplete
              items={tagSuggestion.filter(
                (name) =>
                  this.state.searchTags &&
                  name.toLowerCase().indexOf(this.state.searchTags.toLowerCase()) > -1,
              )}
              onChange={(val) => this.setState({ searchTags: val })}
              onSelect={this.onTagAddition}
              ref={this.tagRef}
              wide
            />
            {this.state.tags.map((x, i) => (
              <Tag
                key={x}
                label={x}
                icon={<IconClose />}
                onClick={() => this.onTagDelete(i)}
                className="pointer"
              />
            ))}
          </Field>
          <Button
            icon={<IconClose />}
            label="clear"
            wide
            onClick={() => this.setFilter(defaultFilter)}
          />
        </div>
      </Box>
    );
  }
}
