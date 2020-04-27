import { Router } from 'express';
import { getCustomRepository, TransactionRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionRepository.find({
    relations: ['category'],
  });
  const balance = await transactionRepository.getBalance();

  return response.json({
    transactions,
    balance,
  });
});

transactionsRouter.post('/', async (request, response) => {
  const { value, type, category, title } = request.body;

  const createTransaction = new CreateTransactionService();
  const transaction = await createTransaction.execute({
    value,
    title,
    type,
    category,
  });
  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const transactionRepository = getCustomRepository(TransactionsRepository);
  await transactionRepository.delete(id);

  return response.status(204).send();
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
