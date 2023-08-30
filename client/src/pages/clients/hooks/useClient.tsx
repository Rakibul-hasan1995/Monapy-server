import * as React from "react";
import { numberWithCommas } from "../../../utils/numberFormater";
import RandierLink from "../../../components/randerLInkButton";
import { useClientState } from "../../../store/client";
import { _arrSum } from "../../../utils/arrSum";

export default function useClient() {
  const { value: clients } = useClientState();

  const columnDefs = React.useMemo(
    () => [
      {
        field: "Client_name",
        headerName: "Name",
        filter: true,
        floatingFilter: true,
      },
      {
        field: "Client_phone",
        headerName: "Phone",
        filter: false,
      },
      {
        field: "billAmount",
        headerName: "Bill Amount",
        filter: false,
        valueFormatter: ({ value }: { value: any }) => numberWithCommas(value),
        cellStyle: { justifyContent: "right" },
        type: "numericColumn",
      },
      {
        field: "paymentAmount",
        headerName: "Pay Amount",
        filter: false,
        valueFormatter: ({ value }: { value: any }) => numberWithCommas(value),
        cellStyle: { justifyContent: "right" },
        type: "numericColumn",
      },
      {
        field: "balance",
        headerName: "Deu Amount",
        filter: false,
        valueGetter: function (params: {
          data: {
            OpeningBalance: number;
            billAmount: number;
            paymentAmount: number;
          };
        }) {
          const billAmount = params.data.billAmount || 0;
          const paymentAmount = params.data.paymentAmount || 0;
          const OpeningBalance = params.data.OpeningBalance || 0;
          return billAmount + OpeningBalance - paymentAmount;
        },
        valueFormatter: ({ value }: { value: any }) => numberWithCommas(value),
        cellStyle: { justifyContent: "right" },
        type: "numericColumn",
      },
      {
        field: "_id",
        headerName: "Action",
        filter: false,
        cellRenderer: ({ value }: { value: string }) => (
          <RandierLink href={`/rbs/v2/clients/${value}/profile`} />
        ),
        cellStyle: { justifyContent: "center" },

        headerClass: "justify-center",
      },
    ],
    []
  );

  
  // pinned Bottom row functions ----------->>>>
  const [balance, setBalance] = React.useState(0);
  const [billAmount, setBillAmount] = React.useState(0);
  const [paymentAmount, setPaymentAmount] = React.useState(0);

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

  React.useEffect(() => {
    getAmount(Object.values(clients));
  }, [clients]);

  const getAmount = (arr: any[]) => {
    const balanceSum = _arrSum(arr, "balance");
    const billAmountSum = _arrSum(arr, "billAmount");
    const paymentAmountSum = _arrSum(arr, "paymentAmount");

    setBalance(balanceSum);
    setBillAmount(billAmountSum);
    setPaymentAmount(paymentAmountSum);
  };

  const pinnedBottomRowData = [
    {
      Client_name: "Total",
      billAmount,
      paymentAmount,
      balance,
    },
  ];
  // pinned Bottom row functions -----------<<<

  return { columnDefs, clients, getFilteredData, pinnedBottomRowData };
}
