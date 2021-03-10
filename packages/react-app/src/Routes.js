import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

export default function Routes() {
  return (
    <Switch>
      <Redirect exact from="/" to="/home" />
    </Switch>
  );
}
