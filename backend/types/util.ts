
type NotKKeys<T, K> = {
  [P in keyof T]: T[P] extends K ? never :P;
}[keyof T];

export type PickType<T, K> = Pick<T, Exclude<keyof T, NotKKeys<T, K>>>;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type Nullable<T> = T | null;