import { action, Action, thunk, Thunk } from "easy-peasy";
import { useStoreState } from "./store";

import { useEffect } from "react";
import DeliveryServices from "../services/api/deliveryServices";
import { Axios } from "../services/api/axiosConfig";

export interface Delivery {
   _id: string;
   Client_id: {
      _id: string;
      Client_name: string
   };
   Delivery_ch_no: string;
   Delivery_date: string;
   Delivery_qty: number;
   Order_id: {
      _id: string;
      Order_no: string;
      Item_avatar: string;
   };
}

export interface DeliveryModel {
   value: Record<string, Delivery>;
   add: Action<DeliveryModel, any>;
   save: Action<DeliveryModel, any>;
   update: Action<DeliveryModel, Delivery>;
   edit: Thunk<DeliveryModel, Delivery>;
   delete: Action<DeliveryModel, { _id: string }>;
}

const deliveryModel: DeliveryModel = {
   value: {},
   save: action((state, payload) => {
      state.value = { ...payload }
   }),
   add: action((state, payload) => {
      state.value[payload._id] = payload;
   }),
   update: action((state, payload) => {
      const item = state.value[payload._id]
      state.value[payload._id] = { ...item, ...payload };
   }),
   edit: thunk(async (actions, payload) => {
      try {
         const { data } = await Axios.put("/api/order", payload,)
         actions.add(data)
      } catch (error) {
         console.log(error);
      }
   }),
   delete: action((state, payload) => {
      const { _id } = payload
      const item = state.value[_id]
      if (item) {
         delete state.value[_id]
      }
   }),
};

export default deliveryModel

export const useDeliveryState = () => {
   const state = useStoreState((state) => state.delivery)
   const value = state.value
   useEffect(() => {
      DeliveryServices.getDelivery()
   }, [])

   return { value }
};
