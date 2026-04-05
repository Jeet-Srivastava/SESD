import { ComplaintModel } from '../complaints/complaint.model.js';
import { ComplaintStatus } from '../../shared/types/roles.js';

export class AnalyticsService {
  public async overview() {
    // facet use karke db pe multiple queries ki jagah single trip me layenge
    const [result] = await ComplaintModel.aggregate([
      {
        $facet: {
          totalComplaints: [{ $count: 'count' }],
          statusBreakdown: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          priorityBreakdown: [
            { $group: { _id: '$priority', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          resolutionTime: [
            { $match: { resolvedAt: { $type: 'date' } } },
            {
              $project: {
                timeToResolve: { $subtract: ['$resolvedAt', '$createdAt'] },
              },
            },
            {
              $group: {
                _id: null,
                avgHoursToResolve: { $avg: { $divide: ['$timeToResolve', 1000 * 60 * 60] } },
              },
            },
          ],
          complaintTrends: [
            {
              $group: {
                _id: {
                  $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: -1 } },
            { $limit: 7 },
            { $sort: { _id: 1 } },
          ],
          staffPerformance: [
            { $match: { assigneeId: { $type: 'objectId' } } },
            {
              $group: {
                _id: '$assigneeId',
                totalAssigned: { $sum: 1 },
                resolvedCount: {
                  $sum: {
                    $cond: [
                      { $in: ['$status', [ComplaintStatus.RESOLVED, ComplaintStatus.CLOSED]] },
                      1,
                      0,
                    ],
                  },
                },
                avgResolutionHours: {
                  $avg: {
                    $cond: [
                      {
                        $and: [
                          { $eq: [{ $type: '$assignedAt' }, 'date'] },
                          { $eq: [{ $type: '$resolvedAt' }, 'date'] },
                        ],
                      },
                      {
                        $divide: [{ $subtract: ['$resolvedAt', '$assignedAt'] }, 1000 * 60 * 60],
                      },
                      null,
                    ],
                  },
                },
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'staffUser',
              },
            },
            {
              $project: {
                _id: 1,
                totalAssigned: 1,
                resolvedCount: 1,
                avgResolutionHours: { $ifNull: ['$avgResolutionHours', 0] },
                name: { $ifNull: [{ $arrayElemAt: ['$staffUser.name', 0] }, 'Unknown Staff'] },
                email: { $ifNull: [{ $arrayElemAt: ['$staffUser.email', 0] }, null] },
              },
            },
            { $sort: { resolvedCount: -1, totalAssigned: -1 } },
          ],
        },
      },
    ]);

    return {
      totalComplaints: result.totalComplaints[0]?.count || 0,
      statusBreakdown: result.statusBreakdown,
      priorityBreakdown: result.priorityBreakdown,
      avgResolutionHours: result.resolutionTime[0]?.avgHoursToResolve || 0,
      complaintTrends: result.complaintTrends,
      staffPerformance: result.staffPerformance,
    };
  }
}
