import { ADD_EMAIL } from '../actions';

const INITIAL_STATE = {
  email: '',
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case ADD_EMAIL:
    return '';

  default:
    return state;
  }
};

export default userReducer;
