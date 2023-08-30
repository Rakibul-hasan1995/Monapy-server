
import store from "../../store/store";
import { toast } from "react-toastify";
import { Actions } from "easy-peasy";
import { io } from "socket.io-client";
import { GroupXYData, Production, ProductionModel } from "../../store/production";
import { _arrToObjBy_id } from "../../utils/arrToObj";
import { Axios } from "./axiosConfig";



class ProductionServices {
   static async getProductions(): Promise<Record<string, Production>> {
      try {
         const value = store.getState().production.value

         if (Object.values(value).length) {

            return value
         } else {
            const actions = store.getActions().production

            const { data } = await Axios.get(`/api/production`);
            actions.save(_arrToObjBy_id(data))

            this.handleSocket()
            return data
         }
      } catch (error: any) {
         toast.error(error?.response?.message)
         throw new Error(error);
      }
   }
   static async getProductionQuery(query: string): Promise<Record<string, Production>> {

      const temAction = store.getActions().temp
      const tempData = store.getState().temp.value
      const tempKey = 'productionQuery' + query
      try {
         if (tempData[tempKey]) {
            return JSON.parse(tempData[tempKey])
         }
         const { data } = await toast.promise(
            Axios.get(`/api/production/query?${query}`),
            {
               pending: 'Loading Data',
               success: 'Loading Success',
               error: 'Error'
            }
         )
         temAction.save({ [tempKey]: JSON.stringify(data) })
         setTimeout(() => {
            temAction.delete(tempKey)
         }, 5 * 60 * 1000);
         return data
      } catch (error: any) {
         toast.error(error?.response?.message)
         throw new Error(error);
      }
   }
   static async getProductionQueryByOrder_id(Order_id: string): Promise<Record<string, Production>> {
      const temAction = store.getActions().temp
      const tempData = store.getState().temp.value
      const query = 'Production' + Order_id
      try {
         if (tempData[query]) {
            return JSON.parse(tempData[query])
         }
         const { data } = await toast.promise(
            Axios.get(`/api/production/by-order/${Order_id}`),
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
   static async getProductionXY(): Promise<GroupXYData[]> {
      try {
         const value = store.getState().production._groupDataXY
         const actions = store.getActions().production
         if (value.length) {
            return value
         } else {
            const { data } = await Axios.get(`/api/production/group-by-day`)
            actions.saveGroupData(data)
            return data
         }
      } catch (error: any) {
         toast.error(error?.response?.message)
         throw new Error(error);
      }
   }

   static handleSocket() {
      const actions: Actions<ProductionModel> = store.getActions().production
      try {
         const socket = io(`/api/production`);
         socket.on("changes", (data) => {
            actions.update(data)
            console.log('update', data._id);
         });
         socket.on("insert", (data) => {
            actions.add(data)
            console.log('insert', data);
         });
         socket.on("delete", (_id) => {
            console.log('delete', _id);
            // actions.delete({ _id })
         });
         socket.on("xyData", (data) => {
            actions.saveGroupData(data)
         });
      } catch (error: any) {
         toast.error(error?.response?.data?.message)
         throw new Error(error);
      }
   }
}
export default ProductionServices