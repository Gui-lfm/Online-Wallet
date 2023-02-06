import {
  REQUEST_SUCESS,
  SUBMIT_EXPENSES,
  DELETE_EXPENSE,
  EDIT_EXPENSE,
  EDITED_EXPENSES,
} from '../actions';

const INITIAL_STATE = {
  currencies: [],
  expenses: [],
  editor: false,
  idToEdit: 0,
};

const walletReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case REQUEST_SUCESS:
    return {
      ...state,
      currencies: action.data,
    };
  case SUBMIT_EXPENSES:
    return {
      ...state,
      expenses: action.expenses,
    };
  case DELETE_EXPENSE:
    return {
      ...state,
      expenses: state.expenses.filter(
        (expense) => expense.id !== Number(action.id),
      ),
    };
  case EDIT_EXPENSE:
    return {
      ...state,
      editor: true,
      idToEdit: Number(action.id),
    };
  case EDITED_EXPENSES:
    return {
      ...state,
      editor: false,
      idToEdit: 0,
      expenses: action.expenses,
    };
  default:
    return state;
  }
};

export default walletReducer;
