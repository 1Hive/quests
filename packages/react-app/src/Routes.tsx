import { Redirect, Route, Switch } from 'react-router-dom';
import DetailedView from './components/shared/detailed-view';
import QuestList from './components/shared/quest-list';

export default function Routes() {
  return (
    <Switch>
      <Redirect exact from="/" to="/home" />
      <Route path="/home" component={QuestList} />
      <Route path="/detail" component={DetailedView} />
    </Switch>
  );
}
