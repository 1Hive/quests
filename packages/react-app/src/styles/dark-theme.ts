import { commonTheme } from './common-theme';

export const customDarkTheme = {
  ...commonTheme,
  _name: 'customDark',
  _appearance: 'dark',

  // -- BASE COLORS --
  // The base layer on which apps are being rendered.
  background: '#242424',
  // The border color used everywhere by default, except in specific cases like controlBorder.
  border: '#5c5c52',
  // The color used for overlays. Some components using an overlay color are SidePanel or Modal.
  overlay: '#fbfbe9',
  // The base color for text and outline content. To be used over background.
  content: '#f7f7ce',
  // Secondary color for text and outline content. To be used over background.
  contentSecondary: '#8d8d79',
  // Used as a base color for links.
  link: '#ffffff',
  // The color for focus rings.
  focus: '#ffffff',
  // The accent color can be used to put an emphasis on a component or a certain part of a component, without any specific semantic.
  accent: '#f7f7ce',
  // This is the gradient equivalent of accent.
  accentStart: '#f7f7ce',
  accentEnd: '#f7f7ce',
  // To be used for text and outline content over accent.
  accentContent: '#242424',
  // The backgorund color for help buttons.
  help: '#f7f7ce',

  // -- SURFACES --
  // The background color used for surfaces.
  surface: '#242424',
  // The primary color used for text and outline content over surface.
  surfaceContent: '#f7f7ce',
  // Background color for default button.
  surfaceInteractive: '#242424',
  // The secondary color used for text and outline content over surface.
  surfaceContentSecondary: '#d7d7b4',
  // This color is generally used for icons over surface. Note: in some cases, icons over surface are also using surfaceContent or surfaceContentSecondary.
  surfaceIcon: '#eaeac3',
  // This is used as a background base for surfaces that appear to be at a lower level than the parent surface itself. For instance, the DataView component is using this color for its entry expansion, which opens underneath the primary surface provided by DataView.
  surfaceUnder: '#2e2e2e',
  // Communicates that a surface is being “opened”, generally revealing a surface using surfaceUnder underneath. The DataView component is using this color for the side border of its entry expansion.
  surfaceOpened: '#242424',
  // Indicates that a surface, or a part of it, is being selected. This is the color DataView is using to indicate that an entire row is selected.
  surfaceSelected: '#242424',
  // Indicates that a surface, or a part of it, is being highlighted. This color could be used to reflect a hover or focused state.
  surfaceHighlight: '#f5f9cf',
  // Indicates that a surface, or a part of it, is being pressed − either by a pointer or a touch event.
  surfacePressed: '#5c5d52',

  // -- NEGATIVES --
  // Use this color to communicate negative information (e.g. error, an action to vote no).
  negative: '#ff6969',
  // To be used for text and outline content over negative.
  negativeContent: '#691212',
  // A softer negative, to be used when a large amount of information needs to be communicated. For instance, the Info component uses it as a background color in error mode.
  negativeSurface: '#ff6969',
  // To be used for text and outline content over negativeSurfaceContent.
  negativeSurfaceContent: '#242424',

  // -- CONTROLS --
  // Used for hints (or placeholders) inside of text input or similar components.
  hint: '#8c8e7a',
  // Indicates a selection in the broad sense.
  selected: '#f7f7ce',
  // To be used for text and outline content over selected.
  selectedContent: '#5d5d52',
  // Indicates a selection in the broad sense, when disabled (non-interactive).
  selectedDisabled: '#252525',
  // The background color of disabled components like Button.
  disabled: '#505050',
  // The text or outline content to be used over disabled.
  disabledContent: '#8c8e7a',
  // This color is generally used for icons over disabled. Note: icons over disabled could also be using disabledContent.
  disabledIcon: '#8c8e7a',
  // Used as a background color for some control components like Checkbox, Radio or Switch.
  control: '#242424',
  // Used as a border color for some control components like Checkbox, Radio or Switch.
  controlBorder: '#eaeac3',
  // Used as a border color for the pressed state of some control components like Checkbox, Radio or Switch.
  controlBorderPressed: '#285b70',
  // The background color for the disabled state of some control components like Checkbox, Radio or Switch.
  controlDisabled: '#505050',
  // This is used as a surface color for elements of control components that appear at an upper level. For instance, the Switch component is using this color for its handle.
  controlSurface: '#242424',
  // This is used as a background base for elements of control components that appear to be at a lower level. For instance, the Switch component is using this color for its inner base.
  controlUnder: '#8c8e7a',

  // -- Tag --
  //  Used to identify or label a subject.
  tagIdentifier: '#faf4a2',
  // To be used for text and outline content over tagIdentifier.
  tagIdentifierContent: '#164a25',
  // Used to indicate that a subject is new, or updated.
  tagNew: '#164a25',
  // To be used for text and outline content over tagNew.
  tagNewContent: '#ffffff',
  // Used for indicators in the general sense.
  tagIndicator: '#ff6969',
  // To be used for text and outline content over tagIndicator.
  tagIndicatorContent: '#242424',
  // Used to represent some activity that happened, like a number of notifications.
  tagActivity: '#ffffff',
  // To be used for text and outline content over tagActivity
  tagActivityContent: '#242424',

  // -- BADGES --
  badge: '#d6d9b6',
  badgeContent: '#242424',

  //  -- INFO --
  // This info color is generally stronger than infoSurface. It should be used for icons, borders, etc.
  info: '#0d5587',
  // The surface info color, generally softer than info. It should be used for background colors.
  infoSurface: '#363c48',
  // To be used for text and outline content over infoSurface.
  infoSurfaceContent: '#5fbdff',

  //  -- WARNING --
  // This warning color is generally stronger than warningSurface. It should be used for icons, borders, etc.
  warning: '#cdbb62',
  // The surface warning color, generally softer than warning. It should be used for background colors.
  warningSurface: '#fae95d',
  // To be used for text and outline content over warningSurface.
  warningSurfaceContent: '#bfa736',
};
