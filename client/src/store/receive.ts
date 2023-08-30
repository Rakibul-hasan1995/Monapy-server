import { action, Action, thunk, Thunk } from "easy-peasy";
import { useStoreState } from "./store";

import { useEffect } from "react";
import ReceiveServices from "../services/api/receivedServices";
import { Axios } from "../services/api/axiosConfig";

export interface Receive {
   _id: string;
   Client_id: {
      _id: string;
      Client_name: string
   };
   Receive_ch_no: string;
   Receive_date: string;
   Receive_qty: number;
   Order_id: {
      _id: string;
      Order_no: string;
      Item_avatar: string;
   };
}

interface Update {
   _id: string;
   newData: Receive;
}

export interface ReceiveModel {
   value: Record<string, Receive>;
   add: Action<ReceiveModel, any>;
   save: Action<ReceiveModel, any>;
   update: Action<ReceiveModel, Update>;
   edit: Thunk<ReceiveModel, Update>;
   delete: Action<ReceiveModel, { _id: string }>;
}

const receiveModel: ReceiveModel = {
   value: {},
   save: action((state, payload) => {
      state.value = { ...payload }
   }),
   add: action((state, payload) => {
      state.value[payload._id] = payload;
   }),
   update: action((state, payload) => {
      const { _id, newData } = payload
      const item = state.value[_id]
      state.value[_id] = { ...item, ...newData };
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

export default receiveModel

export const useReceiveState = () => {
   const state = useStoreState((state) => state.receive)
   const value = state.value

   useEffect(() => {
      ReceiveServices.getReceived()
   }, [])

   return { value }
};
