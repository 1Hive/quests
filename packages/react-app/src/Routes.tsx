import { Redirect, Route, Switch } from 'react-router-dom';
import QuestList from './components/shared/quest-list';
import FilterContextProvider from './providers/filter-context';

export default function Routes() {
  return (
    <Switch>
      <Redirect exact from="/" to="/home" />
      <FilterContextProvider>
        <Route path="/home" component={QuestList} />
      </FilterContextProvider>
    </Switch>
  );
}
