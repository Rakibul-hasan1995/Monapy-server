import { Schema, model, Document, Types } from 'mongoose';

interface IOrder extends Document {
   Order_no: string;
   Order_date: Date;
   Order_qty: number;
   Order_rate: string;
   Order_sl: number;
   ProductionQty: number;
   stitch: number;
   Order_status: string;
   Order_description: string;
   Item_avatar: string;
   Client_id: Types.ObjectId; // Assuming Client_id is of type string
}

const orderSchema = new Schema<IOrder>({
   Order_no: String,
   Order_date: Date,
   Order_qty: Number,
   Order_rate: String,
   Order_sl: Number,
   ProductionQty: {
      type: Number,
      default: 0
   },
   stitch: {
      type: Number,
      default: 0
   },
   Order_status: {
      type: String,
      default: 'Processing'
   },
   Order_description: String,
   Item_avatar: String,
   Client_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Client'
   },
}, {
   timestamps: true
});

const Order = model<IOrder>('Order', orderSchema);

export default Order;


export interface OrderInterface {
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