
import { toast } from "react-toastify";
import { Axios } from "./axiosConfig";

interface LoginData {
   User_name: string;
   User_email: string
}
export interface LoggedInUser {
   User_name: string
   User_id: string
   User_role: string
   User_company_id: string
}

interface LoginRes {
   success: boolean;
   data: LoggedInUser | null;
   error: any
}

class AuthServices {
   static async userLogin(formData: LoginData): Promise<LoginRes> {
      try {
         const { data } = await Axios.post(`/api/user/login`, formData);
         localStorage.setItem('access_token', data.access_token)
         toast.success(`Welcome ${data.user_data.User_name}`)
         return { success: true, data: data, error: null }
      } catch (error: any) {
         const err = error?.response.data
         toast.error(err)
         return { success: false, data: null, error: err }
      }
   }
   static async verifyToken(): Promise<any> {
      try {
         const { data } = await Axios.get(`/api/user/verify-token`);
         // toast.success(`Welcome ${data.User_name}`)
         return { success: true, data }
      } catch (error: any) {
         console.log(error)
         const err = error?.response?.data
         toast.error(err || 'error')
         return { success: false, data: null, status: error.status }
      }
   }

   // static async createClient(formData: Client): Promise<CreateResponse> {
   //    try {
   //       const actions = store.getActions().client
   //       const { data }: { data: Client } = await axios.post(`/api/clients`, formData);
   //       actions.add(data)
   //       toast.success(`successfully added ${data.Client_name}`)
   //       return { success: true, data: data, error: null }
   //    } catch (error: any) {
   //       const err = error?.response.data
   //       Object.keys(err).forEach(key => {
   //          toast.error(err[key])
   //       });
   //       return { success: false, data: null, error: error?.response.data }
   //    }
   // }



}
export default AuthServices