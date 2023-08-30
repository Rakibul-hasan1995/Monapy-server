import Layout from "../../components/Layout";
import { TextInput } from "../../components/inputs/textInput";
import { Controller, useForm } from 'react-hook-form'
import Button from "../../components/buttons/button";
import ClientServices from "../../services/api/clientServices";


export default function CreateClient() {

   const initialValues = {
      Client_name: "",
      Client_phone: '',
      Client_address: '',
      Client_email: ''
   };

   const {
      control,
      setError,
      handleSubmit,
      reset,
      // setValue,

      formState: { errors },
   } = useForm({
      defaultValues: {
         ...initialValues
      },
   });

   const submit = async (data: any) => {
      try {
         const { success, error, } = await ClientServices.createClient(data)
         if (!success && Object.keys(error).length) {
            return Object.keys(error).forEach((key: any) =>
               setError(key, { type: 'custom', message: error[key] }),
            );
         } else if (success) {
            reset()
         }
      } catch (error) {
         console.log(error)
      }

   }


   return (
      <Layout title="Create Order" active="Clients">
         <div className="rounded-md mt-5 p-5 max-w-3xl mx-auto 
       bg-base-lt dark:bg-base-dark">
            <form onSubmit={handleSubmit(submit)}>
               <div className="flex flex-wrap">
                  <div className="w-full sm:w-1/2 my-2">
                     <Controller
                        rules={{
                           required: {
                              value: true,
                              message: "Please enter Client Name",
                           },
                        }}
                        control={control}
                        name="Client_name"
                        render={({ field }) => (
                           <TextInput
                              error={errors?.Client_name?.message}
                              type="text"
                              label={"Client Name"}
                              placeholder={"Enter Name"}
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
                              message: "Please enter Client Phone",
                           },
                        }}
                        control={control}
                        name="Client_phone"
                        render={({ field }) => (
                           <TextInput
                              error={errors?.Client_phone?.message}
                              type="text"
                              label={"Phone"}
                              placeholder={"Enter Phone No"}
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
                              message: "Please enter Client Address",
                           },
                        }}
                        control={control}
                        name={'Client_address'}
                        render={({ field }) => (
                           <TextInput
                              error={errors?.Client_address?.message}
                              type="text"
                              label={"Address"}
                              placeholder={"Enter Address"}
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
                              message: "Please Client Email",
                           },
                        }}
                        control={control}
                        name={'Client_email'}
                        render={({ field }) => (
                           <TextInput
                              error={errors?.Client_email?.message}
                              type="email"
                              label={"Email"}
                              placeholder={"Enter Email"}
                              {...field}
                           />
                        )}
                     />
                  </div>
               </div>

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
