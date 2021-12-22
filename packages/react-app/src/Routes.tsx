import { Redirect, Route, Switch } from 'react-router-dom';
import DetailedView from './components/shared/detailed-view';
import QuestList from './components/shared/quest-list';
import { PAGES } from './constants';

export default function Routes() {
  return (
    <Switch>
      <Redirect exact from="/" to="/home" />
      <Redirect exact from={`/${PAGES.List}`} to="/home" />
      <Route path="/home" component={QuestList} />
      <Route path={`/${PAGES.Detail}`} component={DetailedView} />
    </Switch>
  );
}
