import {combineReducers, createStore} from 'redux';

import retrieveBornesList from './Reducers/borneReducer';
import togglePage from './Reducers/swipeReducer';

const rootReducer = combineReducers({
  retrieveBornesList,
  togglePage,
});

const reducerInitializedStore = createStore(rootReducer);

export default reducerInitializedStore;
