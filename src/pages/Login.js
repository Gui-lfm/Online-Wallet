import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { submitEmail } from '../redux/actions';

class Login extends Component {
  state = {
    email: '',
    password: '',
    isSubmitBtnDisabled: true,
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value }, this.handleValidation);
  };

  handleValidation = () => {
    const { email, password } = this.state;

    const validations = {
      email: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      password: 6,
    };

    const isPasswordValid = password.length >= validations.password;
    const isEmailValid = validations.email.test(email);

    if (isPasswordValid && isEmailValid) {
      this.setState({
        isSubmitBtnDisabled: false,
      });
    } else {
      this.setState({
        isSubmitBtnDisabled: true,
      });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, history } = this.props;
    const { email } = this.state;
    dispatch(submitEmail(email));
    history.push('/carteira');
  };

  render() {
    const { email, password, isSubmitBtnDisabled } = this.state;

    return (
      <form>
        <input
          value={ email }
          name="email"
          type="email"
          data-testid="email-input"
          onChange={ this.handleChange }
        />
        <input
          value={ password }
          name="password"
          type="password"
          data-testid="password-input"
          onChange={ this.handleChange }
        />
        <button
          type="submit "
          disabled={ isSubmitBtnDisabled }
          onClick={ this.handleSubmit }
        >
          Entrar
        </button>
      </form>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default connect()(Login);
