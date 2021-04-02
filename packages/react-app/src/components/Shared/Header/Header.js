import PropTypes from "prop-types";
import React from "react";
import { Button, GU, Link, useTheme, useViewport } from "@1hive/1hive-ui";
import { FaMoon, FaSun } from "react-icons/fa";
import AccountModule from "../Account/AccountModule";
import Layout from "../Layout";
import { useWallet } from "../../../providers/Wallet";
import logo from "./assets/logo.png";

Header.propTypes = {
  toggleTheme: PropTypes.func,
};

function Header({ toggleTheme }) {
  const theme = useTheme();
  const { below } = useViewport();
  const layoutSmall = below("medium");
  const { account } = useWallet();

  return (
    <header
      css={`
        position: relative;
        z-index: 3;
        background: ${theme.surface};
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
                color: ${theme.accent};
              `}
            >
              <div className="flex-center">
                <img src={logo} alt="" />
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
                    color: ${theme.contentSecondary};
                    margin-right: ${3 * GU}px;
                  `}
                >
                  Home
                </Link>
                {account && (
                  <Link
                    href="#/create-quest"
                    external={false}
                    css={`
                      color: ${theme.contentSecondary};
                      margin-right: ${3 * GU}px;
                    `}
                  >
                    Create quest
                  </Link>
                )}
                <Link
                  href="https://app.honeyswap.org/#/swap?inputCurrency=0x71850b7e9ee3f13ab46d67167341e4bdc905eef9"
                  external
                  css={`
                    color: ${theme.contentSecondary};
                    margin-right: ${3 * GU}px;
                  `}
                >
                  Get Honey
                </Link>
                <Link
                  href="https://github.com/felixbbertrand/honeyquests/wiki"
                  external
                  css={`
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
            <Button
              icon={theme._appearance === "dark" ? <FaSun /> : <FaMoon />}
              onClick={toggleTheme}
            />
          </div>
        </div>
      </Layout>
    </header>
  );
}

export default Header;
