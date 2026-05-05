import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../services/transaction.service';

const transactionService = new TransactionService();

export class TransactionController {
  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const { page, limit, type, status, dateFrom, dateTo, userId } = req.query;

      const result = await transactionService.getTransactions(pharmacyId, {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        type: type as string,
        status: status as string,
        dateFrom: dateFrom as string,
        dateTo: dateTo as string,
        userId: userId as string,
      });

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getTransactionById(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const { id } = req.params;
      const transaction = await transactionService.getTransactionById(id, pharmacyId);

      res.json({ success: true, data: transaction });
    } catch (error) {
      next(error);
    }
  }

  async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      const userId = req.user?.userId;
      if (!pharmacyId || !userId) throw new Error('Missing authentication data');

      const transaction = await transactionService.createTransaction(pharmacyId, userId, req.body);

      res.status(201).json({
        success: true,
        data: transaction,
        message: 'Transaction created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePaymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const { id } = req.params;
      const { status } = req.body;

      const result = await transactionService.updatePaymentStatus(id, pharmacyId, status);

      res.json({
        success: true,
        data: result,
        message: 'Payment status updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async voidTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      const userId = req.user?.userId;
      if (!pharmacyId || !userId) throw new Error('Missing authentication data');

      const { id } = req.params;
      const result = await transactionService.voidTransaction(id, pharmacyId, userId);

      res.json({
        success: true,
        data: result,
        message: 'Transaction voided successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecentTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) throw new Error('Pharmacy ID not found');

      const { limit } = req.query;
      const transactions = await transactionService.getRecentTransactions(
        pharmacyId,
        limit ? Number(limit) : 10
      );

      res.json({ success: true, data: transactions });
    } catch (error) {
      next(error);
    }
  }
}

export const transactionController = new TransactionController();