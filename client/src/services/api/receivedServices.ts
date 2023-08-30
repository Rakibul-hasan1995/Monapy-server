
import store from "../../store/store";
import { _arrToObjBy_id } from "../../utils/arrToObj";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { Receive } from "../../store/receive";
import { Axios } from "./axiosConfig";


interface CreateResponse {
   success: boolean;
   data: Receive | null;
   error: any | null;
}






class ReceiveServices {
   static async getReceived(): Promise<Record<string, Receive>> {
      try {
         const actions = store.getActions().receive
         const value = store.getState().receive.value
         if (Object.values(value).length) {
            return value
         }
         const { data }: { data: Receive[] } = await Axios.get(`/api/rec-goods`);
         this.handleSocket()
         const rec = _arrToObjBy_id(data)
         actions.save(rec)
         return rec
      } catch (error: any) {
         toast.error(error?.response?.data.message)
         throw new Error(error);
      }
   }
   static async createReceive(formData: Receive): Promise<CreateResponse> {
      try {
         const actions = store.getActions().receive
         const { data }: { data: Receive } = await Axios.post(`/api/rec-goods`, formData);
        
         actions.add(data)
         toast.success(`successfully added ${data.Receive_ch_no}`)
         return { success: true, data: data, error: null }
      } catch (error: any) {
         toast.error('Something went wrong')
         return { success: false, data: null, error: error?.response.data }

      }
   }
   static async updateReceive(formData: Receive): Promise<CreateResponse> {
      try {
         const actions = store.getActions().receive
         const { data }: { data: Receive } = await Axios.put(`/api/rec-goods`, formData);
         actions.add(data)
         toast.success(`successfully added ${data.Receive_ch_no}`)
         return { success: true, data: data, error: null }
      } catch (error: any) {
         toast.error('Something went wrong')
         return { success: false, data: null, error: error?.response.data }

      }
   }

   static async getRecQuery(query: string): Promise<Record<string, Receive>> {
      const temAction = store.getActions().temp
      const tempData = store.getState().temp.value
      try {
         if (tempData[query]) {
            return JSON.parse(tempData[query])
         }
         const { data } = await toast.promise(
            Axios.get(`/api/rec-goods/query?${query}`),
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
  
      const actions = store.getActions().receive
      try {
         const socket = io(`/api/rec-goods`);
         socket.on("changes", (data) => {
            actions.update(data)
         });
         socket.on("insert", (data) => {
            actions.add(data)
            console.log('insert',data)
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

export default ReceiveServices;
