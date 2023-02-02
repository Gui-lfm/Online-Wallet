import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Header extends Component {
  handleTotalField = () => {
    const { expenses } = this.props;
    let total = 0;
    if (expenses.length > 0) {
      expenses.map((expense) => {
        const currentValue = expense.value;
        const currentExchangeRate = expense.exchangeRates[expense.currency].ask;
        const convertedValue = currentValue * currentExchangeRate;
        total += convertedValue;
        return total;
      });
    }
    return total.toFixed(2);
  };

  render() {
    const { email } = this.props;
    console.log(this.handleTotalField());
    const totalField = this.handleTotalField();
    return (
      <header>
        <p data-testid="email-field">{email}</p>
        <div>
          Despesa total:
          {' '}
          <p data-testid="total-field">{totalField}</p>
          {' '}
          <span data-testid="header-currency-field">BRL</span>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  expenses: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
  email: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  email: state.user.email,
  expenses: state.wallet.expenses,
});
export default connect(mapStateToProps)(Header);
