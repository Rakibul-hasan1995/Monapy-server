/* eslint-disable @typescript-eslint/no-explicit-any */
import { action, Action } from "easy-peasy";
import * as React from "react";
import { useStoreState } from "./store";

import ClientServices from "../services/api/clientServices";

export interface TopClients {
  amount: number;
  Client_id: string;
  Client_name: string
}
export interface Client {
  _id: string,
  Client_address: string,
  Client_email: string,
  Client_name: string,
  Client_phone: string,
  OpeningBalance?: number,
  billAmount?: number,
  createdAt?: Date,
  paymentAmount?: number,
  updatedAt?: Date
}


export interface ClientModel {
  value: Record<string, Client>;
  loading: boolean;
  add: Action<ClientModel, Client>;
  save: Action<ClientModel, Record<string, Client>>;
  delete: Action<ClientModel, string>;
  topClients: TopClients[];
  saveTopClients: Action<ClientModel, TopClients[]>;

}

const clientModel: ClientModel = {
  value: {},
  loading: true,
  topClients: [],
  save: action((state, payload) => {
    state.value = { ...payload }
    state.loading = false
  }),
  add: action((state, payload) => {
    state.value[payload._id] = payload;
  }),
   delete: action((state, client_id) => {
    const item = state.value[client_id]
    if (item) {
      delete state.value[client_id]
    }
  }),
  saveTopClients: action((state, payload) => {

    state.topClients = [...payload]
  }),

};
export default clientModel

export const useClientState = () => {
  const state = useStoreState((state) => state.client)
  const value = state.value
  const loading = state.loading
  React.useEffect(() => {
    ClientServices.getClients()
  }, [])

  return { value, loading }
};

export const useClientStateTopClients = () => {
  React.useEffect(() => {
    ClientServices.getTopClients()
  }, [])

  const state = useStoreState((state) => state.client)
  const topClient = state.topClients

  return { topClient }
};
