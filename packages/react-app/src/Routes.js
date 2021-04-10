import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import QuestList from './components/Pages/QuestList/QuestList';

export default function Routes() {
  return (
    <Switch>
      <Redirect exact from="/" to="/home" />
      <Route path="/home" component={QuestList} />
    </Switch>
  );
}
