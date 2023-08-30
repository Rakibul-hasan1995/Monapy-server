import { action, Action, thunk, Thunk } from "easy-peasy";
import {  useStoreActions, useStoreState } from "./store";

import * as React from 'react'
import { _arrToObjBy_id } from "../utils/arrToObj";
import { getCurrentMonthData, getLast30DaysData } from "../utils/groupingData";
import { _arrSum } from "../utils/arrSum";
import ProductionServices from "../services/api/productionServices";
import { Axios } from "../services/api/axiosConfig";


interface ProductionData {
   Line_no: string;
   Order_no: string;
   Order_id: string;
   Client_name: string;
   Item_unit: string;
   Item_avatar: string;
   Order_rate: number;
   qty: number;
   amount: number;
   remarks: string;
   operator: string;
   _id: string;
}

export interface Production {
   _id: string;
   Production_date: Date;
   Production_shift: string;
   Production_amount: number;
   Production_data: ProductionData[];
}


// interface Production {
//    _id: string;
//    Production_date: string,
//    Production_shift: string,
//    Production_amount: number,
//    Production_data: any,
// }

export interface GroupXYData {
   x: Date;
   y: number;
}


export interface ProductionModel {
   value: Record<string, Production>;
   _groupDataXY: GroupXYData[];
   loading: boolean;
   add: Action<ProductionModel, Production>;
   save: Action<ProductionModel, Production | any>;
   saveGroupData: Action<ProductionModel, GroupXYData | any>;
   update: Action<ProductionModel, Production>;
   edit: Thunk<ProductionModel, Production>;
   fetch: Thunk<ProductionModel>;
   fetchXY: Thunk<ProductionModel>;
}

const productionModel: ProductionModel = {
   value: {},
   _groupDataXY: [],
   loading: true,
   save: action((state, payload) => {
      state.value = { ...payload }
      state.loading = false
   }),
   saveGroupData: action((state, payload) => {
      state._groupDataXY = payload
   }),
   add: action((state, payload) => {
      state.value[payload._id] = payload;
   }),
   update: action((state, payload) => {
      state.value[payload._id] = payload;
   }),
   edit: thunk(async (_actions, payload) => {
      try {
         await Axios.put(`/api/orders`, payload,)
      } catch (error) {
         console.log(error);
      }
   }),

   fetchXY: thunk(async (actions) => {
      try {
         const GroupXYData = await Axios.get(`/api/production/group-by-day`)
         actions.saveGroupData(GroupXYData.data);
      } catch (error) {
         console.log(error);
      }
   }),
   fetch: thunk(async (actions) => {
      try {
         const { data } = await Axios.get(`/api/production`)
         const GroupXYData = await Axios.get(`/api/production/group-by-day`)
         actions.saveGroupData(GroupXYData.data);
         const x = _arrToObjBy_id(data)
         actions.save(x);
      } catch (error) {
         console.log(error);
      }
   }),
};
export default productionModel


export const useProductionActions = () => {
   const actions = useStoreActions((action) => action.production);
   const fetch = actions.fetch
   const fetchXY = actions.fetchXY
   const add = actions.add
   return { fetch, add, fetchXY }
};

export const useProductionState = () => {
   const state = useStoreState((state) => state.production)
   const value = state.value
   const loading = state.loading
   React.useEffect(() => {
      ProductionServices.getProductions()
   }, [])
   return { value, loading }
};

export const useProductionXY = () => {
   React.useEffect(() => {
      ProductionServices.getProductionXY()
   }, [])

   const _groupDataXY = useStoreState((state) => state.production._groupDataXY)
   const prodLast30DaysXY = getLast30DaysData(_groupDataXY);
   const prodLast30DaysTotal = _arrSum(prodLast30DaysXY, "y");
   const prodCurrentMonthXY = getCurrentMonthData(_groupDataXY);
   const prodCurrentMonthTotal = _arrSum(prodCurrentMonthXY, "y");
   return { _groupDataXY, prodLast30DaysXY, prodLast30DaysTotal, prodCurrentMonthXY, prodCurrentMonthTotal }
};
