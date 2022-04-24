import { GU } from '@1hive/1hive-ui';

export const GUpx = (x: number) => `${GU * x}px`;

export function isDarkTheme(theme: any) {
  // eslint-disable-next-line no-underscore-dangle
  return theme._appearance === 'dark';
}
