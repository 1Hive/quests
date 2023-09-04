import { Modal, textStyle, Button, useViewport } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import React, { useEffect, useMemo, useState } from 'react';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import { ChildSpacer, Outset } from '../utils/spacer-util';
import { TransactionProgress } from '../utils/transaction-progress';

// #region StyledComponents
const ModalFooterStyled = styled.div`
  width: 100%;
  text-align: right;
  padding: ${GUpx(1)};
`;

const TitleStyled = styled.div`
  ${textStyle('title3')}
`;

const ModalStyled = styled(Modal)<{ width: string }>`
  padding: ${GUpx(1)};
  z-index: 2;

  & > div > div > div {
    width: ${({ cssWidth }) => cssWidth} !important;
  }
`;

const TopRightCornerStyled = styled.div`
  position: fixed;
  bottom: 16px;
  left: 16px;
  z-index: 999;
`;

// #endregion

type Props = {
  id: string;
  children?: React.ReactNode;
  title?: React.ReactNode | string;
  openButton: React.ReactNode;
  buttons?: React.ReactNode;
  onModalClosed?: (_success: boolean) => void;
  isOpened: boolean;
  css?: React.CSSProperties;
  size?: 'small' | 'normal' | 'large';
};

export default function ModalBase({
  id,
  children,
  title,
  openButton,
  buttons,
  onModalClosed = noop,
  isOpened = false,
  size = 'normal',
  css,
}: Props) {
  const openButtonId = `open-${id}`;
  const { transaction, setTransaction } = useTransactionContext();
  const [isOpenedState, setIsOpenedState] = useState(isOpened);

  useEffect(() => {
    setIsOpenedState(isOpened);
  }, [isOpened]);

  const txFailed = useMemo(
    () => transaction?.status === TransactionStatus.Failed,
    [transaction?.status],
  );

  const width = useMemo(() => {
    switch (size) {
      case 'small':
        return '25vw';
      case 'large':
        return '75vw';
      default:
        return '50vw';
    }
  }, [size]);

  useEffect(() => {
    if (isOpenedState) {
      // STO to put this instruction in the bottom of the call stack to let the dom mount correctly
      setTimeout(() => {
        (document.getElementById(id) as HTMLElement)?.focus();
      }, 0);

      document.addEventListener('keydown', escFunction, false);
    } else {
      document.removeEventListener('keydown', escFunction, false);
    }

    return () => document.removeEventListener('keydown', escFunction, false);
  }, [isOpenedState]);

  useEffect(() => {
    if (
      !isOpenedState &&
      transaction?.status === TransactionStatus.Confirmed &&
      transaction?.modalId === id
    ) {
      setTransaction(undefined);
    }
  }, [transaction?.status, isOpenedState]);

  const escFunction = (e: any) => {
    const modalDom = document.getElementById(id) as HTMLElement;
    if (
      e.key === 'Escape' &&
      (e.target.parentElement.id === openButtonId ||
        e.target === modalDom ||
        modalDom.contains(e.target))
    ) {
      handleOnClose(e);
    }
  };

  const handleOnClose = (e: any) => {
    if (e) {
      setIsOpenedState(false); // Useless but better to be explicit
      onModalClosed(
        transaction?.modalId === id &&
          (transaction?.status === TransactionStatus.Confirmed || txFailed),
      );
      if (
        transaction?.modalId === id &&
        (transaction?.status === TransactionStatus.Confirmed || txFailed)
      ) {
        setTransaction(undefined);
      }
    }
  };

  const onBackButtonClick = () => {
    setTransaction(undefined);
  };

  return (
    <>
      <div id={openButtonId}>{openButton}</div>
      {isOpenedState && (
        <ModalStyled
          width={width}
          visible
          onClose={(e: any) => handleOnClose(e)}
          style={css}
          id={id}
          tabIndex="-1"
        >
          <Outset gu8>
            <TitleStyled>{title}</TitleStyled>
          </Outset>
          {transaction && transaction?.modalId === id ? <TransactionProgress /> : children}
          {(buttons || txFailed) && (
            <ModalFooterStyled>
              <ChildSpacer justify="start" align="center" buttonEnd={!txFailed}>
                {transaction && transaction?.modalId === id
                  ? txFailed && <Button onClick={onBackButtonClick}>Back</Button>
                  : buttons}
              </ChildSpacer>
            </ModalFooterStyled>
          )}
        </ModalStyled>
      )}
      {transaction && !isOpenedState && transaction?.modalId === id && (
        <TopRightCornerStyled title={transaction.message}>
          <TransactionProgress isReduced onClick={() => setIsOpenedState(true)} />
        </TopRightCornerStyled>
      )}
    </>
  );
}

export type ModalCallback = (_success: boolean) => void;
