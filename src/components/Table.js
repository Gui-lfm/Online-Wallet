import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteExpense, editExpense } from '../redux/actions';
import * as style from '../utils';

class Table extends Component {
  handleDeleteBtn = (e) => {
    const { dispatch } = this.props;
    dispatch(deleteExpense(e.target.id));
  };

  handleEditBtn = (e) => {
    const { dispatch } = this.props;
    dispatch(editExpense(e.target.id));
  };

  render() {
    const { expenses } = this.props;

    return (
      <div className="py-5">
        <table className={ style.classTable }>
          <thead className={ style.classThead }>
            <tr className="p-2">
              <th className={ style.classThCell }>Descrição</th>
              <th className={ style.classThCell }>Tag</th>
              <th className={ style.classThCell }>Método de pagamento</th>
              <th className={ style.classThCell }>Valor</th>
              <th className={ style.classThCell }>Moeda</th>
              <th className={ style.classThCell }>Câmbio utilizado</th>
              <th className={ style.classThCell }>Valor convertido</th>
              <th className={ style.classThCell }>Moeda de conversão</th>
              <th className={ style.classThCell }>Editar/Excluir</th>
            </tr>
          </thead>
          <tbody>
            {expenses
              && expenses.map((expense) => (
                <tr key={ expense.id }>
                  <td className={ style.classTbody }>{expense.description}</td>
                  <td className={ style.classTbody }>{expense.tag}</td>
                  <td className={ style.classTbody }>{expense.method}</td>
                  <td className={ style.classTbody }>
                    {Number(expense.value).toFixed(2)}
                  </td>
                  <td className={ style.classTbody }>
                    {expense.exchangeRates[expense.currency].name}
                  </td>
                  <td className={ style.classTbody }>
                    {Number(
                      expense.exchangeRates[expense.currency].ask,
                    ).toFixed(2)}
                  </td>
                  <td className={ style.classTbody }>
                    {Number(
                      expense.value
                        * expense.exchangeRates[expense.currency].ask,
                    ).toFixed(2)}
                  </td>
                  <td className={ style.classTbody }>Real</td>
                  <td className={ style.classTbody }>
                    <button
                      className={ style.classEditBtn }
                      id={ expense.id }
                      type="button"
                      data-testid="edit-btn"
                      onClick={ this.handleEditBtn }
                    >
                      Editar
                    </button>
                    <button
                      className={ style.classDeleteBtn }
                      id={ expense.id }
                      type="button"
                      data-testid="delete-btn"
                      onClick={ this.handleDeleteBtn }
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}

Table.propTypes = {
  dispatch: PropTypes.func.isRequired,
  expenses: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
};

const mapStateToProps = (state) => ({
  expenses: state.wallet.expenses,
});

export default connect(mapStateToProps)(Table);
