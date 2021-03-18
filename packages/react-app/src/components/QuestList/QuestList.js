import React from "react";

import { CRYPTOS, QUEST_STATUS } from "../../constants";
import {
  AddressField,
  Box,
  Button,
  Card,
  DataView,
  DateRangePicker,
  DropDown,
  Field,
  IconSquarePlus,
  IdentityBadge,
  SearchInput,
  Split,
  Tag,
  TextInput,
} from "@1hive/1hive-ui";

const currencyOptions = CRYPTOS.map((c) => c.symb);
const questStatusOptions = ["All"].concat(QUEST_STATUS.map((x) => x.name));

export default class QuestList extends React.Component {
  loadMoreButtonRef;
  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
    filter: {
      search: "",
      status: "All",
      expiration: { start: null, end: null },
      tags: ["CoolStuff"],
      minBounty: 0,
      bountyCurrency: currencyOptions[0],
      showFull: false,
    },
  };
  componentDidMount() {
    this.getData((res) => {
      this.setState({
        initLoading: false,
        data: res.results,
        list: res.results,
      });
    });

    this.loadMoreButtonRef = React.createRef();
  }
  getData = (callback) => {
    setTimeout(() => {
      callback({
        results: [
          {
            address: "0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9",
            title: "Beat the poggers",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.",
            players: 5,
            maxPlayers: 10,
            bounty: 0,
            colAmount: 0,
            tags: ["FrontEnd", "Angular", "JS", "CoolStuf"],
          },
          {
            address: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6",
            title: "Rescue me",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.",
            players: 0,
            maxPlayers: 1,
            bounty: 500,
            colAmount: 25,
            tags: ["Backend", "Oracle", "SQL", "CoolStuf"],
          },
          {
            address: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d",
            title: "Foldondord",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.",
            players: 0,
            maxPlayers: 2,
            bounty: 230,
            colAmount: 0,
            tags: ["React", "CoolStuf"],
          },
        ],
      });
    }, 1000);
  };
  onLoadMore = () => {
    this.setState({
      loading: true,
      list: this.state.data.concat(
        [...new Array(3)].map(() => ({ loading: true, tags: [] }))
      ),
    });
    this.getData((res) => {
      const data = this.state.data.concat(res.results);
      this.setState(
        {
          data,
          list: data,
          loading: false,
        },
        () => {
          this.loadMoreButtonRef.scrollIntoView({ behavior: "smooth" });
        }
      );
    }, 1000);
  };

  setFilter(filter) {
    console.log(filter);
    this.setState({ filter: { ...this.state.filter, ...filter } });
  }

  render() {
    return (
      <Split
        invert="vertical"
        primary={
          <>
            {this.state.data.map(
              ({
                address,
                title,
                description,
                players,
                maxPlayers,
                bounty,
                colAmount,
                tags,
              }) => {
                return (
                  <Card width="1000px" className="mb-32">
                    <Split
                      primary={
                        <div className="m-16">
                          <AddressField address={address} />
                          <div className="block mt-16">{description}</div>
                        </div>
                      }
                      secondary={
                        <>
                          <Field>
                            Number of player : ${players}/${maxPlayers}
                          </Field>
                          <Field>Bounty : ${bounty} HNY</Field>
                          <Field>Collateral amount : ${colAmount} HNY</Field>
                          <Field>
                            Tags :
                            {tags.map((tag) => (
                              <a key={tag}>
                                <Tag>{tag}</Tag>
                              </a>
                            ))}
                          </Field>
                        </>
                      }
                    />
                  </Card>
                );
              }
            )}
            <Button
              ref={(el) => {
                this.loadMoreButtonRef = el;
              }}
              className="m-16"
              size="large"
              icon={<IconSquarePlus></IconSquarePlus>}
              onClick={this.onLoadMore}
            />
          </>
        }
        secondary={
          <Box heading="Filters" className="fit-content">
            <div className="m-16">
              <Field label="Search">
                <SearchInput
                  value={this.state.filter.search}
                  onChange={(val) => this.setFilter({ search: val })}
                />
              </Field>
            </div>
            <div className="m-16">
              <Field label="Status">
                <DropDown
                  items={questStatusOptions}
                  selected={questStatusOptions.indexOf(
                    this.state.filter.status
                  )}
                  onChange={(x) =>
                    this.setFilter({ status: questStatusOptions[x] })
                  }
                />
              </Field>
            </div>
            <div className="m-16">
              <Field label="Expiration">
                <DateRangePicker
                  startDate={this.state.filter.expiration.start}
                  endDate={this.state.filter.expiration.end}
                  onChange={(val) => this.setFilter({ expiration: val })}
                />
              </Field>
            </div>
            <div className="m-16">
              <Field label="Min bounty">
                <TextInput
                  value={this.state.filter.minBounty}
                  onChange={(event) => {
                    this.setFilter({ minBounty: event.target.value });
                  }}
                  type="number"
                />
                <DropDown
                  items={currencyOptions}
                  selected={currencyOptions.indexOf(
                    this.state.filter.bountyCurrency
                  )}
                  onChange={(x) =>
                    this.setFilter({ bountyCurrency: currencyOptions[x] })
                  }
                ></DropDown>
              </Field>
            </div>
          </Box>
        }
      />
    );
  }
}
