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
  children?: React.ReactNode;
  title?: React.ReactNode | string;
  openButton: React.ReactNode;
  buttons?: React.ReactNode;
  onClose?: Function;
  isOpen: boolean;
  css?: React.CSSProperties;
  width?: number;
};

export default function ModalBase({
  children,
  title,
  openButton,
  buttons,
  onClose = noop,
  isOpen = false,
  width,
  css,
}: Props) {
  const escFunction = (e: any) => {
    if (
      e.key === 'Escape' &&
      (e.target.tagName.toUpperCase() === 'BODY' || e.target.type?.toLowerCase() === 'button')
    ) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', escFunction, false);
    } else document.removeEventListener('keydown', escFunction, false);

    return () => document.removeEventListener('keydown', escFunction, false);
  }, [isOpen]);

  return (
    <>
      {openButton}
      <ModalStyled
        visible={isOpen}
        onClose={(e: any) => e && onClose()}
        width={(viewport: VisualViewport) => width ?? Math.min(viewport.width - 48, 1200)}
        style={css}
      >
        <Outset gu8>
          <TitleStyled>{title}</TitleStyled>
        </Outset>
        <ScrollViewStyled vertical>{children}</ScrollViewStyled>
        {buttons && (
          <ModalFooterStyled>
            <ChildSpacer justify="end" align="middle">
              {buttons}
            </ChildSpacer>
          </ModalFooterStyled>
        )}
      </ModalStyled>
    </>
  );
}

// eslint-disable-next-line no-unused-vars
export type ModalCallback = (success: boolean) => void;
