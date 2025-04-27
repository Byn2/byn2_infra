import Invoice from '../models/invoice';
import InvoiceItem from '../models/invoice-item';

export async function getDashboardStatistics() {
  const currentYear = new Date().getFullYear();

  const ytdTotalResult = await Invoice.aggregate([
    {
      $match: {
        status: 'Completed',
        createdAt: {
          $gte: new Date(currentYear, 0, 1),
          $lte: new Date(),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount.total' },
      },
    },
  ]);

  const completedCount = await Invoice.countDocuments({ status: 'Completed' });

  const invoiceItemEmployeeCount = await InvoiceItem.distinct('invoiceId').then(arr => arr.length);

  return {
    ytdTotal: ytdTotalResult[0]?.totalAmount || 0,
    completedCount,
    invoiceItemCount: invoiceItemEmployeeCount,
  };
}

export async function getMonthlyTrend() {
  const currentYear = new Date().getFullYear();

  return await Invoice.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(currentYear, 0, 1),
          $lte: new Date(currentYear, 11, 31),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        totalAmount: { $sum: '$amount.total' },
      },
    },
    {
      $sort: { '_id': 1 },
    },
    {
      $project: {
        month: '$_id',
        totalAmount: 1,
        _id: 0,
      },
    },
  ]);
}
