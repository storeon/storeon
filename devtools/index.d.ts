import {Store} from '..';

declare const devtools: {
  <T>(store: Store<T>): void;
  (): <T>(store: Store<T>) => void;
};

export = devtools;
