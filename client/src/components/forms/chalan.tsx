import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { SelectInput, TextInput } from "../inputs/textInput";
import { useClientStateTopClients } from "../../store/client";
import Button from "../buttons/button";
import { useOrderValue } from "../../store/order";

interface Value {
   date: Date | string;
   chalanNo: string;
   Client_id: string;
   Order_id: string;
   qty: number;
}
interface CBresponse {
   success: boolean;
   error?: any
}
interface Chalan {
   initialValues: Value;
   submit: (data: Value, CB: (res: CBresponse) => void) => void
}


const ChalanForm: React.FC<Chalan> = (props) => {
   const { initialValues, submit } = props
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const [imgUrl, setImgUrl] = React.useState('');
   const [Client_id, setClient_id] = React.useState('');


   const { topClient } = useClientStateTopClients()
   const clients = Object.values(topClient).map((item) => {
      return {
         key: item.Client_name,
         value: item.Client_id
      }
   })

   const [loading, setLoading] = React.useState<boolean>(false);

   const [orders, setOrders] = React.useState();

   const { value: ordersObj } = useOrderValue()


   React.useEffect(() => {
      if (Client_id.length) {
         const order: any = Object.values(ordersObj).filter((item) => item.Client_id == Client_id).map((item) => {
            return {
               key: item.Order_no,
               value: item._id
            }
         })
         setOrders(order)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [Client_id, ordersObj])
   React.useEffect(() => {
      if (initialValues?.Client_id?.length) {
         const order: any = Object.values(ordersObj).filter((item) => item.Client_id == initialValues.Client_id).map((item) => {
            return {
               key: item.Order_no,
               value: item._id
            }
         })
         setOrders(order)
         setImgUrl(ordersObj[initialValues?.Order_id]?.Item_avatar)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [initialValues.Client_id])



   const {
      control,
      setError,
      handleSubmit,
      reset,
      setValue,
      formState: { errors },
   } = useForm({
      defaultValues: {
         ...initialValues
      },
   });



   React.useEffect(() => {
      reset(initialValues)
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [initialValues])


   const onSubmit = (data: any) => {
      setLoading(true)
      submit(data, (res) => {
         const { success, error, } = res
         setLoading(false)
         if (!success && Object.keys(error)?.length) {
            return Object.keys(error).forEach((key: any) => {
               setError(key, { type: 'custom', message: error[key] })
            }
            );
         } else {
            setValue('qty', 0)
         }

      })
   }


   return (
      <div
         className="
            rounded-md p-5 max-w-3xl mx-auto 
          bg-base-lt dark:bg-base-dark h-full"
      >
         <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-24 h-24 mx-auto mb-5">
               {imgUrl && <img
                  className="rounded-full w-full h-full"
                  alt="Design"
                  src={imgUrl}
               />}
            </div>
            <div className="flex flex-wrap">
               <div className="w-full sm:w-1/2 my-2">
                  <Controller
                     rules={{
                        required: {
                           value: true,
                           message: "Please enter Date",
                        },
                     }}
                     control={control}
                     name='date'
                     render={({ field }) => (
                        <TextInput
                           error={errors?.date?.message}
                           type="date"
                           label={"Date"}
                           placeholder={"Date"}
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
                           message: "Please enter Chalan No",
                        },
                     }}
                     control={control}
                     name="chalanNo"
                     render={({ field }) => (
                        <TextInput
                           error={errors?.chalanNo?.message}
                           type="number"
                           label={"Chalan NO"}
                           placeholder={"Enter Chalan No"}
                           {...field}
                        />
                     )}
                  />
               </div>
               <div className="w-full  my-2">
                  <Controller
                     rules={{
                        required: {
                           value: false,
                           message: "Please Select Client",
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
                              field.onChange(e)
                              setClient_id(e.target.value)
                           }}
                        />
                     )}
                  />
               </div>
               <div className="w-full sm:w-1/2 my-2">
                  <Controller
                     rules={{
                        required: {
                           value: false,
                           message: "Please Select Order",
                        },
                     }}
                     control={control}
                     name={'Order_id'}
                     render={({ field }) => (
                        <SelectInput
                           error={errors?.Order_id?.message}
                           label={"Select Order"}
                           optionDataArr={orders}

                           placeholder={"Select Order"}
                           {...field}
                           onChange={(e) => {
                              field.onChange(e)
                              setImgUrl(ordersObj[e?.target?.value].Item_avatar)
                           }}
                        />
                     )}
                  />
               </div>

               <div className="w-full sm:w-1/2 my-2">
                  <Controller
                     rules={{
                        required: {
                           value: true,
                           message: "Please Enter Qty",
                        },
                     }}
                     control={control}
                     name={'qty'}
                     render={({ field }) => (
                        <TextInput
                           error={errors?.qty?.message}
                           type="number"
                           label={"Qty"}
                           placeholder={"Enter Qty"}
                           {...field}
                        />
                     )}
                  />
               </div>
            </div>
            <Button
               type="submit"
               title={loading ? 'Processing...' : "Save"}
               disabled={loading}
               classNames="sm:mt-5 md:mt-10"
            />
         </form>
      </div>

   )
}
export default ChalanForm