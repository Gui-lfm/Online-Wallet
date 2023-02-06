import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAPI, submitExpenses, submitEditedExpenses } from '../redux/actions';

const baseTag = 'Alimentação';
const baseCurrency = 'USD';
const baseMethod = 'Dinheiro';

class WalletForm extends Component {
  state = {
    value: '',
    selectedCurrency: baseCurrency,
    method: baseMethod,
    description: '',
    tag: baseTag,
    expenses: [],
    editForm: false,
  };

  componentDidMount() {
    const { requestCurrencies } = this.props;
    requestCurrencies();
  }

  componentDidUpdate() {
    const { editor, expenses: Savedexpenses, idToEdit } = this.props;
    const { editForm } = this.state;
    if (editor && !editForm) {
      const selectedEdit = Savedexpenses.filter(
        (expense) => expense.id === idToEdit,
      )[0];
      this.setState({
        editForm: true,
        value: selectedEdit.value,
        selectedCurrency: selectedEdit.currency,
        method: selectedEdit.method,
        description: selectedEdit.description,
        tag: selectedEdit.tag,
      });
    }
  }

  handleChange = ({ target }) => {
    const { name, value } = target;

    this.setState({ [name]: value }, this.isEditing);
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
    const { value, selectedCurrency, method, description, tag, expenses } = this.state;
    const { sendExpenses } = this.props;
    const currentRate = await this.fetchExchangeRates();

    const newExpense = {
      id: expenses.length > 0 ? expenses[expenses.length - 1].id + 1 : 0,
      value,
      currency: selectedCurrency,
      method,
      description,
      tag,
      exchangeRates: currentRate,
    };

    this.setState(
      {
        value: '',
        selectedCurrency: baseCurrency,
        method: baseMethod,
        description: '',
        tag: baseTag,
        expenses: [...expenses, newExpense],
      },
      () => {
        const { expenses: Savedexpenses } = this.state;
        sendExpenses(Savedexpenses);
      },
    );
  };

  handleEdit = (e) => {
    e.preventDefault();
    const { value, selectedCurrency, method, description, tag, expenses } = this.state;
    const { expenses: Savedexpenses, idToEdit, sendEditedExpenses } = this.props;

    const selectedExpense = Savedexpenses.filter(
      (expense) => expense.id === idToEdit,
    )[0];

    const editedExpense = {
      id: selectedExpense.id,
      value,
      currency: selectedCurrency,
      method,
      description,
      tag,
      exchangeRates: selectedExpense.exchangeRates,
    };
    const expenseEdited = expenses.map(
      (expense) => (expense.id === editedExpense.id ? editedExpense : expense),
    );
    this.setState({
      expenses: expenseEdited,
    }, () => {
      const { expenses: editedExpenses } = this.state;
      sendEditedExpenses(editedExpenses);
      this.setState({
        editForm: false,
        value: '',
        selectedCurrency: baseCurrency,
        method: baseMethod,
        description: '',
        tag: baseTag,
      });
    });
  };

  render() {
    const { value, selectedCurrency, method, description, tag } = this.state;
    const { currencies, editor } = this.props;

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
            {currencies
              && currencies.map((currency) => (
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
        {editor ? (
          <button type="submit" onClick={ this.handleEdit }>
            Editar despesa
          </button>
        ) : (
          <button type="submit" onClick={ this.handleSubmit }>
            Adicionar despesa
          </button>
        )}
      </form>
    );
  }
}

WalletForm.propTypes = {
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  editor: PropTypes.bool.isRequired,
  expenses: PropTypes.arrayOf(PropTypes.objectOf()).isRequired,
  idToEdit: PropTypes.number.isRequired,
  requestCurrencies: PropTypes.func.isRequired,
  sendEditedExpenses: PropTypes.func.isRequired,
  sendExpenses: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  currencies: state.wallet.currencies,
  editor: state.wallet.editor,
  idToEdit: state.wallet.idToEdit,
  expenses: state.wallet.expenses,
});

const mapDispatchToProps = (dispatch) => ({
  requestCurrencies: () => dispatch(fetchAPI()),
  sendExpenses: (expenses) => dispatch(submitExpenses(expenses)),
  sendEditedExpenses: (expenses) => dispatch(submitEditedExpenses(expenses)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletForm);
