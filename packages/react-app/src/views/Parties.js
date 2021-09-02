import { GU, LoadingRing, useTheme } from '@1hive/1hive-ui';
import React from 'react';
import PartyCard from '../components/shared/PartyCard';
import TopBar from '../components/shared/TopBar';
import useFilteredParties from '../hooks/useFilteredParties';

function Parties() {
  const { theme } = useTheme();
  const { filteredParties, filters, loading } = useFilteredParties();

  return (
    <div
      css={`
        margin-top: ${4 * GU}px;
      `}
    >
      <TopBar filters={filters} />

      {loading ? (
        <LoadingRing />
      ) : (
        <>
          {filteredParties.length > 0 ? (
            <div
              css={`
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                column-gap: ${2 * GU}px;
                row-gap: ${2 * GU}px;
              `}
            >
              {filteredParties.map((party, index) => (
                <PartyCard key={index} party={party} />
              ))}
            </div>
          ) : (
            <div
              css={`
                width: 100%;
                background: ${theme.background};
              `}
            >
              No parties :(
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Parties;
