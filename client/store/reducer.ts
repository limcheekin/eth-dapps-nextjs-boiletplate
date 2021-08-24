import { ActionType, GlobalStateInterface } from './types';
import { initialState } from './index';

const Reducer = (state: GlobalStateInterface, action: ActionType): any => {
    switch (action.type) {
        case 'SET_ACCOUNT':
            return {
                ...state,
                account: action.payload,
            };
        case 'SET_PROVIDER':
            return {
                ...state,
                provider: action.payload,
            };
        case 'SET_WEB3':
            return {
                ...state,
                web3: action.payload,
            };
        case 'CLEAR_STATE':
            return initialState;
        default:
            return state;
    }
};

export default Reducer;