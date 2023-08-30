import * as React from 'react'
import { action, Action, thunk, Thunk } from "easy-peasy";
import { useStoreActions, useStoreState } from "./store";
import { getCurrentMonthData, getLast30DaysData } from '../utils/groupingData';
import { _arrSum } from '../utils/arrSum';
import PaymentServices from '../services/api/paymentServices';

export interface Payment {
   _id: string;
   Payment_date: Date;
   Client_id: {
      _id: string;
      Client_name: string;
   };
   Receipt_no: string;
   Payment_description: string;
   Payment_mode: string;
   Receive_amount: number;
}
export interface XYData {
   x: Date;
   y: number
}

export interface PaymentModel {
   value: Record<string, Payment>;
   xyData: XYData[];
   loading: boolean;
   add: Action<PaymentModel, Payment>;
   save: Action<PaymentModel, Payment | any>;
   delete: Action<PaymentModel, string>;
   fetch: Thunk<PaymentModel>;
   saveXY: Action<PaymentModel, XYData[]>;
   tempData: Record<string, Record<string, Payment>>;
   saveTempData: Action<PaymentModel, { value: Record<string, Payment>, key: string }>;
   delTempData: Action<PaymentModel, string>;

}

const paymentModel: PaymentModel = {
   value: {},
   xyData: [],
   tempData: {},
   loading: true,
   save: action((state, payload) => {
      state.value = payload;
      state.loading = false
   }),
   add: action((state, payload) => {
      state.value[payload._id] = payload;
   }),

   delete: action((state, _id) => {
      const item = state.value[_id]
      if (item) {
         delete state.value[_id]
      }
   }),
   fetch: thunk(async (actions,) => {
      const data = await PaymentServices.getPayments()
      actions.save(data);

   }),
   saveXY: action((state, payload) => {
      state.xyData = payload;
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
export default paymentModel;



export const usePaymentActions = () => {
   const actions = useStoreActions((state) => state.payment);
   const add = actions.add
   const fetch = actions.fetch
   return { add, fetch }
};

export const usePaymentStateValue = () => {
   React.useEffect(() => {
      PaymentServices.getPayments()
     
   }, [])
   const state = useStoreState((state) => state.payment);
   const value = state.value;
   return { value }
};

export const usePaymentState = () => {
   const state = useStoreState((state) => state.payment);
   const loading = state.loading;
   return { loading }
};
export const usePaymentStateXY = () => {
   PaymentServices.getPaymentsXy()
   const state = useStoreState((state) => state.payment);
   const paymentXY = state.xyData

   const payLast30DaysXY = getLast30DaysData(paymentXY);
   const payLast30DaysTotal = _arrSum(payLast30DaysXY, "y");
   const payCurrentMonthXY = getCurrentMonthData(paymentXY);
   const payCurrentMonthTotal = _arrSum(payCurrentMonthXY, "y");

   return { paymentXY, payLast30DaysXY, payLast30DaysTotal, payCurrentMonthXY, payCurrentMonthTotal }



};
