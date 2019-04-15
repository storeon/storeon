import {Store} from '..';

declare const devtools: {
  <State>(store: Store<State>): void;
  (): <State>(store: Store<State>) => void;
};

export = devtools;
