import { ensureDir } from 'fs-extra';

declare global {
  namespace NodeJS {
    interface Global {
      it: (name: any, func: any) => Promise<void>;
    }
  }
}

// @ts-ignore
global.it = (
  name: string,
  fn?:
    | ((cb: {
        (...args: any[]): any;
        fail(error?: string | { message: string }): any;
      }) => void | undefined)
    | (() => Promise<unknown>),
  timeout?: number,
) =>
  test(
    name,
    async (cb) => {
      try {
        await fn(cb);
      } catch (e) {
        await ensureDir('screenshots');
        await page.screenshot({ path: `screenshots/${name}.png` });
        throw e;
      }
    },
    timeout,
  );
