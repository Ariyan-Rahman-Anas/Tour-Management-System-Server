/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { envVars } from "../../config/env";
import { SSLCommerzII } from "./sslCommerz.interface";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { PaymentModel } from "../payment/payment.model";



const sslPaymentInit = async (payload: SSLCommerzII) => {
    try {
        // Input validation
        if (!payload.transactionId || !payload.amount || payload.amount <= 0) {
            throw new AppError(httpStatus.BAD_REQUEST, "Invalid payment data!")
        }

        const data = {
            // Store Configuration
            store_id: envVars.SSL.SSL_STORE_ID,
            store_passwd: envVars.SSL.SSL_STORE_PASSWORD,

            // Transaction Details
            total_amount: payload.amount.toFixed(2), // Ensure 2 decimal places
            currency: "BDT",
            tran_id: payload.transactionId,

            // URLs
            success_url: `${envVars.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
            fail_url: `${envVars.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`, // Add transactionId for tracking
            cancel_url: `${envVars.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`, // Add transactionId for tracking
            ipn_url: envVars.SSL.SSL_IPN_URL,

            // Product Information
            shipping_method: "N/A",
            product_name: "Tour Booking",
            product_category: "Tourism",
            product_profile: "general",

            // Customer Information
            cus_name: payload.name?.trim(),
            cus_email: payload.email?.trim(),
            cus_add1: payload.address?.trim(),
            cus_add2: payload.address?.trim(),
            cus_city: payload.address?.trim(),
            cus_state: payload.address?.trim(),
            cus_postcode: payload.address?.trim(),
            cus_country: "Bangladesh",
            cus_phone: payload.phoneNumber?.trim(),
            cus_fax: payload.phoneNumber?.trim(),

            // Shipping Information (Required fields)
            ship_name: payload.name?.trim(),
            ship_add1: payload.address?.trim(),
            ship_add2: payload.address?.trim(),
            ship_city: payload.address?.trim(),
            ship_state: payload.address?.trim(),
            ship_postcode: payload.address?.trim(),
            ship_country: "Bangladesh",
        }

        const response = await axios({
            method: "POST",
            url: envVars.SSL.SSL_PAYMENT_API,
            data: new URLSearchParams(data).toString(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            timeout: 10000
        })

        // Validate response
        if (!response.data || !response.data.GatewayPageURL) {
            console.error("Invalid SSLCommerz response:", response.data)
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Payment gateway initialization failed!")
        }
        return response.data

    } catch (error: any) {
        console.error("SSLCommerz payment initialization error:", error.message)

        // Handle specific error cases
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            throw new AppError(httpStatus.SERVICE_UNAVAILABLE, "Payment service is currently unavailable!")
        }

        if (error.response?.status === 400) {
            throw new AppError(httpStatus.BAD_REQUEST, "Invalid payment configuration!")
        }

        if (error instanceof AppError) {
            throw error
        }

        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to initialize payment!")
    }
}

const validateSSLCommerzPayment = async (payload: any) => {
    try {
        const response = await axios({
            method: "GET",
            url: `${envVars.SSL.SSL_VALIDATION_API}?val_id=${payload.val_id}&store_id=${envVars.SSL.SSL_STORE_ID}&store_passwd=${envVars.SSL.SSL_STORE_PASSWORD}`
        })
        
        console.log("SLL Commerz Validate API response: ", response.data)
        
        await PaymentModel.updateOne(
            { transactionId: payload.tran_id },
            { paymentGetWayData: response.data },
            { runValidators: true }
        )
    } catch (error: any) {
        throw new AppError(httpStatus.BAD_REQUEST, `Payment validation error occurred: ${error.message}`)
    }
}

const parseSSLCommerzCallback = (callbackData: any) => {
    return {
        transactionId: callbackData.tran_id,
        status: callbackData.status,
        amount: parseFloat(callbackData.amount),
        currency: callbackData.currency,
        bankTransactionId: callbackData.bank_tran_id,
        cardType: callbackData.card_type,
        validationId: callbackData.val_id,
    }
}

export const SSLCommerzService = {
    sslPaymentInit,
    validateSSLCommerzPayment,
    parseSSLCommerzCallback
}