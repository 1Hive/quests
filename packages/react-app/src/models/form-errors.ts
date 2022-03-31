// eslint-disable-next-line no-unused-vars
export type FormErrors<Values> = { [key in keyof Values]: string | false };
