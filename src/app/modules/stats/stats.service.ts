import { IsActive, PAYMENT_STATUS } from "../../constant"
import { BookingModel } from "../booking/booking.model"
import { PaymentModel } from "../payment/payment.model"
import { TourModel } from "../tour/tour.model"
import { UserModel } from "../user/user.model"

const today = new Date()
const sevenDaysAgoFromToday = new Date(today).setDate(today.getDate() - 7)
const thirtyDaysAgoFromToday = new Date(today).setDate(today.getDate() - 30)

const userStats = async () => {
    const totalUsersPromise = UserModel.countDocuments()
    const totalActiveUsersPromise = UserModel.countDocuments({ isActive: IsActive.ACTIVE })
    const totalInActiveUsersPromise = UserModel.countDocuments({ isActive: IsActive.INACTIVE })
    const totalBlockedUsersPromise = UserModel.countDocuments({ isActive: IsActive.BLOCKED })
    const totalDeletedUsersPromise = UserModel.countDocuments({ isDeleted: true })

    const newUsersInLastSevenDaysPromise = UserModel.countDocuments({
        createdAt: { $gte: sevenDaysAgoFromToday }
    })
    const newUsersInLastThirtyDaysPromise = UserModel.countDocuments({
        createdAt: { $gte: thirtyDaysAgoFromToday }
    })

    const usersByRolePromise = UserModel.aggregate([
        // stage: 1 --> group users by role and count them for each group
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }

        }
    ])

    const [totalUsers,
        activeUsers,
        inActiveUsers,
        blockedUsers,
        deletedUsers,
        lastSevenDaysUsers,
        lastThirtyDaysUsers,
        usersByRole] = await Promise.all([
            totalUsersPromise,
            totalActiveUsersPromise,
            totalInActiveUsersPromise,
            totalBlockedUsersPromise,
            totalDeletedUsersPromise,
            newUsersInLastSevenDaysPromise,
            newUsersInLastThirtyDaysPromise,
            usersByRolePromise
        ])
    return {
        totalUsers,
        activeUsers,
        inActiveUsers,
        blockedUsers,
        deletedUsers,
        lastSevenDaysUsers,
        lastThirtyDaysUsers,
        usersByRole
    }
}

const tourStats = async () => {
    const totalToursPromise = TourModel.countDocuments()

    await TourModel.updateMany(
        {
            $or: [
                { tourType: { $type: "string" } },
                { division: { $type: "string" } }
            ]
        },
        [
            {
                $set: {
                    tourType: { $toObjectId: "$tourType" },
                    division: { $toObjectId: "$division" },
                }

            }
        ]
    )

    const totalTourByTourTypePromise = TourModel.aggregate([
        // stage:1 --> lookup with tour types 
        {
            $lookup: {
                from: "tourtypes",
                localField: "tourType",
                foreignField: "_id",
                as: "type"
            }
        },

        // stage:2 ---> unwind via type
        {
            $unwind: "$type"
        },

        // stage:3 ---> grouped by tour type
        {
            $group: {
                _id: "$type.name",
                count: {$sum: 1}
            }
        }
    ])

    const averageTourCostPromise = TourModel.aggregate([
    // stage:1 ---> determine average tour cost via grouping 
        {
            $group: {
                _id: null,
                avgCost: {$avg: "$cost"}
            }

        }

    ])

    const totalTourByDivisionPromise = TourModel.aggregate([
         // stage:1 --> lookup with division
        {
            $lookup: {
                from: "divisions",
                localField: "division",
                foreignField: "_id",
                as: "division"
            }
        },

        // stage:2 ---> unwind via type
        {
            $unwind: "$division"
        },

        // stage:3 ---> grouped by tour type
        {
            $group: {
                _id: "$division.name",
                count: {$sum: 1}
            }
        }
    ])

    const topBookedToursPromise = BookingModel.aggregate([
        {
            $group: {
                _id: "$tour",
                bookingCount: {$sum: 1}
            }
        },
        {
            $sort: {
                bookingCount: -1
            }
        },
        {
            $limit: 5
        },
        {
            $lookup: {
                from: "tours",
                let: { tourId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr:{$eq: ["$_id", "$$tourId"]}
                        }
                    }
                ],
                as: "tour"
            }
        },
        {
            $unwind:"$tour"
        }
    ])

    const [totalTours, toursByTourType, toursByDivision, topBookedTours, averageTourCost] = await Promise.all([
        totalToursPromise,
        totalTourByTourTypePromise,
        totalTourByDivisionPromise,
        topBookedToursPromise,
        averageTourCostPromise,
    ])

    return {
        totalTours,
        toursByTourType,
        toursByDivision,
        topBookedTours,
        averageTourCost
    }
}

