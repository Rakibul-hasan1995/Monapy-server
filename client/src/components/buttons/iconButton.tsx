import { PlusCircleIcon } from '@heroicons/react/24/outline'
import React from 'react';

interface Props {
   onClick: () => void;
   classNames?: string;
   icon?: React.ReactNode

}
export default function IconButton({ onClick, classNames, icon }: Props) {
   return (
      <button type='button' className={`hover:text-blue-500 transition-colors ${classNames}`} onClick={onClick}>
         {icon ? icon : <PlusCircleIcon className="h-6 w-6" />}
      </button>
   )
}

