import * as ReactDOM from 'react-dom';
import * as React from 'react';
import createStore, {Store} from '../..';
import devtools from '../../devtools';
import logger from '../../devtools';
import connect from '../../react/connect';
import StoreContext from '../../react/context';

interface State {
  count1: number;
  count2: number;
}

function counter1 (store: Store<State>) {
  store.on('@init', () => ({ count1: 0 }))
  store.on('inc1', (state) => ({ count1: state.count1 + 1 }))
}

function counter2 (store: Store<State>) {
  store.on('@init', () => ({ count2: 0 }))
  store.on('inc2', (state) => ({ count2: state.count2 + 1 }))
}

function Tracker (props) {
  const hue = Math.round(255 * Math.random())
  const style = { backgroundColor: 'hsla(' + hue + ', 50%, 50%, 0.2)' }
  return <div className="tracker" style={style}>{props.value}</div>
}

interface ButtonProps {
  dispatch: Store<State>['dispatch']
  event: string
  text: string
}

const Button: React.FunctionComponent<ButtonProps> = (props) => {
  const onClick = React.useCallback(() => {
    props.dispatch(props.event)
  }, [])
  return <button onClick={onClick}>{props.text}</button>
}

const Tracker1 = connect<State>('count1', (props) => (
  <Tracker value={'Counter 1: ' + props.count1}/>
))

const Tracker2 = connect<State>('count2', (props) => (
  <Tracker value={'Counter 2: ' + props.count2}/>
))

const Tracker12 = connect<State>('count1', 'count2',(props) => (
  <Tracker value={'Counter 1: ' + props.count1 + ', counter 2: ' + props.count2}/>
))

interface Button1Props {
  dispatch: Store<State>['dispatch']
}

const Button1Impl: React.FunctionComponent<Button1Props> = (props) => (
  <Button dispatch={props.dispatch} event="inc1" text="Increase counter 1"/>
)

const Button1 = connect(Button1Impl)

interface Button2Props {
  dispatch: Store<State>['dispatch']
}

const Button2 = connect<Button2Props>((props) => (
  <Button dispatch={props.dispatch} event="inc2" text="Increase counter 2"/>
))

const App = () => (
  <>
    <div className="buttons">
      <Button1/>
      <Button2/>
    </div>
    <Tracker1/>
    <Tracker2/>
    <Tracker12/>
  </>
)

const store = createStore<State>([counter1, counter2, logger, devtools()])

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <App/>
  </StoreContext.Provider>,
  document.querySelector('main')
)
