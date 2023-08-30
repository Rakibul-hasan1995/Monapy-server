import moment from "moment";
import Layout from "../../components/Layout";
import Card from "../../components/card/card";
import ChalanForm from "../../components/forms/chalan";
import { useEffect, useState } from "react";
import { _arrShortByKey } from "../../utils/arrSort";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Delivery, useDeliveryState } from "../../store/delivery";
import DeliveryServices from "../../services/api/deliveryServices";
import classNames from "classnames";

export default function UpdateDelivery() {
   const navigate = useNavigate()
   const activePage = useParams()
   const _id = activePage._id || ''
   const [initialValue, setInitialValue] = useState<any>(
      { date: new Date(), chalanNo: '', Client_id: '', Order_id: '', qty: 0 }
   )

   const [delivery, setDelivery] = useState<Delivery[]>([])
   const { value } = useDeliveryState()
   useEffect(() => {
      const del = Object.values(value)
      const sorted = _arrShortByKey(del, 'createdAt', false)
      setDelivery(sorted)

      const data = {
         date: moment(new Date(value[_id]?.Delivery_date)).format('yyyy-MM-DD'),
         chalanNo: value[_id]?.Delivery_ch_no,
         Client_id: value[_id]?.Client_id._id,
         Order_id: value[_id]?.Order_id._id,
         qty: value[_id]?.Delivery_qty
      }
      setInitialValue(data)

   }, [_id, value])


   const handleSubmit = async (data: any, CB: (arg0: { success: boolean; error?: any }) => void) => {
      const value = getRenameKey(data)
      const formData = { ...value, _id }
      const res = await DeliveryServices.updateDelivery(formData)
      const { success, error } = res
      if (success) {
         navigate(-1)
         return CB({ success })
      }
      if (!success && error) {
         const err = renameKey(error)
         return CB({ success: false, error: err })
      }
   }
   return (
      <Layout title={`Update Delivery: ${initialValue.chalanNo}`} active="Delivery">
         <div className="flex flex-wrap">
            {/* <div className="grid grid-cols-2 gap-4 h-[calc(100vh-85px)]"> */}
            <div className="w-full md:w-[65%]">
               <ChalanForm initialValues={initialValue} submit={handleSubmit} />
            </div>
            <Card className="overflow-y-scroll w-full ml-3 md:w-[33%] h-[calc(100vh-85px)]">
               <div className="w-full">
                  {delivery?.map((item, i) => (
                     <div className={classNames({
                        'p-2 border-b border-b-gray-500 flex justify-between align-middle': true,
                        'bg-blue-400': item._id == _id
                     })} key={i}>
                        <div className="w-[40%]">
                           <strong>{item?.Order_id?.Order_no}</strong>
                           <p className="text-xs py-2"><Link className="font-bold" to={`/rbs/v2/clients/${item?.Client_id?._id}/profile`}>{item.Client_id.Client_name}</Link></p>
                           <p>Date: {moment(item.Delivery_date).format("DD-MMM-yy")}</p>
                        </div>
                        <div className="w-[20%]">
                           <img width={100} src={item.Order_id.Item_avatar} alt="Design" />
                        </div>
                        <div className="w-[40%] self-center text-right">
                           <strong>QTY: {item.Delivery_qty} Pcs</strong>
                           <p className="text-xs pt-2">CH NO: {item.Delivery_ch_no}</p>
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
      if (key == 'Delivery_ch_no') {
         return err['chalanNo'] = data[key]
      }
      if (key == 'Delivery_date') {
         return err['date'] = data[key]
      }
      if (key == 'Delivery_qty') {
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
         return err['Delivery_ch_no'] = data[key]
      }
      if (key == 'date') {
         return err['Delivery_date'] = data[key]
      }
      if (key == 'qty') {
         return err['Delivery_qty'] = data[key]
      }
      return err[key] = data[key]
   })
   return err
}