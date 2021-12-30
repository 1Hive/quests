import { AddressField, Field, Accordion, GU } from '@1hive/1hive-ui';
import { useEffect, useState } from 'react';
import { ClaimModel } from 'src/models/claim.model';
import { QuestModel } from 'src/models/quest.model';
import { useWallet } from 'src/providers/wallet.context';
import { fetchQuestClaims } from 'src/services/quest.service';
import styled from 'styled-components';
import { DEAULT_CLAIM_EXECUTION_DELAY } from 'src/constants';
import { ONE_DAY_IN_MS } from 'src/utils/date.utils';
import { roundDecimals } from 'src/utils/math.utils';
import ChallengeModal from '../modals/challenge-modal';
import AmountFieldInput from './field-input/amount-field-input';
import TextFieldInput from './field-input/text-field-input';
import { Outset } from './utils/spacer-util';
import Help from './field-input/help-icon';
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
  margin: ${GU}px;
`;
const ClaimStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 8%;
`;
const HeaderStyled = styled.h1`
  font-size: large;
  margin-left: 8px;
`;

// #endregion

type Props = {
  quest: QuestModel;
};

export default function ClaimList({ quest }: Props) {
  const [claims, setClaims] = useState<ClaimModel[]>();
  const wallet = useWallet();

  useEffect(() => {
    const fetchClaims = async () => {
      const result = await fetchQuestClaims(quest);

      setClaims(result);
    };

    fetchClaims();
  }, []);

  return (
    <WrapperStyled>
      <Outset>
        {!!claims?.length && (
          <>
            <ClaimStyled>
              <HeaderStyled>Claims </HeaderStyled>
              <Help
                tooltip="Claims"
                tooltipDetail={`A claim includes the proof of the quest's completion. This claim can be challenged within ${roundDecimals(
                  DEAULT_CLAIM_EXECUTION_DELAY / ONE_DAY_IN_MS,
                  0,
                )} days.`}
              />
            </ClaimStyled>

            <Accordion
              items={claims.map((x: ClaimModel) => [
                <RowStyled>
                  <Field label="Claiming player">
                    <AddressField address={x.playerAddress} autofocus={false} />
                  </Field>
                  <AmountFieldInput
                    id="amount"
                    isEdit={false}
                    label="Claiming amount"
                    value={x.claimAmount}
                  />
                  {wallet?.account && <ChallengeModal claim={x} />}
                </RowStyled>,
                <Outset gu8>
                  <TextFieldInput
                    id="evidence"
                    value={x.evidence}
                    isMarkDown
                    wide
                    label="Evidence of completion"
                  />
                </Outset>,
              ])}
            />
          </>
        )}
      </Outset>
    </WrapperStyled>
  );
}
