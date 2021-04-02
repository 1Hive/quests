import moment from "moment";
import { QUEST_STATUS } from "../constants";

export function getMoreQuests(currentIndex, count, filter) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const result = {
        data: [
          {
            status: QUEST_STATUS.active,
            address: "0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9",
            title: "Beat the poggers",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.",
            players: 5,
            maxPlayers: 10,
            bounty: 0,
            colAmount: 0,
            tags: ["FrontEnd", "Angular", "JS", "CoolStuf"],
            expiration: "06/24/2021",
          },
          {
            status: QUEST_STATUS.active,
            address: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6",
            title: "Rescue me",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.",
            players: 0,
            maxPlayers: 1,
            bounty: 500,
            colAmount: 25,
            tags: ["Backend", "Oracle", "SQL", "CoolStuf"],
            expiration: "06/24/2021",
          },
          {
            status: QUEST_STATUS.draft,
            address: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d",
            title: "Foldondord",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus purus, faucibus et pretium nec, lacinia ultrices urna. Phasellus vitae consequat augue. Suspendisse in est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam fringilla ullamcorper massa, luctus condimentum est tempus sit amet. Curabitur turpis lacus, varius vel justo sed, ultricies ornare purus. Aliquam lacinia enim sed nisi pharetra egestas. Donec dapibus semper nisi.",
            players: 0,
            maxPlayers: 2,
            bounty: 230,
            colAmount: 0,
            tags: ["React", "CoolStuf"],
            expiration: "06/24/2021",
          },
        ].filter((x) => {
          // Status
          if (filter.status && x.status.id !== filter.status) {
            return false;
          }
          // Tags
          if (
            filter.tags?.length &&
            !x.tags.filter((x) => filter.tags.includes(x)).length
          ) {
            return false;
          }
          // Search
          if (
            filter.search &&
            !x.title.includes(filter.search) &&
            !x.description.includes(filter.search) &&
            !x.address.includes(filter.search)
          ) {
            return false;
          }
          // MinBounty
          if (filter.minBounty && x.bounty < filter.minBounty) return false;
          if (
            (filter.expiration?.startDate &&
              moment(x.expiration).isBefore(filter.expiration.startDate)) ||
            (filter.expiration?.endDate &&
              moment(x.expiration).isAfter(filter.expiration.endDate))
          ) {
            return false;
          }

          return true;
        }),
      };
      result.hasMore = result.data.length === count && currentIndex < 9;
      resolve(result);
    }, 1000);
  });
}
