import React from "react";
import { GU, Link, useTheme, useViewport } from "@1hive/1hive-ui";
import AccountModule from "../Account/AccountModule";
import Layout from "../Layout";
import { useWallet } from "../../providers/Wallet";

function Header() {
  const theme = useTheme();
  const { below } = useViewport();
  const layoutSmall = below("medium");

  const { account } = useWallet();

  return (
    <header
      css={`
        position: relative;
        z-index: 3;
        background: #fff;
        box-shadow: rgba(0, 0, 0, 0.05) 0 2px 3px;
      `}
    >
      <Layout paddingBottom={0}>
        <div
          css={`
            height: ${8 * GU}px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
            `}
          >
            <Link
              href="#/home"
              external={false}
              css={`
                text-decoration: none;
                color: ${theme.accent};
              `}
            >
              <div className="flex-center">
                <img src="logo.png" alt=""></img>
                <span
                  css={`
                    display: inline-flex;
                    align-items: center;
                  `}
                >
                  Honey Quest
                </span>
              </div>
            </Link>
            {!below("large") && (
              <nav
                css={`
                  display: flex;
                  align-items: center;
                  height: 100%;
                  margin-left: ${6.5 * GU}px;
                `}
              >
                <Link
                  href="#/home"
                  external={false}
                  css={`
                    text-decoration: none;
                    color: ${theme.contentSecondary};
                    margin-right: ${3 * GU}px;
                  `}
                >
                  Home
                </Link>
                {account && (
                  <Link
                    href="#/your-quests"
                    external={false}
                    css={`
                      text-decoration: none;
                      color: ${theme.contentSecondary};
                      margin-right: ${3 * GU}px;
                    `}
                  >
                    Your quests
                  </Link>
                )}
                <Link
                  href="https://app.honeyswap.org/#/swap?inputCurrency=0x71850b7e9ee3f13ab46d67167341e4bdc905eef9"
                  external={true}
                  css={`
                    text-decoration: none;
                    color: ${theme.contentSecondary};
                    margin-right: ${3 * GU}px;
                  `}
                >
                  Get Honey
                </Link>
                <Link
                  href="https://github.com/felixbbertrand/honeyquests/wiki"
                  external={true}
                  css={`
                    text-decoration: none;
                    color: ${theme.contentSecondary};
                    margin-right: ${3 * GU}px;
                  `}
                >
                  FAQ
                </Link>
              </nav>
            )}
          </div>

          <div
            css={`
              display: flex;
              align-items: center;
            `}
          >
            <AccountModule compact={layoutSmall} />
          </div>
        </div>
      </Layout>
    </header>
  );
}

export default Header;
