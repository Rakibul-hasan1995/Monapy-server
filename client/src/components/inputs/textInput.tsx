import classNames from "classnames";
import { forwardRef } from "react";
import NavButton from "../buttons/iconButton";
import moment from "moment";
import { MinusCircleIcon } from "@heroicons/react/24/outline";


interface TextInputProps {
   label: string;
   value: string | number | any;
   name: string;
   placeholder: string;
   error?: string;
   autoComplete?: string;
   type: "text" | "number" | "password" | 'email' | 'date';
   onChange: (arg0: any) => void;
   onBlur: () => void;
}

export interface SelectData {
   key: string,
   value: string
}
interface SelectInput {
   label: string;
   value: string | number | any;
   name: string;
   placeholder: string;
   error?: string;
   optionDataArr?: SelectData[];
   onChange: (arg0: any) => void;
   onBlur?: () => void;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
   const formattedValue =
      props.type === "date" && props.value instanceof Date
         ? props.value.toISOString().split("T")[0] // Format Date to "yyyy-MM-dd"
         : props.value;


   const handleDatePlus = () => {
      const value = moment(props.value).add(1, "days").format('yyyy-MM-DD')
      props.onChange(value);
   };
   const handleDateMinus = () => {
      const value = moment(props.value).subtract(1, "days").format('yyyy-MM-DD')
      props.onChange(value);
   };
   return (
      <div className="w-full  px-3 mb-6 md:mb-0 relative">
         <label className="block pl-2 uppercase tracking-wide 
          text-gray-700 dark:text-base-light text-xs font-bold mb-2"
            htmlFor={props.name}>
            {props.label}
         </label>
         <input
            className={classNames({
               "appearance-none block w-full": true,
               "border dark:border-base-lt-dark dark:hover:border-gray-500 border-purple-300 hover:border-purple-400 transition-all": true,
               "rounded py-3 px-4 mb-3 leading-tight": true,
               "bg-base-lt dark:bg-base-dark dark:text-white/80 text-gray-700 focus:bg-white/50 dark:focus:bg-base-lt-dark": true,
               "focus:outline-blue-300": true,
               "border-red-500": props.error
            })}

            ref={ref}
            id={props.name}
            {...props}
            value={formattedValue}
         />
         {props.type === 'date' && <div className="absolute top-9 right-12">
            <NavButton onClick={handleDateMinus} icon={<MinusCircleIcon className="w-6 h-6" />} />

            <NavButton classNames="mx-4" onClick={handleDatePlus} />
         </div>}
         {props.error && <p className="text-red-500 text-xs italic">{props.error}</p>}
      </div>
   );
})

const SelectInput = forwardRef<HTMLSelectElement, SelectInput>((props, ref) => {
   const { optionDataArr, ...rest } = props

   return (
      <div className="w-full  px-3 mb-6 md:mb-0 relative">
         <label className="block pl-2 uppercase tracking-wide 
          text-gray-700 dark:text-base-light text-xs font-bold mb-2"
            htmlFor={props.name}>
            {props.label}
         </label>

         <div className="relative">
            <select className={
               classNames({
                  "appearance-none block w-full": true,
                  "border dark:border-base-lt-dark dark:hover:border-gray-500 border-purple-300 hover:border-purple-400 transition-all": true,
                  "rounded py-3 px-4 mb-3 leading-tight": true,
                  "bg-base-lt dark:bg-base-dark dark:text-white/80 text-gray-700 focus:bg-white/50 dark:focus:bg-base-lt-dark": true,
                  "focus:outline-blue-300": true,
                  "border-red-500": props.error

               })}
               disabled={!optionDataArr?.length}
               ref={ref}
               id={props.name}
               {...rest}
            >
               <option value={' '}>{props.placeholder}</option>
               {optionDataArr && optionDataArr.map((item) => (
                  <option className="" key={item.key} value={item.value}>{item.key}</option>
               ))}

            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
               <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
         </div>
         {props.error && <p className="text-red-500 text-xs italic">{props.error}</p>}
      </div >
   );
})


export { TextInput, SelectInput }