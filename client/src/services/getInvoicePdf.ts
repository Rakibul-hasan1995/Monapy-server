import InvoiceServices from "./api/invoiceServices";

export const getInvoicePdf = async (_id: string) => {
  try {
    const data = await InvoiceServices.getInvoicePdf(_id);
    const pdfBlob = new Blob([data], { type: "application/pdf" });
    
    // Create a URL for the PDF blob
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    // Open the PDF in a new window or tab
    window.open(pdfUrl, "_blank");

  } catch (error) {
    return { error };
  }
};
