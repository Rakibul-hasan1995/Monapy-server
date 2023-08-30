import { Client, ClientModel, TopClients } from "../../store/client";
import store from "../../store/store";
import { toast } from "react-toastify";
import { Actions } from "easy-peasy";
import { io } from "socket.io-client";
import { _arrToObjBy_id } from "../../utils/arrToObj";
import { Axios } from "./axiosConfig";

interface CreateResponse {
   success: boolean;
   data: Client | null;
   error: any | null;
}
export interface StatementData {
   date: string | Date;
   particulars: string;
   page: string;
   debit: number;
   credit: number,
}

export interface Statement {
   debitAmount: number;
   creditAmount: number;
   deuAmount: number;
   data: StatementData[]
}


class ClientServices {
   static async getClients(): Promise<Record<string, Client>> {

      try {
         const value = store.getState().client.value
         const action = store.getActions().client
         if (Object.values(value).length) {
            return value
         } else {
            const { data } = await Axios.get(`/api/clients`);
            const value = _arrToObjBy_id(data)
            action.save(value)
            this.handleSocket()
            return value
         }
      } catch (error: any) {
         toast.error(error?.response?.data?.message || 'error')
         throw new Error(error);
      }
   }
   static async createClient(formData: Client): Promise<CreateResponse> {


      try {
         const actions = store.getActions().client
         const { data }: { data: Client } = await Axios.post(`/api/clients`, formData);
         actions.add(data)
         toast.success(`successfully added ${data.Client_name}`)
         return { success: true, data: data, error: null }
      } catch (error: any) {
         const err = error?.response.data
         Object.keys(err).forEach(key => {
            toast.error(err[key])
         });
         return { success: false, data: null, error: error?.response.data }
      }
   }
   static async getTopClients(): Promise<TopClients[]> {


      try {
         const value = store.getState().client.topClients
         const actions = store.getActions().client
         if (value.length) {
            return value
         } else {
            const { data } = await Axios.get(`/api/clients/top-clients`);
            actions.saveTopClients(data)
            return data
         }
      } catch (error: any) {

         toast.error(error?.response?.data?.message)
         throw new Error(error);
      }
   }
   static async getStatementBy_id(_id: string): Promise<Statement> {
      const key = `clientStatement_id=${_id}`
      try {
         const value = store.getState().temp.value
         const actions = store.getActions().temp
         if (value[key]) {
            return JSON.parse(value[key])
         }

         const { data } = await Axios.get(`/api/clients/statement/${_id}`)
         actions.save({ [key]: JSON.stringify(data) })
         setTimeout(() => {
            actions.delete(key)
         }, 1 * 60 * 1000);
         return data
      } catch (error: any) {
         toast.error(error?.response?.message)
         throw new Error(error);
      }
   }
   static handleSocket() {
      const actions: Actions<ClientModel> = store.getActions().client
      try {
         const socket = io(`/api/client`);
         socket.on("changes", (data) => {
            actions.add(data)
         });
         socket.on("insert", (data) => {
            actions.add(data)
         });
         socket.on("delete", (_id) => {
            actions.delete(_id)
         });
      } catch (error: any) {
         toast.error(error?.response?.data?.message)
         throw new Error(error);
      }
   }
}
export default ClientServices