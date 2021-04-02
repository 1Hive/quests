import React from "react";
import { Quest } from "../../Shared/Quest/Quest";

export default class CreateQuest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <Quest create />;
  }
}
