import { StoreonStore, StoreonModule } from '../index.js'

export const storeonDevtools: {
  <State>(store: StoreonStore<State>): void
  (options?: object): <State>(store: StoreonStore<State>) => void
}

export const storeonLogger: StoreonModule<unknown>
