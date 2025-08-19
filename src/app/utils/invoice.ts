import PDFDocument from "pdfkit";
import AppError from "../errorHelpers/appError";
import httpStatus from "http-status-codes";

export interface InvoiceDataI {
    bookingDate: Date;
    tourName: string;
    guestCount: number;
    totalAmount: number;
    transactionId: string;
    recieverName: string;
}

export const generatePDFInvoice = async (invoiceData: InvoiceDataI): Promise<Buffer<ArrayBufferLike>> => {
    try {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ size: "A4", margin: 50 })
            const buffer: Uint8Array[] = [];

            doc.on("data", (chunk) => buffer.push(chunk))
            doc.on("end", () => resolve(Buffer.concat(buffer)))
            doc.on("error", (err) => reject(err))

            //PDF Content
            doc.fontSize(20).text("Invoice", { align: "center" });
            doc.moveDown()
            doc.fontSize(14).text(`Transaction ID : ${invoiceData.transactionId}`)
            doc.text(`Booking Date : ${invoiceData.bookingDate}`)
            doc.text(`Customer : ${invoiceData.recieverName}`)

            doc.moveDown();

            doc.text(`Tour: ${invoiceData.tourName}`);
            doc.text(`Guests: ${invoiceData.guestCount}`);
            doc.text(`Total Amount: $${invoiceData.totalAmount.toFixed(2)}`);
            doc.moveDown();

            doc.text("Thank you for booking with us!", { align: "center" });

            doc.end()
        })

    } catch (error: any) {
        console.log(error);
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Pdf creation error ${error.message}`)
    }
}