/* eslint-disable react/no-array-index-key */
import React, { ReactNode } from 'react';
import styled from 'styled-components';

const ChildWrapperStyled = styled.div`
  display: ${({ vertical }: any) => (vertical ? 'block' : 'inline-block')};
`;

type Props = {
  children?: React.ReactNode;
  css?: React.CSSProperties;
  className?: string;
  inline?: boolean;
  horizontal?: boolean;
  vertical?: boolean;
  gu4?: boolean;
  gu8?: boolean;
  gu16?: boolean;
  gu24?: boolean;
  gu32?: boolean;
  gu40?: boolean;
  gu48?: boolean;
  gu56?: boolean;
  gu64?: boolean;
};

type InsetProps = Props;
type OutsetProps = Props;

export function Outset({
  children,
  css,
  className = '',
  inline = false,
  horizontal = true,
  vertical = true,
  gu4 = false,
  gu8 = true,
  gu16 = false,
  gu24 = false,
  gu32 = false,
  gu40 = false,
  gu48 = false,
  gu56 = false,
  gu64 = false,
}: OutsetProps) {
  if (inline) css = { ...css, display: 'inline' };
  let classes = className;
  if (vertical && horizontal) {
    if (gu4) classes += ' p-4';
    else if (gu16) classes += ' p-16';
    else if (gu24) classes += ' p-24';
    else if (gu32) classes += ' p-32';
    else if (gu40) classes += ' p-40';
    else if (gu48) classes += ' p-48';
    else if (gu56) classes += ' p-56';
    else if (gu64) classes += ' p-64';
    else if (gu8) classes += ' p-8';
  } else if (vertical) {
    if (gu4) classes += ' pt-4 pb-4';
    else if (gu16) classes += ' pt-16 pb-16';
    else if (gu24) classes += ' pt-24 pb-24';
    else if (gu32) classes += ' pt-32 pb-32';
    else if (gu40) classes += ' pt-40 pb-40';
    else if (gu48) classes += ' pt-48 pb-48';
    else if (gu56) classes += ' pt-56 pb-56';
    else if (gu64) classes += ' pt-64 pb-64';
    else if (gu8) classes += ' pt-8 pb-8';
  } else if (horizontal) {
    if (gu4) classes += ' pl-4 pr-4';
    else if (gu16) classes += ' pl-16 pr-16';
    else if (gu24) classes += ' pl-24 pr-24';
    else if (gu32) classes += ' pl-32 pr-32';
    else if (gu40) classes += ' pl-40 pr-40';
    else if (gu48) classes += ' pl-48 pr-48';
    else if (gu56) classes += ' pl-56 pr-56';
    else if (gu64) classes += ' pl-64 pr-64';
    else if (gu8) classes += ' pl-8 pr-8';
  }
  return (
    <div className={classes} style={css}>
      {children}
    </div>
  );
}
export function Inset({
  children,
  css,
  className = '',
  inline = false,
  horizontal = true,
  vertical = true,
  gu4 = false,
  gu8 = true,
  gu16 = false,
  gu24 = false,
  gu32 = false,
  gu40 = false,
  gu48 = false,
  gu56 = false,
  gu64 = false,
}: InsetProps) {
  if (inline) css = { ...css, display: 'inline' };
  let classes = className;
  if (vertical && horizontal) {
    if (gu4) classes += ' m-4';
    else if (gu16) classes += ' m-16';
    else if (gu24) classes += ' m-24';
    else if (gu32) classes += ' m-32';
    else if (gu40) classes += ' m-40';
    else if (gu48) classes += ' m-48';
    else if (gu56) classes += ' m-56';
    else if (gu64) classes += ' m-64';
    else if (gu8) classes += ' m-8';
  } else if (vertical) {
    if (gu4) classes += ' mt-4 mb-4';
    else if (gu16) classes += ' mt-16 mb-16';
    else if (gu24) classes += ' mt-24 mb-24';
    else if (gu32) classes += ' mt-32 mb-32';
    else if (gu40) classes += ' mt-40 mb-40';
    else if (gu48) classes += ' mt-48 mb-48';
    else if (gu56) classes += ' mt-56 mb-56';
    else if (gu64) classes += ' mt-64 mb-64';
    else if (gu8) classes += ' mt-8 mb-8';
  } else if (horizontal) {
    if (gu4) classes += ' ml-4 mr-4';
    else if (gu16) classes += ' ml-16 mr-16';
    else if (gu24) classes += ' ml-24 mr-24';
    else if (gu32) classes += ' ml-32 mr-32';
    else if (gu40) classes += ' ml-40 mr-40';
    else if (gu48) classes += ' ml-48 mr-48';
    else if (gu56) classes += ' ml-56 mr-56';
    else if (gu64) classes += ' ml-64 mr-64';
    else if (gu8) classes += ' ml-8 mr-8';
  }
  return (
    <div className={classes} style={css}>
      {children}
    </div>
  );
}

type ChildSpacerProps = {
  children?: ReactNode;
  size?: 4 | 8 | 16 | 24 | 32 | 40 | 48 | 56 | 64 | 72;
  vertical?: boolean;
};

export function ChildSpacer({ children, size = 8, vertical = false }: ChildSpacerProps) {
  const childList = children as any;

  return (
    <>
      {React.Children.map(children, (child, i) => {
        let className = '';
        if (i !== 0) className = `p${vertical ? 't' : 'l'}-${size}`;
        if (i !== childList.length - 1) className += ` p${vertical ? 'b' : 'r'}-${size}`;
        return (
          <ChildWrapperStyled vertical={vertical} className={className} key={`child-${i}`}>
            {child}
          </ChildWrapperStyled>
        );
      })}
    </>
  );
}
