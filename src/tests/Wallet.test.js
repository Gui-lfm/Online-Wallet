import React from 'react';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockData from './helpers/mockData';
import App from '../App';
import { renderWithRouterAndRedux } from './helpers/renderWith';

describe('Testes da página de carteira virtual', () => {
  beforeEach(() => {
    global.fetch = jest.fn(mockData);
  });

  afterEach(() => {
    global.fetch.mockClear();
  });

  const currencyId = 'currency-input';

  it('Deve haver um formulário com os campos de valor, moeda, método de pagamento, descrição e tag', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/carteira'] });

    const valueField = screen.getByTestId('value-input');
    expect(valueField).toBeInTheDocument();

    const currencyField = screen.getByTestId(currencyId);
    expect(currencyField).toBeInTheDocument();

    const methodField = screen.getByTestId('method-input');
    expect(methodField).toBeInTheDocument();

    const descriptionField = screen.getByTestId('description-input');
    expect(descriptionField).toBeInTheDocument();

    const tagField = screen.getByTestId('tag-input');
    expect(tagField).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://economia.awesomeapi.com.br/json/all',
    );
  });
  it('O email inserido na página de login deve aparecer corretamente no cabeçalho da página', () => {
    const validEmail = 'teste@teste.com';
    const initialState = {
      user: {
        email: validEmail,
      },
      wallet: {},
    };
    renderWithRouterAndRedux(<App />, {
      initialEntries: ['/carteira'],
      initialState,
    });

    const emailField = screen.getByTestId('email-field');

    expect(emailField).toHaveTextContent(validEmail);
  });

  it('O campo "Moeda" deve renderizar uma lista de moedas providas por uma api', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(mockData),
    }));

    renderWithRouterAndRedux(<App />, {
      initialEntries: ['/carteira'],
    });
    const currencyField = screen.getByTestId(currencyId);
    const option = await screen.findByRole('option', { name: 'USD' });
    const options = await within(currencyField).findAllByRole('option');
    expect(option).toBeInTheDocument();
    expect(options.length).toBe(15);
  });

  it('Ao clicar no botão de adicionar despesa, a api deve ser chamada novamente', () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(mockData),
    }));

    renderWithRouterAndRedux(<App />, {
      initialEntries: ['/carteira'],
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    const addBtn = screen.getByRole('button', { name: 'Adicionar despesa' });
    expect(addBtn).toBeInTheDocument();

    userEvent.click(addBtn);

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('Ao adicionar uma despesa, o valor no cabeçalho deve ser atualizado', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(mockData),
    }));

    renderWithRouterAndRedux(<App />, {
      initialEntries: ['/carteira'],
    });

    const userInputs = {
      valueInput: '20',
      currencyInput: await screen.findByRole('option', { name: 'USD' }),
      methodInput: screen.getByRole('option', { name: 'Dinheiro' }),
      descriptionInput: 'teste',
      tagInput: screen.getByRole('option', { name: 'Alimentação' }),
    };

    const valueField = screen.getByTestId('value-input');
    const currencyField = screen.getByTestId(currencyId);
    const methodField = screen.getByTestId('method-input');
    const descriptionField = screen.getByTestId('description-input');
    const tagField = screen.getByTestId('tag-input');
    const addBtn = screen.getByRole('button', { name: 'Adicionar despesa' });
    const totalField = screen.getByTestId('total-field');

    userEvent.type(valueField, userInputs.valueInput);
    userEvent.selectOptions(currencyField, userInputs.currencyInput);
    userEvent.selectOptions(methodField, userInputs.methodInput);
    userEvent.type(descriptionField, userInputs.descriptionInput);
    userEvent.selectOptions(tagField, userInputs.tagInput);
    userEvent.click(addBtn);

    await waitFor(() => expect(totalField).toHaveTextContent('95.06'));
  });

  // it('Ao enviar as informações, deve ser criado um objeto com id dinâmico e salvo no estado do componente', () => {});
});
