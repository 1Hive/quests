import PropTypes from 'prop-types';
import { AddressField, Card, Field, Split, Tag, textStyle, TokenBadge } from '@1hive/1hive-ui';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import { QUEST_STATUS } from '../../../constants';

// #region StyledComponents

const QuestTitleStyled = styled.div`
  ${textStyle('title3')}
`;

const QuestTagStyled = styled(Tag)`
  cursor: pointer;
`;

// #endregion

export class Quest extends React.Component {
  constructor(props) {
    super(props);
    if (props.create) {
      this.props.status = QUEST_STATUS.draft;
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
                    this.props.isLoading ? (
                      <Skeleton />
                    ) : (
                      <QuestTitleStyled>{this.props.title}</QuestTitleStyled>
                    )
                  }
                  secondary={
                    this.props.isLoading ? (
                      <Skeleton />
                    ) : (
                      <AddressField address={this.props.address} autofocus={false} />
                    )
                  }
                />
              </div>
              <div className="block mt-16">
                {this.props.isLoading ? <Skeleton count={5} /> : this.props.description}
              </div>
            </div>
          }
          secondary={
            <div className="m-16">
              <Field label="Status">
                {this.props.isLoading ? <Skeleton /> : <span>{this.props.status.label}</span>}
              </Field>
              <Field label="Number of player">
                {this.props.isLoading ? (
                  <Skeleton />
                ) : (
                  <span>
                    {this.props.players} /{this.props.maxPlayers}
                  </span>
                )}
              </Field>
              <Field label="Bounty">
                {this.props.isLoading ? (
                  <Skeleton />
                ) : (
                  <>
                    <span className="m-8">{this.props.bounty}</span>
                    <TokenBadge
                      symbol="HNY"
                      address="0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9"
                      networkType="private"
                    />
                  </>
                )}
              </Field>
              <Field label="Collateral amount">
                {this.props.isLoading ? (
                  <Skeleton />
                ) : (
                  <>
                    <span className="m-8">{this.props.colAmount}</span>
                    <TokenBadge
                      symbol="HNY"
                      address="0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9"
                      networkType="private"
                    />
                  </>
                )}
              </Field>
              <Field label="Tags">
                {this.props.isLoading ? (
                  <Skeleton />
                ) : (
                  this.props.tags.map((tag) => <QuestTagStyled key={tag}>{tag}</QuestTagStyled>)
                )}
              </Field>
            </div>
          }
        />
      </Card>
    );
  }
}

Quest.propTypes = {
  address: PropTypes.string,
  bounty: PropTypes.number,
  colAmount: PropTypes.number,
  create: PropTypes.bool,
  description: PropTypes.string,
  isLoading: PropTypes.bool,
  maxPlayers: PropTypes.number,
  players: PropTypes.number,
  status: PropTypes.shape({
    label: PropTypes.string,
  }),
  tags: PropTypes.array,
  title: PropTypes.string,
};
