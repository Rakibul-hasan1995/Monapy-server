import React, { useMemo } from "react";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./styles.css";
import { useThemeState } from "../../store/themeStore";

interface TableProps {
  columnDefs?: any[];
  pinnedBottomRowData?: any[];
  rowData?: any[];
  pagination?: boolean;
  onCellValueChanged?: (action: { data: any }) => void;
  onFilterChanged?: (action: any) => void;
  defaultColDef?: any;
}

const Table: React.FC<TableProps> = (props: TableProps | any) => {
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      filter: true,
      floatingFilter: true,
      sortable: true,
      resizable: true,
      editable: false,
    };
  }, []);
  const { mode } = useThemeState();
  return (
    <div className="w-full h-[calc(100vh-97px)]">
      <div
        style={{
          height: "100%",
          width: "100%",
        }}
        className={`${
          mode !== "Light"
            ? "ag-theme-alpine bg-white"
            : "ag-theme-alpine-dark bg-black-500"
        } h-screen rounded-xl`}
      >
        <AgGridReact
          // ref={gridRef}
          rowData={props.value}
          rowHeight={50}
          defaultColDef={defaultColDef}
          // pagination
          // onCellValueChanged={(x: any) => {
          //   console.log(x);
          //   // const _id = x.data._id;
          //   // const obj = { [x.colDef.field]: x.newValue };
          //   props.handleEditCell(x.data);
          // }}
     
          {...props}
        ></AgGridReact>
      </div>
    </div>
  );
};

export default Table;
