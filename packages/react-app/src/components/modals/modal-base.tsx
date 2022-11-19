import { Modal, textStyle, Button } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import React, { useEffect, useMemo } from 'react';
import { ENUM_TRANSACTION_STATUS } from 'src/constants';
import { useTransactionContext } from 'src/contexts/transaction.context';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import { ChildSpacer, Outset } from '../utils/spacer-util';
import { TransactionProgressComponent } from '../utils/transaction-progress-component';

const ModalFooterStyled = styled.div`
  width: 100%;
  text-align: right;
  padding: ${GUpx(1)};
`;

const TitleStyled = styled.div`
  ${textStyle('title3')}
`;

const ModalStyled = styled(Modal)`
  padding: ${GUpx(1)};
  z-index: 1;
`;

type Props = {
  id: string;
  children?: React.ReactNode;
  title?: React.ReactNode | string;
  openButton: React.ReactNode;
  buttons?: React.ReactNode;
  onClose?: (_success: boolean) => void;
  isOpen: boolean;
  css?: React.CSSProperties;
  size?: 'small' | 'normal' | 'large';
};

export default function ModalBase({
  id,
  children,
  title,
  openButton,
  buttons,
  onClose = noop,
  isOpen = false,
  size = 'normal',
  css,
}: Props) {
  const openButtonId = `open-${id}`;
  const { transaction, setTransaction } = useTransactionContext();

  const txFailed = useMemo(
    () => transaction?.status === ENUM_TRANSACTION_STATUS.Failed,
    [transaction?.status],
  );

  const width = useMemo(() => {
    switch (size) {
      case 'small':
        return 600;
      case 'large':
        return 1500;
      default:
        return 900;
    }
  }, [size]);

  useEffect(() => {
    if (isOpen) {
      // STO to put this instruction in the bottom of the call stack to let the dom mount correctly
      setTimeout(() => {
        (document.getElementById(id) as HTMLElement)?.focus();
      }, 0);

      document.addEventListener('keydown', escFunction, false);
    } else {
      document.removeEventListener('keydown', escFunction, false);
    }

    return () => document.removeEventListener('keydown', escFunction, false);
  }, [isOpen]);

  useEffect(() => {
    if (
      (transaction?.status === ENUM_TRANSACTION_STATUS.Confirmed || txFailed) &&
      transaction?.modalId === id &&
      !isOpen
    ) {
      setTransaction(undefined);
    }
  }, [transaction?.status, txFailed, isOpen]);

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
      onClose(
        transaction?.modalId === id && transaction?.status === ENUM_TRANSACTION_STATUS.Confirmed,
      );
      if (
        (transaction?.modalId === id &&
          transaction?.status === ENUM_TRANSACTION_STATUS.Confirmed) ||
        txFailed
      ) {
        setTimeout(() => {
          setTransaction(undefined);
        }, 1000);
      }
    }
  };

  const onBackButtonClick = () => {
    setTransaction(undefined);
  };

  return (
    <>
      <div id={openButtonId}>{openButton}</div>
      <ModalStyled
        visible={isOpen}
        onClose={(e: any) => handleOnClose(e)}
        width={(viewport: VisualViewport) => Math.min(viewport.width - 16, width)}
        style={css}
        id={id}
        tabIndex="-1"
      >
        <Outset gu8>
          <TitleStyled>{title}</TitleStyled>
        </Outset>
        {transaction && transaction?.modalId === id ? <TransactionProgressComponent /> : children}
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
    </>
  );
}

export type ModalCallback = (_success: boolean) => void;
