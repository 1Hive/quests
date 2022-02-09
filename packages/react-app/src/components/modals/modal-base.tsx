import { Modal, ScrollView, textStyle } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import React, { useEffect } from 'react';
import { GUpx } from 'src/utils/css.util';
import styled from 'styled-components';
import { ChildSpacer, Outset } from '../utils/spacer-util';

const ModalFooterStyled = styled.div`
  width: 100%;
  text-align: right;
  padding: ${GUpx()};
`;

const TitleStyled = styled.div`
  ${textStyle('title3')}
`;

const ModalStyled = styled(Modal)`
  padding: ${GUpx()};
`;

const ScrollViewStyled = styled(ScrollView)`
  overflow: auto;
  max-height: calc(60vh) !important;
`;

type Props = {
  id: string;
  children?: React.ReactNode;
  title?: React.ReactNode | string;
  openButton: React.ReactNode;
  buttons?: React.ReactNode;
  onClose?: Function;
  isOpen: boolean;
  css?: React.CSSProperties;
  size?: 'small' | 'normal';
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

  useEffect(() => {
    if (isOpen) {
      // STO to put this instruction in the bottom of the call stack to let the dom mount correctly
      setTimeout(() => {
        (document.getElementById(id) as HTMLElement)?.focus();
      }, 0);

      document.addEventListener('keydown', escFunction, false);
    } else document.removeEventListener('keydown', escFunction, false);

    return () => document.removeEventListener('keydown', escFunction, false);
  }, [isOpen]);

  const escFunction = (e: any) => {
    const modalDom = document.getElementById(id) as HTMLElement;
    if (
      e.key === 'Escape' &&
      (e.target.parentElement.id === openButtonId ||
        e.target === modalDom ||
        modalDom.contains(e.target))
    ) {
      onClose();
    }
  };

  return (
    <>
      <div id={openButtonId}>{openButton}</div>
      <ModalStyled
        visible={isOpen}
        onClose={(e: any) => e && onClose()}
        width={(viewport: VisualViewport) =>
          Math.min(viewport.width - 16, size === 'small' ? 500 : 1200)
        }
        style={css}
        id={id}
        tabindex="-1"
      >
        <Outset gu8>
          <TitleStyled>{title}</TitleStyled>
        </Outset>
        <ScrollViewStyled vertical>{children}</ScrollViewStyled>
        {buttons && (
          <ModalFooterStyled>
            <ChildSpacer justify="start" align="center" buttonEnd>
              {buttons}
            </ChildSpacer>
          </ModalFooterStyled>
        )}
      </ModalStyled>
    </>
  );
}

export type ModalCallback = (_success: boolean) => void;
