import { GU, Modal, ScrollView, textStyle } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { ChildSpacer, Outset } from '../shared/utils/spacer-util';

const ModalFooterStyled = styled.div`
  width: 100%;
  text-align: right;
  padding: ${1 * GU}px;
`;

const TitleStyled = styled.div`
  ${textStyle('title3')}
`;

const ModalStyled = styled(Modal)`
  padding: ${GU}px;
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
};

export default function ModalBase({
  children,
  title,
  openButton,
  buttons,
  onClose = noop,
  isOpen = false,
  css,
}: Props) {
  const escFunction = useCallback((e: any) => {
    if (
      e.key === 'Escape' &&
      (e.target.tagName.toUpperCase() === 'BODY' || e.target.type?.toLowerCase() === 'button')
    ) {
      onClose();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);
    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        document.getElementById('modalContainer')?.focus();
      }, 100);
    }
  }, [isOpen]);

  return (
    <>
      {openButton}
      <ModalStyled
        visible={isOpen}
        onClose={(e: any) => e && onClose()}
        width={(viewport: VisualViewport) => Math.min(viewport.width - 48, 1200)}
        style={css}
      >
        <Outset gu8>
          <TitleStyled>{title}</TitleStyled>
        </Outset>
        <ScrollViewStyled vertical>{children}</ScrollViewStyled>
        {buttons && (
          <ModalFooterStyled>
            <ChildSpacer>{buttons}</ChildSpacer>
          </ModalFooterStyled>
        )}
      </ModalStyled>
    </>
  );
}
