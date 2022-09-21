import { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import QuestDetail from './components/views/quest-detail';
import QuestList from './components/views/quest-list';
import { ENUM_PAGES } from './constants';

export default function Routes() {
  useEffect(() => {
    function onLoad() {
      if (window.location.href.includes('/#/detail')) {
        window.location.replace(window.location.href.replace('/#/detail', '/detail'));
      }
    }
    window.addEventListener('load', onLoad);
    return () => {
      window.removeEventListener('load', onLoad);
    };
  }, []);
  return (
    <>
      <Switch>
        <Redirect exact from={`/${ENUM_PAGES.List}`} to="/home" />
        <Route path="/home" component={QuestList} />
        <Route path={`/${ENUM_PAGES.Detail}`} component={QuestDetail} />
        <Route path="/" component={QuestList} />
        <Redirect to="/home" />
      </Switch>
    </>
  );
}
