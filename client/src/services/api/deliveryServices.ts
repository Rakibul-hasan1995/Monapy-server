import store from "../../store/store";
import { _arrToObjBy_id } from "../../utils/arrToObj";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { Delivery } from "../../store/delivery";
import { Axios } from "./axiosConfig";


interface CreateResponse {
   success: boolean;
   data: Delivery | null;
   error: any | null;
}

class DeliveryServices {
   static async getDelivery(): Promise<Record<string, Delivery>> {
      try {
         const actions = store.getActions().delivery
         const value = store.getState().delivery.value
         if (Object.values(value).length) {
            return value
         }
         const { data }: { data: Delivery[] } = await Axios.get(`/api/del-goods`);
         this.handleSocket()
         const del = _arrToObjBy_id(data)
         actions.save(del)
         return del
      } catch (error: any) {
         toast.error(error?.response?.data.message)
         throw new Error(error);
      }
   }
   static async createDelivery(formData: Delivery): Promise<CreateResponse> {
      try {
         const actions = store.getActions().delivery
         const { data }: { data: Delivery } = await Axios.post(`/api/del-goods`, formData);
         actions.add(data)
         toast.success(`successfully added ${data.Delivery_ch_no}`)
         return { success: true, data: data, error: null }
      } catch (error: any) {
         toast.error('Something went wrong')
         return { success: false, data: null, error: error?.response.data }

      }
   }
   static async updateDelivery(formData: Delivery): Promise<CreateResponse> {
      try {
         const actions = store.getActions().delivery
         const { data }: { data: Delivery } = await Axios.put(`/api/del-goods`, formData);
         actions.add(data)
         toast.success(`successfully added ${data.Delivery_ch_no}`)
         return { success: true, data: data, error: null }
      } catch (error: any) {
         toast.error('Something went wrong')
         return { success: false, data: null, error: error?.response.data }

      }
   }

   static async getDelQuery(query: string): Promise<Record<string, Delivery>> {
      const temAction = store.getActions().temp
      const tempData = store.getState().temp.value
      try {
         if (tempData[query]) {
            return JSON.parse(tempData[query])
         }
         const { data } = await toast.promise(
            Axios.get(`/api/del-goods/query?${query}`),
            {
               pending: 'Loading Data',
               success: 'Loading Success',
               error: 'Error'
            }
         )

         temAction.save({ [query]: JSON.stringify(data) })
         setTimeout(() => {
            temAction.delete(query)
         }, 5 * 60 * 1000);
         return data
      } catch (error: any) {
         toast.error(error?.response?.message)
         throw new Error(error);
      }
   }
   static handleSocket() {
      const actions = store.getActions().delivery
      const orderAction = store.getActions().order
      const orders = store.getState().order
      try {
         const socket = io(`/api/del-goods`);
         socket.on("changes", (data) => {
            actions.update(data)
         });
         socket.on("insert", (data) => {
            actions.add(data)
            const or = orders?.value[data.Order_id._id]
            console.log(or)
            if (or) {
               console.log('update')
               orderAction.update({ _id: data.Order_id._id, updateData: { deliveredQty: or.deliveredQty + data.Delivery_qty } })
            }
         });
         socket.on("delete", (_id) => {
            console.log('delete', _id);
            actions.delete({ _id })
         });
      } catch (error: any) {
         console.log(error)
         toast.error(error?.response?.data.message)
         throw new Error(error);
      }
   }

}

export default DeliveryServices;
