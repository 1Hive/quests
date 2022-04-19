import 'styled-components';

export interface ThemeInterface {
  readonly _name: string;
  _appearance: 'dark' | 'light';

  // -- BASE COLORS --
  /**
   * The base layer on which apps are being rendered.
   */
  readonly background: string;
  /**
   * The border color used everywhere by default, except in specific cases like controlBorder.
   */
  readonly border: string;
  /**
   * The color used for overlays. Some components using an overlay color are SidePanel or Modal.
   */
  readonly overlay: string;
  /**
   * The base color for text and outline content. To be used over background.
   */
  readonly content: string;
  /**
   * Secondary color for text and outline content. To be used over background.
   */
  readonly contentSecondary: string;
  /**
   * Used as a base color for links.
   */
  readonly link: string;
  /**
   * The color for focus rings.
   */
  readonly focus: string;
  /**
   * The accent color can be used to put an emphasis on a component or a certain part of a component, without any specific semantic.
   */
  readonly accent: string;
  /**
   * This is the gradient equivalent of accent.
   */
  readonly accentStart: string;
  readonly accentEnd: string;
  /**
   * To be used for text and outline content over accent.
   */
  readonly accentContent: string;
  /**
   * The backgorund color for help buttons.
   */
  readonly help: string;

  // -- SURFACES --
  /**
   * The background color used for surfaces.
   */
  readonly surface: string;
  /**
   * The primary color used for text and outline content over surface.
   */
  readonly surfaceContent: string;
  /**
   * Background color for default button.
   */
  readonly surfaceInteractive: string;
  /**
   * The secondary color used for text and outline content over surface.
   */
  readonly surfaceContentSecondary: string;
  /**
   * This color is generally used for icons over surface. Note: in some cases, icons over surface are also using surfaceContent or surfaceContentSecondary.
   */
  readonly surfaceIcon: string;
  /**
   * This is used as a background base for surfaces that appear to be at a lower level than the parent surface itself. For instance, the DataView component is using this color for its entry expansion, which opens underneath the primary surface provided by DataView.
   */
  readonly surfaceUnder: string;
  /**
   * Communicates that a surface is being “opened”, generally revealing a surface using surfaceUnder underneath. The DataView component is using this color for the side border of its entry expansion.
   */
  readonly surfaceOpened: string;
  /**
   * Indicates that a surface, or a part of it, is being selected. This is the color DataView is using to indicate that an entire row is selected.
   */
  readonly surfaceSelected: string;
  /**
   * Indicates that a surface, or a part of it, is being highlighted. This color could be used to reflect a hover or focused state.
   */
  readonly surfaceHighlight: string;
  /**
   * Indicates that a surface, or a part of it, is being pressed − either by a pointer or a touch event.
   */
  readonly surfacePressed: string;

  // -- POSITIVE --
  /**
   * Use this color to communicate positive information (e.g. success, an action to vote yes).
   */
  readonly positive: string;
  /**
   * To be used for text and outline content over positive.
   */
  readonly positiveContent: string;
  /**
   * A softer positive, to be used when a large amount of information needs to be communicated.
   */
  readonly positiveSurface: string;
  /**
   * To be used for text and outline content over positiveSurface.
   */
  readonly positiveSurfaceContent: string;

  // -- NEGATIVES --
  /**
   * Use this color to communicate negative information (e.g. error, an action to vote no).
   */
  readonly negative: string;
  /**
   * To be used for text and outline content over negative.
   */
  readonly negativeContent: string;
  /**
   * A softer negative, to be used when a large amount of information needs to be communicated. For instance, the Info component uses it as a background color in error mode.
   */
  readonly negativeSurface: string;
  /**
   * To be used for text and outline content over negativeSurfaceContent.
   */
  readonly negativeSurfaceContent: string;

  // -- CONTROLS --
  /**
   * Used for hints (or placeholders) inside of text input or similar components.
   */
  readonly hint: string;
  /**
   * Indicates a selection in the broad sense.
   */
  readonly selected: string;
  /**
   * To be used for text and outline content over selected.
   */
  readonly selectedContent: string;
  /**
   * Indicates a selection in the broad sense, when disabled (non-interactive).
   */
  readonly selectedDisabled: string;
  /**
   * The background color of disabled components like Button.
   */
  readonly disabled: string;
  /**
   * The text or outline content to be used over disabled.
   */
  readonly disabledContent: string;
  /**
   * This color is generally used for icons over disabled. Note: icons over disabled could also be using disabledContent.
   */
  readonly disabledIcon: string;
  /**
   * Used as a background color for some control components like Checkbox, Radio or Switch.
   */
  readonly control: string;
  /**
   * Used as a border color for some control components like Checkbox, Radio or Switch.
   */
  readonly controlBorder: string;
  /**
   * Used as a border color for the pressed state of some control components like Checkbox, Radio or Switch.
   */
  readonly controlBorderPressed: string;
  /**
   * The background color for the disabled state of some control components like Checkbox, Radio or Switch.
   */
  readonly controlDisabled: string;
  /**
   * This is used as a surface color for elements of control components that appear at an upper level. For instance, the Switch component is using this color for its handle.
   */
  readonly controlSurface: string;
  /**
   * This is used as a background base for elements of control components that appear to be at a lower level. For instance, the Switch component is using this color for its inner base.
   */
  readonly controlUnder: string;

  // -- Tag --
  /**
   *  Used to identify or label a subject.
   */
  readonly tagIdentifier: string;
  /**
   * To be used for text and outline content over tagIdentifier.
   */
  readonly tagIdentifierContent: string;
  /**
   * Used to indicate that a subject is new, or updated.
   */
  readonly tagNew: string;
  /**
   * To be used for text and outline content over tagNew.
   */
  readonly tagNewContent: string;
  /**
   * Used for indicators in the general sense.
   */
  readonly tagIndicator: string;
  /**
   * To be used for text and outline content over tagIndicator.
   */
  readonly tagIndicatorContent: string;
  /**
   * Used to represent some activity that happened, like a number of notifications.
   */
  readonly tagActivity: string;
  /**
   * To be used for text and outline content over tagActivity
   */
  readonly tagActivityContent: string;

  // -- BADGES --
  readonly badge: string;
  readonly badgeContent: string;

  // -- INFO --
  /**
   * This info color is generally stronger than infoSurface. It should be used for icons, borders, etc.
   */
  readonly info: string;
  /**
   * The surface info color, generally softer than info. It should be used for background colors.
   */
  readonly infoSurface: string;
  /**
   * To be used for text and outline content over infoSurface.
   */
  readonly infoSurfaceContent: string;
  // -- WARNING --
  /**
   * This warning color is generally stronger than warningSurface. It should be used for icons, borders, etc.
   */
  readonly warning: string;
  /**
   * The surface warning color, generally softer than warning. It should be used for background colors.
   */
  readonly warningSurface: string;
  /**
   * To be used for text and outline content over warningSurface.
   */
  readonly warningSurfaceContent: string;
}
