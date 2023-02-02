import React from 'react';
import { screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import App from '../App';
import { renderWithRouterAndRedux } from './helpers/renderWith';

describe('Testes da página de carteira virtual', () => {
  it('Deve haver um formulário com os campos de valor, moeda, método de pagamento, descrição e tag', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/carteira'] });

    const valueField = screen.getByTestId('value-input');
    expect(valueField).toBeInTheDocument();

    const currencyField = screen.getByTestId('currency-input');
    expect(currencyField).toBeInTheDocument();

    const methodField = screen.getByTestId('method-input');
    expect(methodField).toBeInTheDocument();

    const descriptionField = screen.getByTestId('description-input');
    expect(descriptionField).toBeInTheDocument();

    const tagField = screen.getByTestId('tag-input');
    expect(tagField).toBeInTheDocument();
  });
});
