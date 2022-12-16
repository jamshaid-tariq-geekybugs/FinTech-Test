import axios from "axios";
import {
  PivotViewComponent,
  CalculatedField,
  Inject,
} from "@syncfusion/ej2-react-pivotview";

import "./App.css";
import { useRef, useState } from "react";
function App() {
  const [pivotData, setPivotData] = useState();
  const pivotRef = useRef(null);

  const addCalculatedFields = (data) => {
    let dataToReturn = [];
    data.length > 0 &&
      data.forEach((loan) => {
        dataToReturn.push({ ...loan });
      });
    return dataToReturn;
  };

  const load = () => {
    axios
      .get("http://localhost:3000/")
      .then((res) =>
        setPivotData({
          // columns: [
          //   { caption: "Principal Amount" },
          //   {
          //     caption: "Outstanding Balance",
          //   },
          // ],

          dataSource: res.data,
          expandAll: false,
          filters: [],
          formatSettings: [
            { name: "TotalAmountFunded", format: "C0" },
            { name: "OutstandingPrincipalAsOfToday", format: "C0" },
            { name: "percentageUPB", format: "P2" },
            { name: "StdDevAPR", format: "###.## '%'" },
          ],
          rows: [
            { name: "FacilityStructure" },
            { name: "CurrentRateType" },
            { name: "LoanID" },
          ],
          values: [
            {
              name: "numberOfLoans",
              caption: "# of Loans",
              type: "CalculatedField",
            },
            { name: "TotalAmountFunded", caption: "Principal Amount" },
            {
              name: "OutstandingPrincipalAsOfToday",
              caption: "Outstanding Balance",
            },
            {
              name: "percentageUPB",
              caption: "% of UPB",
              type: "CalculatedField",
            },
            {
              name: "weightedAverageAPR",
              caption: "Weighted Average APR",
              type: "CalculatedField",
            },
            {
              name: "StdDevAPR",
              caption: "StdDev APR",
              type: "CalculatedField",
            },
          ],
          calculatedFieldSettings: [
            {
              name: "numberOfLoans",
              formula: '"Count(FacilityStructure)"',
            },
            {
              name: "percentageUPB",
              formula:
                '"Sum(OutstandingPrincipalAsOfToday)" / "Sum(TotalAmountFunded)"',
            },
            {
              name: "weightedAverageAPR",
              formula: "2",
            },
            {
              name: "StdDevAPR",
              formula: '"PopulationStDev(CurrentAPRKey)"',
            },
          ],
        })
      )
      .catch((err) => console.log(err));
  };

  const queryCellInfo = (args) => {
    if (
      pivotRef.current &&
      pivotRef.current.dataSourceSettings.rows.length === 0 &&
      pivotRef.current.dataSourceSettings.valueAxis === "row"
    ) {
      var colIndex = args.cell.getAttribute("aria-colindex");
      if (
        args.data &&
        args.data[colIndex] &&
        args.data[colIndex].axis === "row"
      ) {
        args.cell.querySelector(".e-cellvalue").innerText =
          args.data[colIndex].formattedText;
      }
    }
  };
  const headerCellInfo = (args) => {
    if (
      pivotRef.current &&
      pivotRef.current.dataSourceSettings.columns.length === 0 &&
      pivotRef.current.dataSourceSettings.valueAxis === "column"
    ) {
      if (args.cell.column.headerText === "") {
        args.node.querySelector(".e-headertext").innerText = "Loan Type";
      } else
        args.node.querySelector(".e-headercelldiv .e-headertext").innerText =
          args.cell.column.headerText;
    }
  };

  return (
    <>
      <button onClick={load}>load</button>
      <PivotViewComponent
        ref={pivotRef}
        id="PivotView"
        height={500}
        dataSourceSettings={pivotData}
        allowCalculatedField={true}
        gridSettings={{
          queryCellInfo: queryCellInfo,
          headerCellInfo: headerCellInfo,
        }}>
        <Inject services={[CalculatedField]} />
      </PivotViewComponent>
    </>
  );
}

export default App;
