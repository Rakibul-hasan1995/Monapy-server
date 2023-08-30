import * as React from "react";
import { Order, useOrderValue } from "../../../store/order";
import { _arrSum } from "../../../utils/arrSum";

export default function useOrderReport() {
  const { value } = useOrderValue();


  const [orders, setOrders] = React.useState<Order[]>([]);

  // pinned Bottom row functions ----------->>>>
  const [Order_qty, setOrder_qty] = React.useState(0);
  const [receivedQty, setRecQty] = React.useState(0);
  const [deliveredQty, setDelQty] = React.useState(0);
  const [ProductionQty, setProductionQty] = React.useState(0);

  React.useEffect(() => {
    const ordersArr = Object.values(value).filter(
      (item) => item.Order_status !== "Invoiced"
    );

    setOrders(ordersArr);
    getAmount(ordersArr);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const getFilteredData = (x: { api: any; columnApi: any }) => {
    const { api, columnApi } = x;
    if (api == null || columnApi == null) {
      return;
    }
    const items: any[] = [];
    api.forEachNodeAfterFilter(function (node: { data: any }) {
      items.push(node.data);
    });
    getAmount(items);
    return items;
  };

  const getAmount = (arr: any[]) => {
    const Order_qtySum = _arrSum(arr, "Order_qty");
    const RecQtySum = _arrSum(arr, "receivedQty");
    const DelQty = _arrSum(arr, "deliveredQty");
    const proQty = _arrSum(arr, "ProductionQty");
    setOrder_qty(Order_qtySum);
    setRecQty(RecQtySum);
    setDelQty(DelQty);
    setProductionQty(proQty);
  };

  const pinnedBottomRowData = [
    {
      Order_no: "Total",
      Order_qty,
      receivedQty,
      receivedQtyBalance: Order_qty - receivedQty,
      deliveredQty,
      deliveredBalance: Order_qty - deliveredQty,
      ProductionQty,
    },
  ];

  const footerData = {
    Order_qty,
    receivedQty,
    receivedQtyBalance: Order_qty - receivedQty,
    deliveredQty,
    deliveredBalance: Order_qty - deliveredQty,
    ProductionQty,

  }


  // pinned Bottom row functions -----------<<<

  return {
    orders,
    getFilteredData,
    pinnedBottomRowData,
    footerData
  };
}
