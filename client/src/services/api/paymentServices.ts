import { Payment, PaymentModel, XYData } from "../../store/payments";
import store from "../../store/store";
import { _arrToObjBy_id } from "../../utils/arrToObj";
import { toast } from "react-toastify";
import { Actions } from "easy-peasy";
import { io } from "socket.io-client";
import { Axios } from "./axiosConfig";


interface CreateResponse {
   success: boolean;
   data: Payment | null;
   error: any | null;
}






class PaymentServices {
   static async getPayments(): Promise<Record<string, Payment>> {
      try {
         const actions = store.getActions().payment
         const value = store.getState().payment.value
         if (Object.values(value).length) {
            return value
         }
         const { data }: { data: Payment[] } = await Axios.get(`/api/payments`);

         this.handleSocket()
         const pay = _arrToObjBy_id(data)
         actions.save(pay)
         return pay
      } catch (error: any) {
         toast.error(error?.response?.data.message)
         throw new Error(error);
      }
   }
   static async createPayment(formData: Payment): Promise<CreateResponse> {
      try {
         const actions = store.getActions().payment
         const { data }: { data: Payment } = await Axios.post(`/api/payments`, formData);
         actions.add(data)
         toast.success(`successfully added ${data.Receipt_no}`)
         return { success: true, data: data, error: null }
      } catch (error: any) {
         toast.error(error?.response?.data.message)
         return { success: false, data: null, error: error?.response.data }

      }
   }
   static async getPaymentsXy(): Promise<XYData[]> {
      try {
         const value = store.getState().payment.xyData
         const action = store.getActions().payment
         if (value.length) {
            return value
         } else {
            const { data } = await Axios.get(`/api/payments/xy`);
            action.saveXY(data)
            return data
         }
      } catch (error: any) {
         toast.error(error?.response?.data.message)
         throw new Error(error);
      }
   }
   static async getPaymentsQuery(query: string): Promise<Record<string, Payment>> {
      const invoiceActions = store.getActions().payment
      const tempData = store.getState().payment.tempData
      try {
         if (tempData[query]) {
            return tempData[query]
         }
         const { data } = await toast.promise(
            Axios.get(`/api/payments/query?${query}`),
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
   static handleSocket() {
      console.log('socket')
      const actions: Actions<PaymentModel> = store.getActions().payment
      try {
         const socket = io(`/api/payments`);
         socket.on("changes", (data) => {
            actions.add(data)
         });
         socket.on("xyData", (data) => {
            actions.saveXY(data)
         });
         socket.on("insert", (data) => {
            actions.add(data)
            console.log('insert', data);
         });
         socket.on("delete", (_id) => {
            console.log('delete', _id);
            actions.delete(_id)
         });
      } catch (error: any) {
         console.log(error)
         toast.error(error?.response?.data.message)
         throw new Error(error);
      }
   }

}

export default PaymentServices;
