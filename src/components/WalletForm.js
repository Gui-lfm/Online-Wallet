import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAPI, submitExpenses } from '../redux/actions';

class WalletForm extends Component {
  state = {
    value: '',
    selectedCurrency: 'USD',
    method: 'Dinheiro',
    description: '',
    tag: 'Alimentação',
    expenses: [],
  };

  componentDidMount() {
    const { requestCurrencies } = this.props;
    requestCurrencies();
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  fetchExchangeRates = async () => {
    const response = await fetch('https://economia.awesomeapi.com.br/json/all');
    const data = await response.json();
    const USDT = 'USDT';
    delete data[USDT];

    return data;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    const { value, selectedCurrency, method, description, tag, expenses } = this.state;
    const currentRate = await this.fetchExchangeRates();

    const newExpense = {
      id: expenses.length > 0 ? expenses[expenses.length - 1].id + 1 : 0,
      value,
      selectedCurrency,
      method,
      description,
      tag,
      exchangeRates: currentRate,
    };

    this.setState({
      expenses: [...expenses, newExpense],
    });

    dispatch(submitExpenses(expenses));
  };

  render() {
    const { value, selectedCurrency, method, description, tag } = this.state;
    const { currencies } = this.props;
    return (
      <form>
        <label htmlFor="valor">
          Valor:
          <input
            value={ value }
            name="value"
            id="valor"
            type="text"
            data-testid="value-input"
            onChange={ this.handleChange }
          />
        </label>
        <label htmlFor="moeda">
          Moeda:
          <select
            value={ selectedCurrency }
            name="selectedCurrency"
            id="moeda"
            data-testid="currency-input"
            onChange={ this.handleChange }
          >
            {currencies.map((currency) => (
              <option key={ currency }>{currency}</option>
            ))}
          </select>
        </label>

        <label htmlFor="pagamento">
          Método de pagamento:
          <select
            value={ method }
            name="method"
            id="pagamento"
            data-testid="method-input"
            onChange={ this.handleChange }
          >
            <option>Dinheiro</option>
            <option>Cartão de crédito</option>
            <option>Cartão de débito</option>
          </select>
        </label>

        <label htmlFor="descricao">
          Descrição:
          <input
            value={ description }
            name="description"
            id="descricao"
            type="text"
            data-testid="description-input"
            onChange={ this.handleChange }
          />
        </label>

        <label htmlFor="tag">
          Tag:
          <select
            value={ tag }
            name="tag"
            id="tag"
            data-testid="tag-input"
            onChange={ this.handleChange }
          >
            <option>Alimentação</option>
            <option>Lazer</option>
            <option>Trabalho</option>
            <option>Transporte</option>
            <option>Saúde</option>
          </select>
        </label>
        <button type="submit" onClick={ this.handleSubmit }>
          Adicionar despesa
        </button>
      </form>
    );
  }
}

WalletForm.propTypes = {
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  dispatch: PropTypes.func.isRequired,
  requestCurrencies: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  currencies: state.wallet.currencies,
});

const mapDispatchToProps = (dispatch) => ({
  requestCurrencies: () => dispatch(fetchAPI()),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletForm);
