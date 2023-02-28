import MarkdownToolbarElement, * as MarkdownTools from '@github/markdown-toolbar-element';

export default function MarkdownToolbar() {
  return (
    <>
      <MarkdownToolbarElement>
        <md-bold>bold</md-bold>
        <md-header>header</md-header>
        <md-italic>italic</md-italic>
        <md-quote>quote</md-quote>
        <md-code>code</md-code>
        <md-link>link</md-link>
        <md-image>image</md-image>
        <md-unordered-list>unordered-list</md-unordered-list>
        <md-ordered-list>ordered-list</md-ordered-list>
        <md-task-list>task-list</md-task-list>
        <md-mention>mention</md-mention>
        <md-ref>ref</md-ref>
        <button data-md-button>Custom button</button>
      </MarkdownToolbarElement>
      <textarea id="textarea_id" />
    </>
  );
}
