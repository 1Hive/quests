import React from "react";
import { GU, Root, ScrollView, useViewport } from "@1hive/1hive-ui";

import Header from "./Header/Header";
import Layout from "./Layout";

function MainView({ children }) {
  const { below } = useViewport();
  const compactMode = below("large");

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        height: 100vh;
      `}
    >
      <div
        css={`
          flex-shrink: 0;
        `}
      >
        <Header />
      </div>
      <Root.Provider>
        <div
          id="scroll-view"
          css={{
            overflow: "auto",
            height: "calc(100vh - 64px)",
            padding: 3 * GU,
          }}
        >
          <Layout paddingBottom={3 * GU}>{children}</Layout>
        </div>
      </Root.Provider>
    </div>
  );
}

export default MainView;
