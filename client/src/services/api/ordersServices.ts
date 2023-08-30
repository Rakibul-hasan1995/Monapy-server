/* eslint-disable no-constant-condition */
import store from "../../store/store";
import io from "socket.io-client";
import { Order, OrderModel } from "../../store/order";
import { Actions } from "easy-peasy";
import { _arrToObjBy_id } from "../../utils/arrToObj";
import { toast } from "react-toastify";
import { Axios } from "./axiosConfig";


interface CreateResponse {
   success: boolean;
   data: Order | null;
   error: any | null;
}

class OrderServices {
   static async getOrders(): Promise<Record<string, Order>> {
      try {
         const actions = store.getActions().order
         const value = store.getState().order.value
         if (Object.values(value).length) {
            console.log('order found')
            return value
         } else {
            const { data } = await Axios.get(`/api/orders`);
            this.handleSocket()
            const value = _arrToObjBy_id(data)
            actions.save(value)
            return value
         }
      } catch (error: any) {
         toast.error(error?.response?.data?.message)
         throw new Error(error);
      }
   }

   static async createOrder(orderData: Order | any): Promise<CreateResponse> {
      try {
         const token = localStorage.getItem('access_token')
         // const res = await fetch(`/api/orders`, {
         //    method: 'POST',
         //    headers: {
         //       'access_token': token,
         //       'Content-Type': 'application/json'
         //     },
         //    body: orderData
         // })
         const res = await fetch(`/api/orders`, {
            method: 'POST',
            headers: {
              'access_token': `${token}`,
            },
            body: orderData
          });
         if (res.ok) {
            const data = await res.json()
            toast.success(`successfully create order ${data.Order_no} `)
            return { success: true, data: data, error: null }
         } else {
            const error = await res.json()
            toast.success(`error in create order`)
            return { success: false, data: null, error: error }
         }
      } catch (error: any) {
         toast.error('Something went wrong')
         throw new Error(error);
      }
   }

   static async cloneOrder(_id: string): Promise<Order> {
      try {
         const actions = store.getActions().order
         const { data }: { data: Order } = await Axios.get(`/api/orders/clone?_id=${_id}`);
         actions.add(data)
         toast.success(`Successfully Clone ${data.Order_no}`)
         return data;
      } catch (error: any) {
         toast.error(error?.response?.data?.message)
         throw new Error(error);
      }
   }

   static async updateOrder(updatedData: Order): Promise<Order> {
      try {
         // const actions = store.getActions().order
         const { data } = await Axios.put(`/api/orders`, updatedData);
         // actions.add(data)
         toast.success(`Successfully Update ${data.Order_no}`)
         return data;
      } catch (error: any) {
         toast.error(error?.response?.data?.message)
         throw new Error(error);
      }
   }

   static async deleteOrder(_id: string): Promise<{ success: boolean }> {
      try {
         const actions = store.getActions().order
         await Axios.delete(`/api/orders/${_id}`)
         actions.delete(_id)
         toast.success(`Successfully Delete Order`)
         return { success: true }
      } catch (error: any) {
         toast.error(error?.response?.data?.message)
         throw new Error(error);
      }
   }

   static async getOrdersWithQuery(query: string): Promise<Record<string, Order>> {
      const tempData = store.getState().order.tempData
      const orderActions = store.getActions().order
      try {
         if (tempData[query]) {
            return tempData[query]
         }
         const { data } = await Axios.get(`/api/orders/query?${query}`)
         const obj = {
            value: _arrToObjBy_id(data),
            key: query
         }
         orderActions.saveTempData(obj)
         setTimeout(() => {
            orderActions.delTempData(query)
         }, 5 * 60 * 1000);
         return obj.value
      } catch (error: any) {
         toast.error(error?.response?.data?.message)
         throw new Error(error);
      }
   }

   static async getOrdersWithQueryWith_id(_id: string): Promise<Record<string, Order>> {
      const tempData = store.getState().order.tempData
      const orderActions = store.getActions().order
      try {
         if (tempData[_id]) {
            return tempData[_id]
         }
         const { data } = await toast.promise(
            Axios.get(`/api/orders/query?_id=${_id}`),
            {
               pending: 'Loading Data',
               success: 'Loading Success',
               error: 'Error'
            }
         )
         const obj = {
            value: { [data._id]: { ...data } },
            key: _id
         }
         orderActions.saveTempData(obj)
         setTimeout(() => {
            orderActions.delTempData(_id)
         }, 5 * 60 * 1000);
         return data
      } catch (error: any) {
         toast.error(error?.response?.data?.message)
         throw new Error(error);
      }
   }

   static handleSocket() {
      const actions: Actions<OrderModel> = store.getActions().order
      try {
         const socket = io(`/api/order`);
         socket.on("changes", (data) => {
            actions.add(data)
            actions.updateTempData(data)
            console.log('update', data._id);
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
         toast.error(error?.response?.data?.message)
         throw new Error(error);
      }
   }

}

export default OrderServices;
