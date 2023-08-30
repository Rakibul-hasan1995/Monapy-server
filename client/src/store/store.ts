
import { createStore, createTypedHooks } from "easy-peasy";

import styleModel, { StyleModel } from "./themeStore";
import orderModel, { OrderModel } from "./order";
import clientModel, { ClientModel } from "./client";
import productionModel, { ProductionModel } from "./production";
import invoiceModel, { InvoiceModel } from "./invoice";
import paymentModel, { PaymentModel } from "./payments";
import tempModel, { TempModel } from "./tempStore";
import receiveModel, { ReceiveModel } from "./receive";
import deliveryModel, { DeliveryModel } from "./delivery";

interface StoreModel {
   theme: StyleModel;
   order: OrderModel;
   client: ClientModel;
   production: ProductionModel;
   invoice: InvoiceModel;
   payment: PaymentModel;
   temp: TempModel;
   receive: ReceiveModel
   delivery: DeliveryModel
}
export const storeModel: StoreModel = {
   theme: styleModel,
   order: orderModel,
   client: clientModel,
   production: productionModel,
   invoice: invoiceModel,
   payment: paymentModel,
   temp: tempModel,
   receive: receiveModel,
   delivery: deliveryModel

}

const store = createStore(storeModel);

export default store
const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreState = typedHooks.useStoreState;
export const useStoreDispatch = typedHooks.useStoreDispatch;

