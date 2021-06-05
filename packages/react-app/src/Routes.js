import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import QuestList from './components/Pages/QuestList';
import FilterContextProvider from './providers/FilterContext';

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
