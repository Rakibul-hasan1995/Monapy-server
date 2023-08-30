import { action, Action, thunk, Thunk } from "easy-peasy";
import { useStoreState } from "./store";
import OrderServices from "../services/api/ordersServices";
import * as React from 'react'

export interface Order {
   _id: string;
   Order_no: string;
   Order_date: Date;
   Order_qty: number;
   Order_rate: string;
   Order_sl: number;
   Order_status: "Complete" | 'Placed' | "Processing" | 'Hold' | "Invoiced" | "Reject" | "Sub-Contact";
   Order_description?: string;
   Client_id: string;
   Client_name?: string;
   ProductionQty?: number;
   stitch?: number;
   Item_avatar: string;
   deliveredQty?: number;
   receivedQty?: number;
}

export interface TempData {
   value: Record<string, Order>;
}

export interface OrderModel {
   value: Record<string, Order>;
   loading: boolean;
   add: Action<OrderModel, Order>;
   update: Action<OrderModel, { _id: string, updateData: any }>;
   save: Action<OrderModel, Order | any>;
   saveTempData: Action<OrderModel, TempData | any>;
   delete: Action<OrderModel, string>;
   fetch: Thunk<OrderModel>;
   tempData: Record<string, Record<string, Order>>;
   delTempData: Action<OrderModel, string>;
   updateTempData: Action<OrderModel, any>;
}

const orderModel: OrderModel = {
   value: {},
   tempData: {},
   loading: true,
   save: action((state, payload) => {
      state.value = { ...payload }
      state.loading = false
   }),
   add: action((state, payload) => {
      state.value[payload._id] = payload;
   }),
   update: action((state, payload) => {
      const { _id, updateData } = payload
      const oldData = state.value[_id]
      state.value[_id] = { ...oldData, ...updateData }
   }),
   delete: action((state, _id) => {
      const item = state.value[_id]
      if (item) {
         delete state.value[_id]
      }
   }),
   fetch: thunk(async (actions) => {
      try {
         const data = await OrderServices.getOrders()
         actions.save(data);
      } catch (error) {
         console.log({ error });
      }
   }),
   saveTempData: action((state, payload) => {
      const { key, value } = payload
      state.tempData[key] = { ...value };
   }),
   delTempData: action((state, key) => {
      const item = state.tempData[key]
      if (item) {
         delete state.tempData[key]
      }
   }),
   updateTempData: action((state, data) => {
      try {
         const _id = data._id
         
         if (state.tempData[_id] && state.tempData[_id][_id]) {
            const orderToUpdate = state.tempData[_id][_id]
            state.tempData[_id][_id] = { ...orderToUpdate, ...data }
            console.log(state.tempData[_id][_id])
         } else {
            console.log('Order not found');
         }
      } catch (error) {
         console.log(error)
      }
   }),
};
export default orderModel


export const useOrderState = () => {
   const state = useStoreState((state) => state.order)
   const loading = state.loading
   const tempData = state.tempData
   return { loading, tempData, }
};

export const useOrderValue = () => {
   const state = useStoreState((state) => state.order)
   const value = state.value
   React.useEffect(() => {
      if (!Object.keys(value).length) {
         OrderServices.getOrders()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   return { value }
};
