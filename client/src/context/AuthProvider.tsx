// import React, { createContext, useContext, useState } from 'react';


// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//    const context = useContext(AuthContext);
//    if (!context) {
//       throw new Error('useAuth must be used within an AuthProvider');
//    }
//    return context;
// };

// interface AuthProviderProps {
//    children: React.ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

//    const login = (newToken: string) => {
//       setToken(newToken);
//       localStorage.setItem('token', newToken);
//    };

//    const logout = () => {
//       setToken(null);
//       localStorage.removeItem('token');
//    };

//    const authContextValue: AuthContextType = {
//       token,
//       login,
//       logout
//    };

//    return (
//       <AuthContext.Provider value= { authContextValue } >
//       { children }
//       < /AuthContext.Provider>
//   );
// };



import { createContext, useContext, useEffect, useState } from 'react';
import AuthServices, { LoggedInUser } from '../services/api/authServices';

interface AuthContextType {
   currentUser: LoggedInUser | undefined;
   isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)


// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
};

const AuthProvider = (props: any) => {
   // const navigate = useNavigate()
   const [currentUser, setCurrentUser] = useState<LoggedInUser>();
   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

   useEffect(() => {
      const token = localStorage.getItem("access_token")
      if (token) {
         verifyToken()
      } else {
         // navigate("/auth/login")
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   const verifyToken = async () => {
      const data = await AuthServices.verifyToken()
     
      if (data.success) {
         setCurrentUser(data.data)
         setIsLoggedIn(true)
      }
   }


   return (
      <AuthContext.Provider value={{ currentUser, isLoggedIn }}>
         {props.children}
      </AuthContext.Provider>
   )
}
export { AuthContext, AuthProvider }