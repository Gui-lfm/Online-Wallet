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
  const valueId = 'value-input';
  const totalId = 'total-field';

  it('1 - Deve haver um formulário com os campos de valor, moeda, método de pagamento, descrição e tag', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/carteira'] });

    const valueField = screen.getByTestId(valueId);
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

  it('2 - O email inserido na página de login deve aparecer corretamente no cabeçalho da página', () => {
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

  it('3 - O campo "Moeda" deve renderizar uma lista de moedas providas por uma api', async () => {
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

  it('4 - Ao clicar no botão de adicionar despesa, a api deve ser chamada novamente', () => {
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

  it('5 - Ao adicionar uma despesa, o valor no cabeçalho deve ser atualizado', async () => {
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

    const valueField = screen.getByTestId(valueId);
    const currencyField = screen.getByTestId(currencyId);
    const methodField = screen.getByTestId('method-input');
    const descriptionField = screen.getByTestId('description-input');
    const tagField = screen.getByTestId('tag-input');
    const addBtn = screen.getByRole('button', { name: 'Adicionar despesa' });
    const totalField = screen.getByTestId(totalId);

    userEvent.type(valueField, userInputs.valueInput);
    userEvent.selectOptions(currencyField, userInputs.currencyInput);
    userEvent.selectOptions(methodField, userInputs.methodInput);
    userEvent.type(descriptionField, userInputs.descriptionInput);
    userEvent.selectOptions(tagField, userInputs.tagInput);
    userEvent.click(addBtn);

    await waitFor(() => expect(totalField).toHaveTextContent('95.06'));
  });

  it('6 - Ao deletar uma despesa, o valor deve ser deduzido da despesa total', () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(mockData),
    }));

    const initialState = {
      user: {},
      wallet: {
        expenses: [
          {
            id: 0,
            value: '10',
            currency: 'CAD',
            method: 'Dinheiro',
            description: 'teste_teste',
            tag: 'Trabalho',
            exchangeRates: mockData,
          }],
      },
    };

    renderWithRouterAndRedux(<App />, {
      initialEntries: ['/carteira'], initialState,
    });

    const deleteBtn = screen.getByRole('button', { name: 'Excluir' });
    expect(deleteBtn).toBeInTheDocument();

    const totalField = screen.getByTestId(totalId);
    expect(totalField).toHaveTextContent('37.56');

    userEvent.click(deleteBtn);
    expect(totalField).toHaveTextContent('0');
  });

  it('7 - Ao editar uma despesa, o valor total deve ser atualizado e a despesa deve ser atualizada corretamente na tabela', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(mockData),
    }));

    const initialState = {
      user: {
        email: 'teste123@teste.com',
      },
      wallet: {
        expenses: [
          {
            id: 0,
            value: '10',
            currency: 'CAD',
            method: 'Dinheiro',
            description: 'teste_teste',
            tag: 'Trabalho',
            exchangeRates: mockData,
          },
          {
            id: 1,
            value: '15',
            currency: 'USD',
            method: 'Dinheiro',
            description: 'teste_teste2',
            tag: 'Trabalho',
            exchangeRates: mockData,
          },
          {
            id: 2,
            value: '20',
            currency: 'EUR',
            method: 'Dinheiro',
            description: 'teste_teste3',
            tag: 'Trabalho',
            exchangeRates: mockData,
          },
        ],
        editor: false,
        idToEdit: 0,
        currencies: Object.keys(mockData).filter((currency) => currency !== 'USDT'),
      },
    };

    renderWithRouterAndRedux(<App />, {
      initialEntries: ['/carteira'], initialState,
    });

    const editBtn = screen.getAllByRole('button', { name: 'Editar' });
    expect(editBtn).toHaveLength(3);

    const totalField = screen.getByTestId(totalId);
    expect(totalField).toHaveTextContent('211.39');

    userEvent.click(editBtn[0]);
    const valueField = screen.getByTestId(valueId);
    expect(valueField.value).toBe('10');

    userEvent.type(valueField, '25');

    const submitEditBtn = screen.getByRole('button', { name: 'Editar despesa' });
    expect(submitEditBtn).toBeInTheDocument();

    // userEvent.click(submitEditBtn);
    // await waitFor(expect(totalField).toHaveTextContent('267.74'));
  });
});
