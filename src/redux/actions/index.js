export const SUBMIT_EMAIL = 'SUBMIT_EMAIL';
export const SUBMIT_EXPENSES = 'SUBMIT_EXPENSES';
export const REQUEST_CURRENCIES = 'REQUEST_CURRENCIES';
export const REQUEST_SUCESS = 'REQUEST_SUCESS';
export const REQUEST_FAILED = 'REQUEST_FAILED';

export const submitEmail = (email) => ({
  type: SUBMIT_EMAIL,
  email,
});

export const submitExpenses = (expenses) => ({
  type: SUBMIT_EXPENSES,
  expenses,
});

const requestCurrencies = () => ({
  type: REQUEST_CURRENCIES,
});

const requestSucess = (data) => ({
  type: REQUEST_SUCESS,
  data,
});

const requestFailed = (error) => ({
  type: REQUEST_FAILED,
  error,
});

export function fetchAPI() {
  return async (dispatch) => {
    dispatch(requestCurrencies());
    try {
      const response = await fetch('https://economia.awesomeapi.com.br/json/all');
      const data = await response.json();
      dispatch(
        requestSucess(Object.keys(data).filter((currency) => currency !== 'USDT')),
      );
    } catch (error) {
      dispatch(requestFailed(error));
    }
  };
}
