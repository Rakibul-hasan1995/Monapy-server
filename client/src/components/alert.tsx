

import { TrashIcon } from "@heroicons/react/24/outline";


const ConfirmationAlert = ({ onConfirm, onCancel, title, imgSrc, message }: { onConfirm: () => void; onCancel: () => void; title?: string; imgSrc?: string; message?: string }) => {
   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
         <div className="fixed inset-0 backdrop-blur-sm bg-black/50" onClick={onCancel}></div>
         <div className="bg-white w-96 p-6 rounded shadow-lg relative">
            <div className="md:flex items-center">
               <div className="rounded-full border border-gray-300 flex items-center justify-center w-16 h-16 flex-shrink-0 mx-auto
                text-white bg-red-500">
                  {imgSrc ? <img src={imgSrc} className="rounded-full" alt="d" /> :
                     <TrashIcon className="w-8 h-8" />}
               </div>
               <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                  <p className="font-bold text-red-500">Are you sure ?</p>
                  <p className="font-bold text-red-500">{title} </p>
                  <p className="text-sm text-gray-700 mt-1">
                     {message ? message + ' This action cannot be undone.' : 'You will lose all of your data by deleting. This action cannot be undone.'}
                  </p>
               </div>
            </div>
            <div className="flex justify-end pt-8">
               <button
                  className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                  onClick={onConfirm}
               >
                  Confirm
               </button>
               <button
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                  onClick={onCancel}
               >
                  Cancel
               </button>
            </div>
         </div>
      </div>
   );
};

export default ConfirmationAlert;