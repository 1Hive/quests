import { DropDown } from '@1hive/1hive-ui';

type Props = {
  filters: {
    host: {
      filter: number;
      items: any[];
      onChange: Function;
    };
  };
};

function Filters({ filters }: Props) {
  return (
    <div>
      <DropDown
        items={filters.host.items}
        selected={filters.host.filter}
        onChange={filters.host.onChange}
      />
    </div>
  );
}

export default Filters;
