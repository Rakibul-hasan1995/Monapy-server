import { Schema, model, Document } from 'mongoose';

interface IClient extends Document {
    Client_name: string;
    Client_phone: string;
    Client_address: string;
    Client_email: string;
    OpeningBalance: number;
}

const clientSchema = new Schema<IClient>({
    Client_name: String,
    Client_phone: String,
    Client_address: String,
    Client_email: String,
    OpeningBalance: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Client = model<IClient>('Client', clientSchema);

export default Client;



export interface ClientInterface {
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
 