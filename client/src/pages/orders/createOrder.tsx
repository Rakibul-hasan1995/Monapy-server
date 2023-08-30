import * as React from "react";
import Layout from "../../components/Layout";
import { SelectInput, TextInput } from "../../components/inputs/textInput";
import { Controller, useForm } from 'react-hook-form'
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useClientState } from "../../store/client";
import Button from "../../components/buttons/button";
import OrderServices from "../../services/api/ordersServices";


export default function CreateOrder() {

  const initialValues = {
    Order_no: "",
    Order_date: new Date(),
    stitch: 0,
    Client_id: "",
    Order_qty: 0,
    Order_rate: 0,
    Order_sl: 0,
    file: [],
  };

  const { value } = useClientState()

  const clients = Object.values(value).map((item) => {
    return {
      key: item.Client_name,
      value: item._id
    }
  })

  const [imgUrl, setImgUrl] = React.useState('');
  const [file, setFile] = React.useState([]);
  const [loading, setLoading] = React.useState<boolean>(false);


  const {
    control,
    setError,
    handleSubmit,
    // reset,
    // setValue,

    formState: { errors },
  } = useForm({
    defaultValues: {
      ...initialValues
    },
  });

  const submit = async (data: any) => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('file', file[0])

      formData.append('Order_no', data.Order_no);
      formData.append('stitch', data.stitch);
      formData.append('Client_id', data.Client_id);
      formData.append('Order_qty', data.Order_qty);
      formData.append('Order_rate', data.Order_rate);
      formData.append('Order_date', data.Order_date);

      const { success, error, } = await OrderServices.createOrder(formData)
      setLoading(false)
      if (!success && Object.keys(error).length) {
        return Object.keys(error).forEach((key: any) =>
          setError(key, { type: 'custom', message: error[key] }),
        );
      }
    } catch (error) {
      console.log(error)
    }

  }
  const _handleFileChange = (e: any) => {
    setFile(e.target.files)
    setImgUrl(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <Layout title="Create Order" active="Orders">
      <div className="container min-h-full p-5 max-w-3xl mx-auto 
       bg-base-lt dark:bg-base-dark">
        <form onSubmit={handleSubmit(submit)}>
          <div className="w-24 h-24 mx-auto mb-5">
            <Controller
              rules={{
                required: {
                  value: true,
                  message: "Please Choose Image",
                },
              }}
              control={control}
              name={'file'}
              render={({ field }) => (

                <label htmlFor="upload-photo">
                  <input
                    className="hidden"
                    id="upload-photo"
                    accept=".jpg, .jpeg, .png,"
                    type="file"
                    {...field}
                    onChange={(e) => {
                      _handleFileChange(e)
                      field.onChange(e)
                    }}
                  />
                  <div className="w-full h-full rounded-full
                   bg-base-light dark:bg-base-lt-dark 
                   border dark:border-base-lt-dark dark:hover:border-gray-500 border-purple-300 hover:border-purple-400 transition-all
                    mx-auto  shadow-lg">
                    {errors.file && <ExclamationCircleIcon className="text-red-500" />}
                    {imgUrl && <img
                      className="rounded-full w-full h-full"
                      alt="Design"
                      src={imgUrl}
                    />}

                  </div>

                </label>
              )}
            />
          </div>
          <div className="flex flex-wrap">
            <div className="w-full sm:w-1/2 my-2">
              <Controller
                rules={{
                  required: {
                    value: true,
                    message: "Please Enter Order No",
                  },
                }}
                control={control}
                name={'Order_no'}
                render={({ field }) => (
                  <TextInput
                    error={errors?.Order_no?.message}
                    type="text"
                    label={"Order No"}
                    placeholder={"Enter Order No"}

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
                    message: "Please Enter Stitch Count",
                  },
                }}
                control={control}
                name={'stitch'}
                render={({ field }) => (
                  <TextInput
                    error={errors?.stitch?.message}
                    type="number"
                    label={"Stitch"}
                    placeholder={"Enter Stitch"}
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
                    message: "Please Enter Order_date",
                  },
                }}
                control={control}
                name={'Order_date'}
                render={({ field }) => (
                  <TextInput
                    error={errors?.Order_date?.message}
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
                    message: "Please Enter Order_date",
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
                    message: "Please Enter Qty",
                  },
                }}
                control={control}
                name={'Order_qty'}
                render={({ field }) => (
                  <TextInput
                    error={errors?.Order_qty?.message}
                    type="number"
                    label={"Order Qty"}
                    placeholder={"Enter Qty"}
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
                    message: "Please Enter Rate",
                  },
                }}
                control={control}
                name={'Order_rate'}
                render={({ field }) => (
                  <TextInput
                    error={errors?.Order_rate?.message}
                    type="number"
                    label={"Order Rate"}
                    placeholder={"Enter Rate"}
                    {...field}
                  />
                )}
              />
            </div>

          </div>
          {/* <button  type="submit">Save</button> */}
          <Button
            disabled={loading}
            type="submit"
            title={loading ? 'Processing' : "Save"}
            classNames="sm:mt-5 md:mt-10"
          />


        </form>
      </div>
    </Layout>
  )
}
