import { AddressField, Help, Button, IconFlag, Box, Field } from '@1hive/1hive-ui';
import { useEffect, useState } from 'react';
import { ClaimModel } from 'src/models/claim.model';
import { QuestModel } from 'src/models/quest.model';
import { fetchQuestClaims, challengeQuestClaim } from 'src/services/quest.service';
import styled from 'styled-components';
import AmountFieldInput from './field-input/amount-field-input';
import Separator from './utils/separator';
import { Outset } from './utils/spacer-util';
// #region StyledComponents

const WrapperStyled = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const RowStyled = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

// #endregion

type Props = {
  quest: QuestModel;
};

export default function ClaimList({ quest }: Props) {
  const [claims, setClaims] = useState<ClaimModel[]>();

  useEffect(() => {
    const fetchClaims = async () => {
      const result = await fetchQuestClaims(quest);
      setClaims(result);
    };

    fetchClaims();
  }, []);

  const challengeQuest = (claim: ClaimModel) => {
    challengeQuestClaim(claim);
  };

  return (
    <WrapperStyled>
      <Outset>
        <Box>
          {claims &&
            claims.map((x: ClaimModel) => (
              <RowStyled>
                <Field label="Claiming player">
                  <AddressField address={x.playerAddress} autofocus={false} />
                </Field>
                <Field label="Evidence">
                  <Help x="Open evidence">{x.evidence}</Help>
                </Field>
                <AmountFieldInput
                  id="amount"
                  isEdit={false}
                  label="Claiming amount"
                  value={x.claimAmount}
                />
                <Button onClick={() => challengeQuest(x)} mode="negative">
                  Challenge
                </Button>
              </RowStyled>
            ))}
        </Box>
      </Outset>
    </WrapperStyled>
  );
}
