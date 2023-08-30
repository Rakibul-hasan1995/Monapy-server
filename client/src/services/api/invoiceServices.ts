/* eslint-disable no-constant-condition */
import store from "../../store/store";
import io from "socket.io-client";
import { Actions } from "easy-peasy";
import { _arrToObjBy_id } from "../../utils/arrToObj";
import { toast } from "react-toastify";
import { GroupDataXY, Invoice, InvoiceModel } from "../../store/invoice";
import { Axios } from "./axiosConfig";

interface CreateResponse {
   success: boolean;
   data: Invoice | null;
   error: any | null;
}

class InvoiceServices {
   static async getInvoice(): Promise<Record<string, Invoice>> {
      try {
         const value = store.getState().invoice.value
         const action = store.getActions().invoice
         if (Object.values(value).length) {
            return value
         } else {
            const { data } = await Axios.get(`/api/invoice`);
            const value = _arrToObjBy_id(data)
            action.save(value)
            console.log('fetch invoice')
            InvoiceServices.handleSocket()
            return value
         }
      } catch (error: any) {
         toast.error(error?.response?.message)
         throw new Error(error);
      }
   }
   static async getInvoiceXY(): Promise<GroupDataXY[]> {
      try {
         const value = store.getState().invoice._groupDataXY
         const action = store.getActions().invoice
         if (value.length) {
            return value
         } else {
            const { data } = await Axios.get(`/api/invoice/xy`);
            action.saveGroup(data)
            return data
         }
      } catch (error: any) {
         toast.error(error?.response?.message)
         throw new Error(error);
      }
   }
   static async getInvoiceCount(): Promise<number> {
      try {
         const { data } = await Axios.get(`/api/invoice/count`);
         return data
      } catch (error: any) {
         toast.error(error?.response?.message)
         throw new Error(error);
      }
   }

   static async createInvoice(invoice: Invoice): Promise<CreateResponse> {
      try {
         const action = store.getActions().invoice
         const { data } = await toast.promise(
            Axios.post(`/api/invoice`, invoice),
            {
               pending: 'Processing Data',
               success: 'Processing Success',
               error: 'Error'
            }
         )
         action.add(data)
         toast.success(`Successfully Create ${data.Invoice_no}`)
         return { success: true, data: data, error: null }
      } catch (error: any) {
         toast.error(error?.response?.message)
         return { success: false, data: null, error: error?.response.data }
      }
   }

   static async getInvoicePdf(_id: string): Promise<Blob> {
      const tempData = store.getState().invoice.tempPdf
      const orderActions = store.getActions().invoice
      try {
         if (tempData[_id]) {
            return tempData[_id]
         }
         const { data } = await toast.promise(
            Axios.get(`/api/invoice/generate-pdf?_id=${_id}`, {
               responseType: "blob",
            }),
            {
               pending: 'Loading Pdf',
               success: 'Loading Success',
               error: 'Error'
            }
         )
         const pdfBlob = new Blob([data], { type: 'application/pdf' });
         const obj = {
            value: pdfBlob,
            key: _id
         }
         orderActions.saveTempPdf(obj)
         setTimeout(() => {
            orderActions.delTempPdf(_id)
         }, 1 * 60 * 1000);
         return obj.value
      } catch (error: any) {
         toast.error(error?.response?.message)
         throw new Error(error);
      }
   }

   static async getInvoiceQuery(query: string): Promise<Record<string, Invoice>> {
      const invoiceActions = store.getActions().invoice
      const tempData = store.getState().invoice.tempData
      try {
         if (tempData[query]) {
            return tempData[query]
         }
         const { data } = await toast.promise(
            Axios.get(`/api/invoice/query?${query}`),
            {
               pending: 'Loading Data',
               success: 'Loading Success',
               error: 'Error'
            }
         )
         invoiceActions.saveTempData({ value: _arrToObjBy_id(data), key: query })
         setTimeout(() => {
            invoiceActions.delTempData(query)
         }, 5 * 60 * 1000);
         return data
      } catch (error: any) {
         toast.error(error?.response?.message)
         throw new Error(error);
      }
   }
   static async getInvoiceBy_id(_id: string): Promise<Invoice> {
      const value = store.getState().invoice.value
      try {
         if (value[_id]) {
            return value[_id]
         }
         const { data } = await toast.promise(
            Axios.get(`/api/invoice/query?_id=${_id}`),
            {
               pending: 'Loading Data',
               success: 'Loading Success',
               error: 'Error'
            }
         )
         return data
      } catch (error: any) {
         toast.error(error?.response?.message)
         throw new Error(error);
      }
   }
   static handleSocket() {
      const actions: Actions<InvoiceModel> = store.getActions().invoice
      try {
         const socket = io(`/api/invoice`);
         socket.on("changes", (data) => {
            actions.add(data)
         });

         socket.on("xyData", (data) => {
            actions.saveGroup(data)
         });
         socket.on("insert", (data) => {
            actions.add(data)
         });
         socket.on("delete", (_id) => {
            actions.delete(_id)
         });
      } catch (error: any) {
         toast.error(error?.response?.message)
         throw new Error(error);
      }
   }
}

export default InvoiceServices;
