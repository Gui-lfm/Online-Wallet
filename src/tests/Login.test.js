import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { renderWithRouterAndRedux } from './helpers/renderWith';

describe('Testes da página de Login', () => {
  const emailInput = 'email-input';
  const passwordInput = 'password-input';

  it('Deve haver um campo de input para o Email do usuário e um para a senha', () => {
    renderWithRouterAndRedux(<App />);
    const userEmail = screen.getByTestId(emailInput);
    expect(userEmail).toBeInTheDocument();

    const userPassword = screen.getByTestId(passwordInput);
    expect(userPassword).toBeInTheDocument();
  });
  it('Deve haver um botão de login com o texto "Entrar" ', () => {
    renderWithRouterAndRedux(<App />);
    const loginBtn = screen.getByRole('button', { name: 'Entrar' });
    expect(loginBtn).toBeInTheDocument();
  });
  it('Caso seja digitado um email ou senha inválidos, o botão permanece como disabled, impedindo a entrada', () => {
    renderWithRouterAndRedux(<App />);
    const invalidEmail = 'teste@';
    const invalidPassword = '123';

    const validEmail = 'teste@teste.com';
    const validPassword = '123456';

    const loginBtn = screen.getByRole('button', { name: 'Entrar' });
    const userEmail = screen.getByTestId(emailInput);
    const userPassword = screen.getByTestId(passwordInput);

    userEvent.type(userEmail, invalidEmail);
    userEvent.type(userPassword, validPassword);
    expect(loginBtn).toBeDisabled();

    userEvent.type(userEmail, validEmail);
    userEvent.type(userPassword, invalidPassword);
    expect(loginBtn).toBeDisabled();
  });
  it('Caso seja digitado um email e senha válidos, o botão se torna enabled e ao clicar, redireciona para "/carteira"', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    const validEmail = 'teste@teste.com';
    const validPassword = '123456';

    const loginBtn = screen.getByRole('button', { name: 'Entrar' });
    const userEmail = screen.getByTestId(emailInput);
    const userPassword = screen.getByTestId(passwordInput);

    userEvent.type(userEmail, validEmail);
    userEvent.type(userPassword, validPassword);
    expect(loginBtn).toBeEnabled();

    userEvent.click(loginBtn);

    const { pathname } = history.location;
    expect(pathname).toBe('/carteira');
  });
});
