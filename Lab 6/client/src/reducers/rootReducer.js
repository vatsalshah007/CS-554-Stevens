import {combineReducers} from 'redux';
import pokeReducer from './pokeReducer';
import trainerReducer from './trainerReducer';

const rootReducer = combineReducers({
  trainers: trainerReducer,
  pokemons: pokeReducer
});

export default rootReducer;