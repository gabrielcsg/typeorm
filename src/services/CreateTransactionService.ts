import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    if (type === 'outcome') {
      const total = await (await transactionRepository.getBalance()).total;
      console.log(total);
      if (total - value < 0) {
        throw new AppError('does not have enough balance');
      }
    }
    const categoryExists = await categoryRepository.findOne({
      where: { title: category },
    });
    let category_id;
    if (!categoryExists) {
      const newCategory = categoryRepository.create({ title: category });
      await categoryRepository.save(newCategory);
      category_id = newCategory.id;
    } else {
      category_id = categoryExists.id;
    }

    const transaction = transactionRepository.create({
      title,
      category_id,
      value,
      type,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