const bookingStats = async () => {
    const totalBookingsPromise = BookingModel.countDocuments()

    const bookingsByStatusPromise = BookingModel.aggregate([
        {
            $group: {
                _id: "$status",
                count: {$sum: 1}
            }
        }
    ])

    const bookingsPerTourPromise = BookingModel.aggregate([
        {
            $group: {
                _id: "$tour",
                bookingCount: {$sum: 1}
            }
        },
        {
            $sort: {bookingCount: -1}
        },
        {
            $limit:10
        },
        {
            $lookup: {
                from: "tours",
                localField: "_id",
                foreignField: "_id",
                as: "tour"
            }
        },
        {
            $unwind:"$tour"
        }
    ])

    const avgGuestPerBookingPromise = BookingModel.aggregate([
        {
            $group: {
                _id: null,
                avgGuestCount: {$avg: "$guestCount"}
            }
        }
    ])

    const lastSevenDaysBookingsPromise = BookingModel.countDocuments({
        createdAt: {$gte: sevenDaysAgoFromToday}
    })

    const lastThirtyDaysBookingsPromise = BookingModel.countDocuments({
        createdAt: {$gte: thirtyDaysAgoFromToday}
    }) 

    const totalBookingsByUniqueUserPromise = BookingModel.distinct("user").then((user)=>user?.length)



    const [totalBookings, bookingsByStatus, bookingsPerTour, avgGuestPerBooking, lastSevenDaysBookings, lastThirtyDaysBookings, totalBookingsByUniqueUser] = await Promise.all([
        totalBookingsPromise,
        bookingsByStatusPromise,
        bookingsPerTourPromise,
        avgGuestPerBookingPromise,
        lastSevenDaysBookingsPromise,
        lastThirtyDaysBookingsPromise,
        totalBookingsByUniqueUserPromise,
    ])
    return {
        totalBookings,
        bookingsByStatus,
        bookingsPerTour,
        avgGuestPerBooking: avgGuestPerBooking[0].avgGuestCount,
        lastSevenDaysBookings,
        lastThirtyDaysBookings,
        totalBookingsByUniqueUser
    }
}

const paymentStats = async () => {
    const totalPaymentsPromise = PaymentModel.countDocuments()

    const totalPaymentsByStatusPromise = PaymentModel.aggregate([
        {
            $group: {
                _id: "$status",
                count: {$sum: 1}
            }
        }
    ])

    const totalRevenuePromise = PaymentModel.aggregate([
        {
            $match:{status: PAYMENT_STATUS.PAID}
        },
        {
            $group: {
                _id: null,
                totalRevenue: {$sum: "$amount"}
            }
        }
    ])

    const avgPaidAmountPromise = PaymentModel.aggregate([
        {
            $group: {
                _id: null,
                avgPaidAmount: {$sum: "$amount"}
            }
        }
    ])

    const paymentGateWayDataPromise = PaymentModel.aggregate([
        {
            $group: {
                _id: { $ifNull: ["$paymentGateWayData.status", "UNKNOWN"] },
                count: {$sum: 1}
            }
        }
    ])

    const [totalPayments, totalPaymentsByStatus, totalRevenue, avgPaidAmount,paymentGateWayData ] = await Promise.all([
        totalPaymentsPromise,
        totalPaymentsByStatusPromise,
        totalRevenuePromise,
        avgPaidAmountPromise,
        paymentGateWayDataPromise
    ])

    return {
        totalPayments, 
        totalPaymentsByStatus,
        totalRevenue,
        avgPaidAmount,
        paymentGateWayData
    }
}

export const StatsService = {
    bookingStats,
    paymentStats,
    userStats,
    tourStats
}