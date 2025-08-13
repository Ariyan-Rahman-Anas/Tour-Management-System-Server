export interface SSLCommerzI {
    storeId: string
    storePassword: string
    total_amount: number
    currency: string
    tran_id: string
    product_category: string
    success_url: string
    fail_url: string
    cancel_url: string
    EMI: {
        emi_option: number
    } 
    customerInformation: {
        cus_name: string
        cus_email: string
        cus_add1: string
        cus_add2: string
        cus_city: string
        cus_state: string
        cus_postcode: string
        cus_country: string
        cus_phone: string
    }
    shipmentInformation: {
        shipping_method: string
        num_of_item: number
        weight_of_items : string
        logistic_pickup_id : string
        logistic_delivery_type : string 
    }
    productInformation: {
        product_name: string
        product_category: string
        product_profile: string
    }
}


export interface SSLCommerzII {
    amount: number
    transactionId: string
    name: string
    email: string
    phoneNumber:string
    address:string
}