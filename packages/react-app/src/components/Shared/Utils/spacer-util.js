import PropTypes from 'prop-types';
import React from 'react';
import { BREAKPOINTS } from '../../../constants';

export function Outset({
  children = undefined,
  css = undefined,
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
}) {
  if (inline) css = { ...css, display: 'inline' };
  let classes = className;
  if (vertical && horizontal) {
    if (gu4) classes += ' p-4';
    if (gu8) classes += ' p-8';
    if (gu16) classes += ' p-16';
    if (gu24) classes += ' p-24';
    if (gu32) classes += ' p-32';
    if (gu40) classes += ' p-40';
    if (gu48) classes += ' p-48';
    if (gu56) classes += ' p-56';
    if (gu64) classes += ' p-64';
  } else if (vertical) {
    if (gu4) classes += ' pt-4 pb-4';
    if (gu8) classes += ' pt-8 pb-8';
    if (gu16) classes += ' pt-16 pb-16';
    if (gu24) classes += ' pt-24 pb-24';
    if (gu32) classes += ' pt-32 pb-32';
    if (gu40) classes += ' pt-40 pb-40';
    if (gu48) classes += ' pt-48 pb-48';
    if (gu56) classes += ' pt-56 pb-56';
    if (gu64) classes += ' pt-64 pb-64';
  } else if (horizontal) {
    if (gu4) classes += ' pl-4 pr-4';
    if (gu8) classes += ' pl-8 pr-8';
    if (gu16) classes += ' pl-16 pr-16';
    if (gu24) classes += ' pl-24 pr-24';
    if (gu32) classes += ' pl-32 pr-32';
    if (gu40) classes += ' pl-40 pr-40';
    if (gu48) classes += ' pl-48 pr-48';
    if (gu56) classes += ' pl-56 pr-56';
    if (gu64) classes += ' pl-64 pr-64';
  }
  return (
    <div className={classes} style={css}>
      {children}
    </div>
  );
}
export function Inset({
  children = undefined,
  css = undefined,
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
}) {
  if (inline) css = { ...css, display: 'inline' };
  let classes = className;
  if (vertical && horizontal) {
    if (gu4) classes += ' m-4';
    if (gu8) classes += ' m-8';
    if (gu16) classes += ' m-16';
    if (gu24) classes += ' m-24';
    if (gu32) classes += ' m-32';
    if (gu40) classes += ' m-40';
    if (gu48) classes += ' m-48';
    if (gu56) classes += ' m-56';
    if (gu64) classes += ' m-64';
  } else if (vertical) {
    if (gu4) classes += ' mt-4 mb-4';
    if (gu8) classes += ' mt-8 mb-8';
    if (gu16) classes += ' mt-16 mb-16';
    if (gu24) classes += ' mt-24 mb-24';
    if (gu32) classes += ' mt-32 mb-32';
    if (gu40) classes += ' mt-40 mb-40';
    if (gu48) classes += ' mt-48 mb-48';
    if (gu56) classes += ' mt-56 mb-56';
    if (gu64) classes += ' mt-64 mb-64';
  } else if (horizontal) {
    if (gu4) classes += ' ml-4 mr-4';
    if (gu8) classes += ' ml-8 mr-8';
    if (gu16) classes += ' ml-16 mr-16';
    if (gu24) classes += ' ml-24 mr-24';
    if (gu32) classes += ' ml-32 mr-32';
    if (gu40) classes += ' ml-40 mr-40';
    if (gu48) classes += ' ml-48 mr-48';
    if (gu56) classes += ' ml-56 mr-56';
    if (gu64) classes += ' ml-64 mr-64';
  }
  return (
    <div className={classes} style={css}>
      {children}
    </div>
  );
}

export function ChildSpacer({ children, size = 8, vertical = false }) {
  return React.Children.map(children, (child) => {
    let className = `p${vertical ? 't' : 'l'}-${size}`;
    className += ` p${vertical ? 'b' : 'r'}-${size}`;
    return (
      <div
        style={vertical ? { display: 'block' } : { display: 'inline-block' }}
        className={className}
      >
        {child}
      </div>
    );
  });
}

ChildSpacer.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(Object.values(BREAKPOINTS)),
  vertical: PropTypes.bool,
};
