import { AddressField, Field, Accordion } from '@1hive/1hive-ui';
import { ClaimModel } from 'src/models/claim.model';
import { useWallet } from 'src/contexts/wallet.context';
import styled from 'styled-components';
import { GUpx } from 'src/utils/css.util';
import ChallengeModal from '../modals/challenge-modal';
import AmountFieldInput from './field-input/amount-field-input';
import TextFieldInput from './field-input/text-field-input';
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
  justify-content: space-around;
  align-items: center;
  margin: ${GUpx()};
`;

// #endregion

type Props = {
  claims: ClaimModel[];
};

export default function ClaimList({ claims }: Props) {
  const wallet = useWallet();

  return (
    <WrapperStyled>
      <Outset>
        {!!claims?.length && (
          <Accordion
            items={claims.map((x: ClaimModel) => [
              <RowStyled>
                <Field label={wallet?.account === x.playerAddress ? 'You' : 'Claiming player'}>
                  <AddressField address={x.playerAddress} autofocus={false} />
                </Field>
                <AmountFieldInput
                  id="amount"
                  isEdit={false}
                  label="Claiming amount"
                  value={x.claimedAmount}
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
        )}
      </Outset>
    </WrapperStyled>
  );
}
