import { Controller, useForm } from "react-hook-form";
import { TextInput } from "../../components/inputs/textInput";
import Button from "../../components/buttons/button";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import AuthServices from "../../services/api/authServices";
import { useNavigate } from "react-router-dom";

export default function Login() {

   const navigate = useNavigate()

   const {
      control,
      setError,
      handleSubmit,
      // reset,
      // setValue,

      formState: { errors },
   } = useForm({
      defaultValues: {
         User_email: '',
         User_password: '',
      },
   });
   const onSubmit = async (data: any) => {
      try {
         const res = await AuthServices.userLogin(data)
         const { success } = res
         if (success) {
            setTimeout(() => {
               return navigate('/rbs/v2/dashboard')
            }, 500);
         }
         if (!success) {
            setError('User_email', { type: 'custom', message: '' })
            setError('User_password', { type: 'custom', message: '' })
         }
      } catch (error) {
         console.log(error)
      }
   }


   return (
      <div className=" bg-base-dark h-screen w-screen m-0  ">
         <div className="max-w-xl mx-auto bg-base-light min-h-screen p-10">
            <h4 className="text-xl font-semibold text-center p-3 ">Login</h4>
            <div className="icon flex justify-center rounded-full border-red-400 border-2 p-2">
               <LockClosedIcon className="w-16 h-16 " />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>

               <div className="w-full  my-2">
                  <Controller
                     rules={{
                        required: {
                           value: true,
                           message: "Please enter Email",
                        },
                     }}
                     control={control}
                     name='User_email'
                     render={({ field }) => (
                        <TextInput
                        autoComplete="User_email"
                           error={errors?.User_email?.message}
                           type="email"
                           label={"Email"}
                           placeholder={"Enter Email"}
                           {...field}
                        />
                     )}
                  />
               </div>
               <div className="w-full  my-2">
                  <Controller
                     rules={{
                        required: {
                           value: true,
                           message: "Please enter Password",
                        },
                     }}
                     control={control}
                     name='User_password'
                     render={({ field }) => (
                        <TextInput
                        autoComplete="off"
                           error={errors?.User_password?.message}
                           type="password"
                           label={"Password"}
                           placeholder={"Enter Password"}
                           {...field}
                        />
                     )}
                  />
               </div>
               <Button type="submit" classNames="mt-5" title='Login' />
            </form>

         </div>
      </div>
   )
}
