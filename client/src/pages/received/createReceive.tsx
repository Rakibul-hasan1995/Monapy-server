import moment from "moment";
import Layout from "../../components/Layout";
import Card from "../../components/card/card";
import ChalanForm from "../../components/forms/chalan";
import { Receive, useReceiveState } from "../../store/receive";
import ReceiveServices from "../../services/api/receivedServices";
import { useEffect, useState } from "react";
import { _arrShortByKey } from "../../utils/arrSort";
import { Link } from "react-router-dom";

export default function CreateReceive() {
   const [initialValue, setInitialValues] = useState({ date: new Date(), chalanNo: '', Client_id: '', Order_id: '', qty: 0 })
   const [receives, setReceives] = useState<Receive[]>([])
   const { value } = useReceiveState()
   useEffect(() => {
      const rec = Object.values(value)
      const sorted = _arrShortByKey(rec, 'createdAt', false)
      setReceives(sorted)
   }, [value])


   const handleSubmit = async (data: any, CB: (arg0: { success: boolean; error?: any }) => void) => {
      const value = getRenameKey(data)
      const res = await ReceiveServices.createReceive(value)
      const { success, error } = res
      if (success) {
         setInitialValues(data)
         return CB({ success })
      }
      if (!success && error) {
         const err = renameKey(error)
         return CB({ success: false, error: err })
      }
   }
   return (
      <Layout title="Create Receive">
         <div className="flex flex-wrap">
            {/* <div className="grid grid-cols-2 gap-4 h-[calc(100vh-85px)]"> */}
            <div className="w-full md:w-[65%]">
               <ChalanForm initialValues={initialValue} submit={handleSubmit} />
            </div>
            <Card className="overflow-y-scroll w-full ml-3 md:w-[33%] h-[calc(100vh-85px)]">
               <div className="w-full">
                  {receives?.map((item, i) => (
                     <div className="p-2 border-b border-b-gray-500 flex justify-between align-middle" key={i}>
                        <div className="w-[40%]">
                           <strong>{item?.Order_id?.Order_no}</strong>
                           <p className="text-xs py-2"><Link className="font-bold" to={`/rbs/v2/clients/${item.Client_id._id}/profile`}>{item.Client_id.Client_name}</Link></p>
                           <p>Date: {moment(item.Receive_date).format("DD-MMM-yy")}</p>
                        </div>
                        <div className="w-[20%]">
                           <img width={100} src={item.Order_id.Item_avatar} alt="Design" />
                        </div>
                        <div className="w-[40%] self-center text-right">
                           <strong>QTY: {item.Receive_qty} Pcs</strong>
                           <p className="text-xs pt-2">CH NO: {item.Receive_ch_no}</p>
                        </div>
                     </div>
                  ))}

               </div>
            </Card>

         </div>
      </Layout>
   )
}



const renameKey = (data: any) => {

   const err: any = {}
   Object.keys(data).forEach((key) => {
      if (key == 'Receive_ch_no') {
         return err['chalanNo'] = data[key]
      }
      if (key == 'Receive_date') {
         return err['date'] = data[key]
      }
      if (key == 'Receive_qty') {
         return err['qty'] = data[key]
      }
      return err[key] = data[key]
   })
   return err
}
const getRenameKey = (data: any) => {

   const err: any = {}
   Object.keys(data).forEach((key) => {
      if (key == 'chalanNo') {
         return err['Receive_ch_no'] = data[key]
      }
      if (key == 'date') {
         return err['Receive_date'] = data[key]
      }
      if (key == 'qty') {
         return err['Receive_qty'] = data[key]
      }
      return err[key] = data[key]
   })
   return err
}