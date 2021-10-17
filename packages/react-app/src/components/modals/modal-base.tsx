import { GU, Modal, ScrollView, textStyle } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import React from 'react';
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
  padding: ${3 * GU}px;
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
  return (
    <>
      {openButton}
      <ModalStyled
        visible={isOpen}
        onClose={onClose}
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
