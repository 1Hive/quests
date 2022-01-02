import { AddressField, Field, Accordion } from '@1hive/1hive-ui';
import { ClaimModel } from 'src/models/claim.model';
import { useWallet } from 'src/contexts/wallet.context';
import styled from 'styled-components';
import { GUpx } from 'src/utils/css.util';
import { DEAULT_CLAIM_EXECUTION_DELAY_MS } from 'src/constants';
import { roundNumber } from 'src/utils/math.utils';
import { ONE_DAY_IN_MS } from 'src/utils/date.utils';
import { TokenAmountModel } from 'src/models/token-amount.model';
import ChallengeModal from '../modals/challenge-modal';
import AmountFieldInput from './field-input/amount-field-input';
import TextFieldInput from './field-input/text-field-input';
import { Outset } from './utils/spacer-util';
import { IconTooltip } from './field-input/icon-tooltip';

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
  justify-content: space-around;
  align-items: center;
  margin: ${GUpx()};
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
  margin-left: ${GUpx()};
`;

// #endregion

type Props = {
  claims: ClaimModel[];
  challengeDeposit: TokenAmountModel;
  questTotalBounty?: TokenAmountModel | null;
};

export default function ClaimList({ claims, challengeDeposit, questTotalBounty }: Props) {
  const wallet = useWallet();
  return (
    <WrapperStyled>
      <Outset>
        {!!claims?.length && (
          <>
            <ClaimStyled>
              <HeaderStyled>Claims </HeaderStyled>
              <IconTooltip
                tooltip="Claims"
                tooltipDetail={`A claim includes the proof of the quest's completion. This claim can be challenged within ${roundNumber(
                  DEAULT_CLAIM_EXECUTION_DELAY_MS / ONE_DAY_IN_MS,
                  0,
                )} days.`}
              />
            </ClaimStyled>

            <Accordion
              items={claims.map((x: ClaimModel) => [
                <RowStyled>
                  <Field label={wallet?.account === x.playerAddress ? 'You' : 'Claiming player'}>
                    <AddressField address={x.playerAddress} autofocus={false} />
                  </Field>
                  <AmountFieldInput
                    id="amount"
                    isEdit={false}
                    label="Claimed amount"
                    isLoading={!x.claimedAmount.parsedAmount && questTotalBounty === undefined}
                    value={
                      x.claimedAmount.parsedAmount || !questTotalBounty
                        ? x.claimedAmount
                        : questTotalBounty
                    }
                  />
                  {wallet?.account && (
                    <ChallengeModal claim={x} challengeDeposit={challengeDeposit} />
                  )}
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
