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
      <div
        className="bg-emerald-400
      min-h-screen
      flex items-center
      justify-center
      font-mono"
      >
        <form className="bg-neutral-200 p-12 rounded-xl shadow-lg ">
          <h1 className="text-center mb-5 text-emerald-400 text-3xl">TrybeWallet</h1>
          <label htmlFor="email" className="text-blue-800 mb-5">
            Email
            <input
              id="email"
              value={ email }
              name="email"
              type="email"
              data-testid="email-input"
              onChange={ this.handleChange }
              className="w-full
              block
              p-2
              rounded-md
              mb-5
              shadow-sm
              border
               border-blue-800
               focus:outline-none
               focus:border-blue-900"
            />
          </label>

          <label htmlFor="password" className="text-blue-800">
            Senha
            <input
              id="password"
              value={ password }
              name="password"
              type="password"
              data-testid="password-input"
              onChange={ this.handleChange }
              className="w-full
              block
              p-2
              mb-5
              rounded-md
              shadow-sm
              border
               border-blue-800
               focus:outline-none
               focus:border-blue-900"
            />
          </label>

          <button
            className="bg-blue-800
            p-3
            rounded-md w-full
            text-neutral-50
            disabled:bg-blue-500
            hover:bg-blue-900"
            type="submit"
            disabled={ isSubmitBtnDisabled }
            onClick={ this.handleSubmit }
          >
            Entrar
          </button>
        </form>
      </div>
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
