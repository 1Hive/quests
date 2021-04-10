import React from 'react';
import { append } from '../../../utils/class-util';

export function Spacer4({ children, css = undefined, className = '', inline = false }) {
  if (inline) css = { ...css, display: 'inline' };
  return (
    <div className={append('m-4', className)} style={css}>
      {children}
    </div>
  );
}
export function Spacer8({ children, css = undefined, className = '', inline = false }) {
  if (inline) css = { ...css, display: 'inline' };
  return (
    <div className={append('m-8', className)} style={css}>
      {children}
    </div>
  );
}
export function Spacer16({ children, css = undefined, className = '', inline = false }) {
  if (inline) css = { ...css, display: 'inline' };
  return (
    <div className={append('m-16', className)} style={css}>
      {children}
    </div>
  );
}
export function Spacer32({ children, css = undefined, className = '', inline = false }) {
  if (inline) css = { ...css, display: 'inline' };
  return (
    <div className={append('m-32', className)} style={css}>
      {children}
    </div>
  );
}
export function Spacer4H({ children, css = undefined, className = '', inline = false }) {
  if (inline) css = { ...css, display: 'inline' };
  return (
    <div className={append('ml-4', 'mr-4', className)} style={css}>
      {children}
    </div>
  );
}
export function Spacer8H({ children, css = undefined, className = '', inline = false }) {
  if (inline) css = { ...css, display: 'inline' };
  return (
    <div className={append('ml-8', 'mr-8', className)} style={css}>
      {children}
    </div>
  );
}
export function Spacer16H({ children, css = undefined, className = '', inline = false }) {
  if (inline) css = { ...css, display: 'inline' };
  return (
    <div className={append('ml-16', 'mr-16', className)} style={css}>
      {children}
    </div>
  );
}
export function Spacer32H({ children, css = undefined, className = '', inline = false }) {
  if (inline) css = { ...css, display: 'inline' };
  return (
    <div className={append('ml-32', 'mr-32', className)} style={css}>
      {children}
    </div>
  );
}
export function Spacer4V({ children, css = undefined, className = '', inline = false }) {
  if (inline) css = { ...css, display: 'inline' };
  return (
    <div className={append('mt-4', 'mb-4', className)} style={css}>
      {children}
    </div>
  );
}
export function Spacer8V({ children, css = undefined, className = '', inline = false }) {
  if (inline) css = { ...css, display: 'inline' };
  return (
    <div className={append('mt-8', 'mb-8', className)} style={css}>
      {children}
    </div>
  );
}
export function Spacer16V({ children, css = undefined, className = '', inline = false }) {
  if (inline) css = { ...css, display: 'inline' };
  return (
    <div className={append('mt-16', 'mb-16', className)} style={css}>
      {children}
    </div>
  );
}
export function Spacer32V({ children, css = undefined, className = '', inline = false }) {
  if (inline) css = { ...css, display: 'inline' };
  return (
    <div className={append('mt-32', 'mb-32', className)} style={css}>
      {children}
    </div>
  );
}
