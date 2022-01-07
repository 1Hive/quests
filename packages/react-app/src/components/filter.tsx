import { Button, DateRangePicker, Field, IconClose, SearchInput, Switch } from '@1hive/1hive-ui';
import { useFilterContext } from 'src/contexts/filter.context';
import { DEFAULT_FILTER } from '../constants';

export function Filter() {
  const { filter, setFilter } = useFilterContext()!;
  return (
    <>
      <Field label="Address">
        <SearchInput
          id="filterAddress"
          value={filter.address}
          onChange={(x: string) => setFilter({ ...filter, address: x })}
          wide
        />
      </Field>
      <Field label="Title">
        <SearchInput
          id="filterTitle"
          value={filter.title}
          onChange={(x: string) => setFilter({ ...filter, title: x })}
          wide
        />
      </Field>
      <Field label="Description">
        <SearchInput
          id="filterDescription"
          value={filter.description}
          onChange={(x: string) => setFilter({ ...filter, description: x })}
          wide
        />
      </Field>
      <Field label="Expire time">
        <DateRangePicker
          startDate={filter.expire?.start}
          endDate={filter.expire?.end}
          onChange={(val: any) => setFilter({ ...filter, expire: val })}
        />
      </Field>
      <Field label="Show expired">
        <Switch
          checked={filter.showExpired}
          onChange={(val: any) => setFilter({ ...filter, showExpired: val })}
        />
      </Field>
      {
        // TODO : We don't have this information available in subgraph
        /* <AmountFieldInput
          id="filterBounty"
          label="Min available bounty"
          value={filter.bounty}
          onChange={(x: any) => setFilter({ ...filter, bounty: x }, true)}
          wide
        /> */
      }

      {/* <TagFieldInput
            id="filterTags"
            label="Tags"
            isEdit
            placeholder="Search"
            value={filter.tags}
            onChange={(x: string[]) => setFilter({ ...filter, tags: x })}
          /> TODO : Restore after MVP */}
      <Button icon={<IconClose />} label="clear" wide onClick={() => setFilter(DEFAULT_FILTER)} />
    </>
  );
}
