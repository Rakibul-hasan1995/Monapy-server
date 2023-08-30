import { Controller, useForm } from 'react-hook-form';
import Layout from '../../components/Layout';
import { SelectInput, TextInput } from '../../components/inputs/textInput';
import { useClientState } from '../../store/client';
import Button from '../../components/buttons/button';
import PaymentServices from '../../services/api/paymentServices';
import { toast } from 'react-toastify';

export default function CreatePayment() {
   const { value } = useClientState()
   const clients = Object.values(value).map((item) => {
      return {
         key: item.Client_name,
         value: item._id
      }
   })

   const modes = [
      { key: 'Cheque', value: 'Cheque' },
      { key: 'Cash', value: 'Cash' },
      { key: 'Mobile Banking', value: 'Mobile Banking' },
      { key: 'LC', value: 'LC' },
      { key: 'Settlement', value: 'Settlement' },
   ]

   const {
      control,
      setError,
      handleSubmit,
      reset,
      // setValue,

      formState: { errors },
   } = useForm({
      defaultValues: {
         Payment_date: new Date(),
         Client_id: "",
         Receipt_no: "",
         Payment_description: "",
         Payment_mode: "Cash",
         Receive_amount: 0,
      },
   });


   const submit = async (data: any) => {
      try {
         const { success, error, data: resData } = await PaymentServices.createPayment(data)
         if (!success && Object.keys(error).length) {
            return Object.keys(error).forEach((key: any) => {
               setError(key, { type: 'custom', message: error[key] })
            }
            );
         } else if (success) {
            reset({
               Receipt_no: String(parseInt(resData?.Receipt_no || '') + 1),
               Payment_date: resData?.Payment_date
            })
         }
      } catch (error) {
         console.log(error)
         toast.error('error')
      }
   }

   return (
      <Layout title="Create Payments" active="Payments">
         <div className=" rounded-md mt-5 p-5 max-w-3xl mx-auto 
         bg-base-lt dark:bg-base-dark">
            <form onSubmit={handleSubmit(submit)}>
               <div className="flex flex-wrap">
                  <div className="w-full sm:w-1/2 my-2">
                     <Controller
                        rules={{
                           required: {
                              value: true,
                              message: "Please Enter Date",
                           },
                        }}
                        control={control}
                        name={"Payment_date"}
                        render={({ field }) => (
                           <TextInput
                              error={errors?.Payment_date?.message}
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
                              value: false,
                              message: "Please Select client",
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
                           />
                        )}
                     />
                  </div>
                  <div className="w-full sm:w-1/2 my-2">
                     <Controller
                        rules={{
                           required: {
                              value: true,
                              message: "Please Enter Money Receipt No",
                           },
                        }}
                        control={control}
                        name={"Receipt_no"}
                        render={({ field }) => (
                           <TextInput
                              error={errors?.Receipt_no?.message}
                              type="number"
                              label={"Money Receipt No"}
                              placeholder={"Enter Money Receipt No"}
                              {...field}
                           />
                        )}
                     />
                  </div>

                  <div className="w-full sm:w-1/2 my-2">
                     <Controller
                        control={control}
                        name={"Payment_description"}
                        render={({ field }) => (
                           <TextInput
                              error={errors?.Payment_description?.message}
                              type="text"
                              label={"Description"}
                              placeholder={"Enter Description"}
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
                              message: "Please Select Mode",
                           },
                        }}
                        control={control}
                        name={"Payment_mode"}
                        render={({ field }) => (
                           <SelectInput
                              error={errors?.Payment_mode?.message}
                              label={"Select Mode"}
                              optionDataArr={modes}
                              placeholder={"Select Mode"}
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
                              message: "Please Enter Amount",
                           },
                        }}
                        control={control}
                        name={"Receive_amount"}
                        render={({ field }) => (
                           <TextInput
                              error={errors?.Receive_amount?.message}
                              type="number"
                              label={"Amount"}
                              placeholder={"Enter Received Amount"}
                              {...field}
                           />
                        )}
                     />
                  </div>

               </div>
               {/* <button  type="submit">Save</button> */}
               <Button
                  type="submit"
                  title="Save"
                  classNames="sm:mt-5 md:mt-10"
               />
            </form>
         </div>
      </Layout>
   )
}
