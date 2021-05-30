import { GU, Modal, ScrollView, textStyle } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { ChildSpacer, Outset } from '../Shared/Utils/spacer-util';

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

export default function ModalBase({
  children = undefined,
  title = undefined,
  openButton,
  buttons = undefined,
  onClose = noop,
  isOpen = false,
  css = undefined,
}) {
  return (
    <>
      {openButton}
      <ModalStyled
        visible={isOpen}
        onClose={onClose}
        width={(viewport) => Math.min(viewport.width - 48, 1200)}
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

ModalBase.propTypes = {
  children: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  openButton: PropTypes.node.isRequired,
  buttons: PropTypes.node,
  onClose: PropTypes.func,
};
