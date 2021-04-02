import {
  AddressField,
  Card,
  Field,
  Split,
  Tag,
  TokenBadge,
} from "@1hive/1hive-ui";
import React from "react";
import Skeleton from "react-loading-skeleton";
import { CRYPTOS, QUEST_STATUS } from "../../../constants";

export class Quest extends React.Component {
  constructor(props) {
    super(props);
    if (props.create) {
      this.state = {
        status: QUEST_STATUS.draft,
      };
    } else {
      this.state = {
        isLoading: props.isLoading,
        status: props.status,
        address: props.address,
        title: props.title,
        description: props.description,
        players: props.players,
        maxPlayers: props.maxPlayers,
        bounty: props.bounty,
        colAmount: props.colAmount,
        tags: props.tags,
      };
    }
  }

  render() {
    return (
      <Card width="100%" height="100%" className="mb-32">
        <Split
          primary={
            <div className="m-16">
              <div className="block mt-16">
                <Split
                  primary={
                    this.state.isLoading ? <Skeleton /> : this.state.title
                  }
                  secondary={
                    this.state.isLoading ? (
                      <Skeleton />
                    ) : (
                      <AddressField
                        address={this.state.address}
                        autofocus={false}
                      />
                    )
                  }
                />
              </div>
              <div className="block mt-16">
                {this.state.isLoading ? (
                  <Skeleton count={5} />
                ) : (
                  this.state.description
                )}
              </div>
            </div>
          }
          secondary={
            <div className="m-16">
              <Field label="Status">
                {this.state.isLoading ? (
                  <Skeleton />
                ) : (
                  <span>{this.state.status.label}</span>
                )}
              </Field>
              <Field label="Number of player">
                {this.state.isLoading ? (
                  <Skeleton />
                ) : (
                  <span>
                    {this.state.players} /{this.state.maxPlayers}
                  </span>
                )}
              </Field>
              <Field label="Bounty">
                d
                {this.state.isLoading ? (
                  <Skeleton />
                ) : (
                  <>
                    <span className="m-8">{this.state.bounty}</span>
                    <TokenBadge
                      symbol="HNY"
                      address="0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9"
                      networkType="xdai"
                    />
                  </>
                )}
              </Field>
              <Field label="Collateral amount">
                {this.state.isLoading ? (
                  <Skeleton />
                ) : (
                  <>
                    <span className="m-8">{this.state.colAmount}</span>
                    <TokenBadge
                      symbol="HNY"
                      address="0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9"
                      networkType="xdai"
                    />
                  </>
                )}
              </Field>
              <Field label="Tags">
                {this.state.isLoading ? (
                  <Skeleton />
                ) : (
                  <>
                    {this.state.tags.map((tag) => (
                      <a key={tag}>
                        <Tag>{tag}</Tag>
                      </a>
                    ))}
                  </>
                )}
              </Field>
            </div>
          }
        />
      </Card>
    );
  }
}
