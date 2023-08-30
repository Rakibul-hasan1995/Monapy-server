import classNames from "classnames";
import Layout from "../../components/Layout";
import { clientNavItems } from "../../components/defaultNavItems";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { useClientState } from "../../store/client";




const ClientLayout = () => {
   const location = useLocation();
   const pathSegments = location.pathname.split('/');
   const lastSegment = pathSegments[pathSegments.length - 1];
   const activePage = useParams();
   const _id = activePage._id || "";

   const { value } = useClientState()
   const ClientName = value[_id]?.Client_name 

   return (
      <Layout title={ClientName|| ""} active="Clients">
         <div className="relative">
            <div className="overflow-auto sm:h-screen pl-40 md:h-[calc(100vh-84px)] p-3  bg-base text-black dark:bg-base-lt-dark dark:text-base-light">
               {<Outlet />}
            </div>
            <div className="absolute top-[-0.8rem] left-[-0.8rem]">
               <div
                  className={classNames({
                     "w-36 md:h-[calc(100vh-60px)]": true,
                     "border-r-2 border-r-gray-500 dark:bg-base-dark bg-base-lt-light": true,
                  })}
               >
                  <div
                     className={classNames({
                        "flex flex-col justify-between h-full sticky inset-0 w-full": true,
                     })}
                  >
                     <nav className="flex-grow">
                        <ul
                           className={classNames({
                              "my-2 flex flex-col gap-2 items-stretch": true,
                           })}
                        >
                           {clientNavItems.map((item, index) => {
                              return (
                                 <Link
                                    key={index}
                                    className={classNames({
                                       'py-2 font-semibold dark:hover:bg-base-lt-dark hover:bg-base-light': true,
                                       "dark:bg-base-lt-dark bg-base-light": lastSegment?.toLowerCase()?.includes(item.label.toLowerCase())
                                    })}
                                    to={`/rbs/v2/clients/${_id}${item.href}`}
                                 >
                                    <li


                                    >


                                    </li>
                                    {/* {item.icon} */}
                                    <span className="ml-3">{item.label}</span>
                                 </Link>
                              );
                           })}
                        </ul>
                     </nav>
                  </div>
               </div>
            </div>
         </div>
      </Layout>
   )
}

export default ClientLayout