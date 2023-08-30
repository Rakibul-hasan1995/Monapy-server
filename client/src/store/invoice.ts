
import { action, Action, thunk, Thunk } from "easy-peasy";
import {  useStoreState } from "./store";
import React from "react";
import { Order } from "./order";
import InvoiceServices from "../services/api/invoiceServices";
import { getCurrentMonthData, getLast30DaysData } from "../utils/groupingData";
import { _arrSum } from "../utils/arrSum";

export interface Invoice {
   _id: string;
   Invoice_date: string;
   Invoice_no: string;
   Client_bill_no: string;
   Client_id: {
      _id: string;
      Client_name: string;
      Client_address?: string;
   };
   Invoice_amount: number;
   Discount?: number;
   Items: Order[];
   image?: string;
}

export interface GroupDataXY {
   x: string,
   y: number
}

export interface InvoiceModel {
   value: Record<string, Invoice>;
   _groupDataXY: GroupDataXY[];
   loading: boolean;
   save: Action<InvoiceModel, Invoice | any>;
 
   add: Action<InvoiceModel, Invoice>;
   saveGroup: Action<InvoiceModel, GroupDataXY[]>;
   fetch: Thunk<InvoiceModel>;
   delete: Action<InvoiceModel, string>;
   tempPdf: Record<string, Blob>;
   saveTempPdf: Action<InvoiceModel, { value: Blob, key: string }>;
   delTempPdf: Action<InvoiceModel, string>;
   tempData: Record<string, Record<string, Invoice>>;
   saveTempData: Action<InvoiceModel, { value: Record<string, Invoice>, key: string }>;
   delTempData: Action<InvoiceModel, string>;
}

const invoiceModel: InvoiceModel = {
   value: {},
   tempPdf: {},
   tempData: {},
   loading: true,
   _groupDataXY: [],
   // _groupDataXY: [{ x: new Date, y: 0 }],
   add: action((state, payload) => {
      state.value[payload._id] = payload;
   }),
   save: action((state, payload) => {
      state.value = { ...payload }
      state.loading = false
   }),
   saveGroup: action((state, payload) => {
      state._groupDataXY = payload
   }),
   fetch: thunk(async (actions) => {
      const data = await InvoiceServices.getInvoice()
      actions.save(data);
   }),
   delete: action((state, _id) => {
      const item = state.value[_id]
      if (item) {
         delete state.value[_id]
      }
   }),

   saveTempPdf: action((state, payload) => {
      const { key, value } = payload
      state.tempPdf[key] = value;
   }),
   delTempPdf: action((state, _id) => {
      const item = state.tempPdf[_id]
      if (item) {
         delete state.tempPdf[_id]
      }
   }),
   saveTempData: action((state, payload) => {
      const { key, value } = payload
      state.tempData[key] = { ...value };
   }),
   delTempData: action((state, _id) => {
      const item = state.value[_id]
      if (item) {
         delete state.value[_id]
      }
   }),
};

export default invoiceModel;


export const useInvoiceState = () => {
   const state = useStoreState((state) => state.invoice);
   const loading = state.loading;
   const _groupDataXY = state._groupDataXY
   return { _groupDataXY, loading }
};
export const useInvoiceStateXY = () => {
   React.useEffect(() => {
      InvoiceServices.getInvoiceXY()
   }, [])
   const state = useStoreState((state) => state.invoice);
   const inv_XY = state._groupDataXY

   const invLast30DaysXY = getLast30DaysData(inv_XY);
   const invLast30DaysTotal = _arrSum(invLast30DaysXY, "y");
   const invCurrentMonthXY = getCurrentMonthData(inv_XY);
   const invCurrentMonthTotal = _arrSum(invCurrentMonthXY, "y");

   return { inv_XY, invLast30DaysXY, invLast30DaysTotal, invCurrentMonthXY, invCurrentMonthTotal }
};

export const useInvoiceStateValue = () => {

   const state = useStoreState((state) => state.invoice);
   const value = state.value;
   const getItemBy_id = (_id: string) => {
      const x = value[_id]
      return x
   }
   React.useEffect(() => {
      InvoiceServices.getInvoice()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])
   return { value, getItemBy_id }
};