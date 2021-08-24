// REF: https://javascript.plainenglish.io/global-state-using-only-react-hooks-with-the-context-api-typescript-edition-ada822fc282c
import { createContext, ReactElement, ReactNode, useReducer } from 'react';
import Reducer from './reducer';
import { ContextType, GlobalStateInterface } from './types';

/**
 * React Context-based Global Store with a reducer
 **/
export function GlobalStore({ children }: { children: ReactNode }): ReactElement {
  const [globalState, dispatch] = useReducer(Reducer, initialState);

  return (
    <globalContext.Provider value={{ globalState, dispatch }}>
      {children}
    </globalContext.Provider>
  );
}

export const globalContext = createContext({} as ContextType);

export const initialState: GlobalStateInterface = {
  provider: null,
  web3: null,
  account: '',
};
