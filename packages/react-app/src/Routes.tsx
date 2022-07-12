import { Redirect, Route, Switch } from 'react-router-dom';
import QuestDetail from './components/views/quest-detail';
import QuestList from './components/views/quest-list';
import { ENUM_PAGES } from './constants';

export default function Routes() {
  return (
    <>
      <Switch>
        <Redirect exact from={`/${ENUM_PAGES.List}`} to="/home" />
        <Route path="/home" component={QuestList} />
        <Route path={`/${ENUM_PAGES.Detail}`} component={QuestDetail} />
        <Redirect to="/home" />
      </Switch>
    </>
  );
}
