/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import {
  AdjustmentsVerticalIcon,
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  ArrowUpTrayIcon,
  ChartBarIcon,
  CurrencyBangladeshiIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  PencilIcon,
  PresentationChartBarIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import OverviewCard from "../../components/card/overviewCard";
import { useEffect, useState } from "react";
import OrderServices from "../../services/api/ordersServices";
import { toast } from "react-toastify";
import Alert from "../../components/alert";
import { ObjectId } from "bson";
import { useStoreState } from "../../store/store";
import { Order } from "../../store/order";

const calculateMinus = (a: number, b: number) => {
  if (a && b) {
    return a - b;
  } else {
    return 0;
  }
};

export default function OrderDetails() {
  const activePage = useParams();
  const _id = activePage._id || "";

  const navigate = useNavigate()

  const tampState = useStoreState((state) => state.order.tempData)

  const [order, serOrder] = useState<Order>()



  useEffect(() => {
    if (tampState[_id]) {
      const data = tampState[_id][_id]
      serOrder(data)
    }
  }, [tampState]);



  useEffect(() => {
    if (ObjectId.isValid(_id)) {
      getData(_id)
    } else {
      navigate(-1)
    }
  }, [_id]);

  const getData = async (id: string) => {
    await OrderServices.getOrdersWithQueryWith_id(id)
  }

  const OverView = [
    {
      title: "Order Qty",
      value: order?.Order_qty,
      icon: <FolderIcon />,
      // chart: <ProductionChart data={prodLast30DaysXY} />,
    },
    {
      title: "Received Qty",
      value: order?.receivedQty,
      icon: <ArrowDownOnSquareIcon />,
      link: 'receive'
    },
    {
      title: "Receive Balance",
      value: calculateMinus(order?.Order_qty || 0, order?.receivedQty || 0),
      icon: <ArrowDownOnSquareIcon />,
    },
    {
      title: "Production Qty",
      value: order?.ProductionQty,
      icon: <ChartBarIcon />,
      link: 'productions'
    },
    {
      title: "Production Balance",
      value: calculateMinus(order?.Order_qty || 0, order?.ProductionQty || 0),
      icon: <PresentationChartBarIcon />,
    },
    {
      title: "Delivery Qty",
      value: order?.deliveredQty,
      icon: <ArrowUpOnSquareIcon />,
      link: 'delivery'
    },

    {
      title: "Stitch",
      value: order?.stitch,
      icon: <AdjustmentsVerticalIcon />,
    },
    {
      title: "Rate",
      value: order?.Order_rate,
      icon: <CurrencyBangladeshiIcon />,
    },
    {
      title: "Delivery Balance",
      value: calculateMinus(order?.Order_qty || 0, order?.deliveredQty || 0),
      icon: <ArrowUpTrayIcon />,
    },
  ];



  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showCloneAlert, setShowCloneAlert] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteAlert(true);
  };
  const handleCloneClick = () => {
    setShowCloneAlert(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await OrderServices.deleteOrder(_id)
      setShowDeleteAlert(false);
      navigate(-1)
    } catch (error) {
      console.log(error)
      toast.error('error')
    }
  };

  const handleConfirmClone = async () => {
    try {
      const data = await OrderServices.cloneOrder(_id)
      setShowCloneAlert(false);
      navigate(`/rbs/v2/orders/${data._id}`)
    } catch (error) {
      console.log(error)
      toast.error('error')
    }

  };

  const handleCancelAlert = () => {
    setShowDeleteAlert(false);
    setShowCloneAlert(false);
  };
  return (
    <Layout title={order?.Order_no || ""} active="Orders">
      {/* actions ====== >>> */}
      {showDeleteAlert &&
        <Alert
          onCancel={handleCancelAlert}
          onConfirm={handleConfirmDelete}
          title={'Delete ? ' + order?.Order_no}
          imgSrc={order?.Item_avatar} />}
      {showCloneAlert &&
        <Alert
          onCancel={handleCancelAlert}
          onConfirm={handleConfirmClone}
          title={'Clone ? ' + order?.Order_no}
          message='Its make Duplicate. '
          imgSrc={order?.Item_avatar} />}

      {/* actions ====== >>> */}

      <section className="relative">
        <div className="absolute top-0 right-0 gap-2 grid grid-cols-1">
          <button
            onClick={handleDeleteClick}
            className="bg-red-700 hover:bg-red-800
             text-white transition-all font-extrabold 
             py-2 px-4 rounded inline-flex items-center"
          >
            <TrashIcon className="w-4 h-6" />
          </button>
          <button
            onClick={handleCloneClick}
            className="bg-green-400 hover:bg-blue-600 text-white transition-all font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <DocumentDuplicateIcon className="w-4 h-6" />
          </button>
          <Link
            to={"#"}
            className="bg-blue-400 hover:bg-blue-600 text-white transition-all font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <PencilIcon className="w-4 h-6" />
          </Link>
        </div>
        <div className="grid  sm:grid-cols-1 md:grid-cols-2 gap-5">
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
            {OverView.map((item, i) => (
              <div className="" key={item.title}>
                <OverviewCard
                  title={item.title}
                  value={item.value || 0}
                  icon={item.icon}
                  link={item.link}
                  index={i}
                >
                  {/* {item?.chart && item?.chart} */}
                </OverviewCard>
              </div>
            ))}
          </div>
          <div className="flex justify-center align-middle items-center">
            <div className="bg-base-lt shadow-md dark:bg-base-dark hover:shadow-xl hover:-translate-x-1 transition-all">
              <div className="max-w-sm h-100">
                <img
                  className="w-full h-full"
                  alt="design"
                  src={order?.Item_avatar}
                />
              </div>
              <div className="text-lg font-semibold p-3">{order?.Order_no}</div>
              <div className="text-sm font-semibold p-3">
                {order?.Client_name}
              </div>
            </div>
          </div>
        </div>

      </section>

    </Layout>
  );
}
