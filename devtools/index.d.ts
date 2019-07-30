import {Store} from '..';

declare const devtools: {
  <State>(store: Store<State>): void;
  (options?: object): <State>(store: Store<State>) => void;
};

export = devtools;
