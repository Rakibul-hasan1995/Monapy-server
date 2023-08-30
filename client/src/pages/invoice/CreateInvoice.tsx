
import { Controller, useForm } from "react-hook-form";
import Layout from "../../components/Layout"
import { SelectInput, TextInput } from "../../components/inputs/textInput";
import Button from "../../components/buttons/button";
import { useClientState } from "../../store/client";
import * as React from 'react'
import { useOrderValue } from "../../store/order";
import IconButton from "../../components/buttons/iconButton";
import { MinusCircleIcon } from "@heroicons/react/24/outline";
import InvoiceServices from "../../services/api/invoiceServices";
import { _addLeadingZeros } from "../../utils/add-landing-zero";
import moment from "moment";
import { _arrSum } from "../../utils/arrSum";
import { toast } from "react-toastify";

function CreateInvoice() {
   const [loading, setLoading] = React.useState<boolean>(false);
   const [Items, setItems] = React.useState<string[]>([])
   const [orders, setOrders] = React.useState<any[]>([])
   const [client_id, setClient_id] = React.useState<string>('')
   const [ItemsData, setItemsData] = React.useState<any[]>([])
   const [totalAmount, setTotalAmount] = React.useState<any>(0)
   const [invoiceNo, setInvoiceNo] = React.useState<any>('')






   const { value: Clients } = useClientState()
   const { value: OrdersObj } = useOrderValue()
   const clients = Object.values(Clients).map((item) => {
      return {
         key: item.Client_name,
         value: item._id
      }
   })

   React.useEffect(() => {
      if (client_id) {
         const or = Object.values(OrdersObj).filter((item) => item.Client_id == client_id && item.Order_status == 'Complete')
         const modifyOrder = or.map((item) => {
            return {
               key: item.Order_no,
               value: item._id
            }
         })
         setOrders(modifyOrder)
      }
      setItems([])

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [OrdersObj, client_id])

   React.useEffect(() => {
      getCount()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   React.useEffect(() => {
      const data = Items?.map((item) => {
         return {
            _id: item,
            Order_no: OrdersObj[item]?.Order_no || '',
            Item_avatar: OrdersObj[item]?.Item_avatar || '',
            Order_qty: OrdersObj[item]?.Order_qty || 0,
            Order_rate: OrdersObj[item]?.Order_rate || 0,
            amount: parseInt(OrdersObj[item]?.Order_rate) * OrdersObj[item]?.Order_qty || 0
         }
      })
      setItemsData(data)
   }, [Items, OrdersObj])

   React.useEffect(() => {
      const amount = _arrSum(ItemsData, 'amount')
      setTotalAmount(amount)

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [ItemsData])

   const {
      control,
      // setError,
      handleSubmit,
      // reset,
      // setValue,
      // getValues,
      formState: { errors },
   } = useForm({
      defaultValues: {
         Invoice_date: new Date(),
         Client_id: "",
         Discount: 0,
      },
   });
   const getCount = async () => {
      const data = await InvoiceServices.getInvoiceCount()
      const invoiceNo = `inv-${moment().format('YY')}-${_addLeadingZeros(data + 76, 2)}`
      setInvoiceNo(invoiceNo)
   }


   const handleRemove = (_id: string) => {
      const item = Items.filter((x) => x !== _id)
      setItems(item)

      const removeItem = {
         key: OrdersObj[_id].Order_no,
         value: OrdersObj[_id]._id
      }
      setOrders((prev) => [...prev, removeItem])
   }
   // const submit = async (data: any) => {
   //    try {
   //       const formData = { ...data, Items }
   //       InvoiceServices.createInvoice(formData)
   //    } catch (error) {
   //       console.log(error)
   //    }
   // }
   const submit = async (data: any) => {
      try {
         setLoading(true)
         const formData = {
            ...data,
            Invoice_amount: totalAmount,
            Invoice_no: invoiceNo,
            Items: [...Items]
         }
   
         const { success, error, } = await InvoiceServices.createInvoice(formData)
         setLoading(false)
         if (!success && Object.keys(error).length) {
            return Object.keys(error).forEach((key: any) =>
              toast.error(error[key])
            );
         }
      } catch (error) {
         console.log(error)
      }

   }

   return (
      <Layout title="Create Invoice" active="Invoices">
         <div className="container min-h-full p-5 max-w-3xl mx-auto 
       bg-base-lt dark:bg-base-dark">

            <form onSubmit={handleSubmit(submit)}>
               <div className="flex flex-wrap">

                  <div className="w-full sm:w-1/2 my-2">
                     <Controller
                        rules={{
                           required: {
                              value: true,
                              message: "Please Enter Order_date",
                           },
                        }}
                        control={control}
                        name={'Invoice_date'}
                        render={({ field }) => (
                           <TextInput
                              error={errors?.Invoice_date?.message}
                              type="date"
                              label={"Date"}
                              placeholder={"Enter Date"}
                              {...field}
                           />
                        )}
                     />
                  </div>

                  <div className="w-full sm:w-1/2 my-2">
                     <Controller
                        rules={{
                           required: {
                              value: true,
                              message: "Please Enter Discount",
                           },
                        }}
                        control={control}
                        name={'Discount'}
                        render={({ field }) => (
                           <TextInput
                              error={errors?.Discount?.message}
                              type="number"
                              label={"Discount"}
                              placeholder={"Enter Discount"}
                              {...field}
                           />
                        )}
                     />
                  </div>

                  <div className="w-full sm:w-1/2 my-2">
                     <Controller
                        rules={{
                           required: {
                              value: false,
                              message: "Please Enter Order_date",
                           },
                        }}
                        control={control}
                        name={'Client_id'}
                        render={({ field }) => (
                           <SelectInput
                              error={errors?.Client_id?.message}
                              label={"Select Client"}
                              optionDataArr={clients}
                              placeholder={"Select Client"}
                              {...field}
                              onChange={(e) => {
                                 const value = e.target.value
                                 field.onChange(value)
                                 setClient_id(value)
                              }}
                           />
                        )}
                     />
                  </div>
                  <div className="w-full sm:w-1/2 my-2">
                     <SelectInput
                        label={"Select Orders"}
                        optionDataArr={orders}
                        placeholder={"Select Orders"}
                        onChange={(e) => {
                           const value = e.target.value;
                           setItems((items) => [...items, value])
                           const or = orders?.filter((it) => it.value !== value)
                           setOrders(or)
                        }} value={''} name={""}
                     />
                  </div>

               </div>
               <p>Invoice No : {invoiceNo} </p>
               <p>Invoice Amount : {totalAmount} </p>
               <table className="w-full ">
                  <thead>
                     <tr>
                        <td className="text-center border-[0.5px] border-gray-500 p-1 font-bold">Order</td>
                        <td className="text-center border-[0.5px] border-gray-500 p-1 font-bold">Design</td>
                        <td className="text-center border-[0.5px] border-gray-500 p-1 font-bold">Qty</td>
                        <td className="text-center border-[0.5px] border-gray-500 p-1 font-bold">Rate</td>
                        <td className="text-center border-[0.5px] border-gray-500 p-1 font-bold">Amount</td>
                        <td className="text-center border-[0.5px] border-gray-500 p-1 font-bold">Action</td>
                     </tr>
                  </thead>
                  <tbody>
                     {ItemsData.map((item, i) => (
                        <tr key={i}>
                           <td className="text-center border-[0.5px] border-gray-500 p-1 w-[25%]">{item.Order_no}</td>
                           <td className="text-center border-[0.5px] border-gray-500 p-1  w-[20%]">
                              {item.Item_avatar && <img className="mx-auto" width={60} src={item.Item_avatar} alt="des" />}
                           </td>
                           <td className="text-center border-[0.5px] border-gray-500 p-1 w-[20%]">{item.Order_qty}</td>
                           <td className="text-center border-[0.5px] border-gray-500 p-1 w-[15%]">{item.Order_rate}</td>
                           <td className="text-center border-[0.5px] border-gray-500 p-1 w-[20%]">{item.amount}</td>
                           <td className="text-center border-[0.5px] border-gray-500 p-1 w-[20%]">
                              {<IconButton classNames="w-7 h-7 text-red-500" icon={<MinusCircleIcon />} onClick={() => handleRemove(item._id)} />}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
               {/* <button  type="submit">Save</button> */}
               <Button
                  disabled={loading || Boolean(Object.keys(errors).length)}
                  type="submit"
                  title={loading ? 'Processing' : "Save"}
                  classNames="sm:mt-5 md:mt-10"
               />
            </form>
         </div>
      </Layout>
   )
}

export default CreateInvoice