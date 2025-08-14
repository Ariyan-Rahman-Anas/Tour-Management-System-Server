export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    GUIDE = "GUIDE"
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export const excludeFields = ["search", "sort", "fields", "limit", "skip", "page"]
export const searchableFields = ["title", "location", "description"]
// export const bookingsSearchableFields = ["user", "tour", "payment", "guestCount"]
// export const bookingsSearchableFields = ["guestCount"]


export enum BOOKING_STATUS {
    PENDING = "PENDING",
    CANCELED = "CANCELED",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}

export enum PAYMENT_STATUS {
    PAID = "PAID",
    UNPAID = "UNPAID",
    CANCELED = "CANCELED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
}