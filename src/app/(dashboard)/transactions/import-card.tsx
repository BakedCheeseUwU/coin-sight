import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ImportTable } from "./import-table";
import { convertAmountToMiliUnits } from "@/lib/utils";
import { format, parse } from "date-fns";

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

const requiredOptions = ["amount", "payee", "date"];

interface SelectedColumnState {
  [key: string]: string | null;
}

type Props = {
  data: string[][];
  onSubmit: (data: any) => void;
  onCancel: () => void;
};

export const ImportCard = ({ data, onSubmit, onCancel }: Props) => {
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnState>(
    {},
  );

  const headers = data[0];
  const body = data.slice(1);

  const onTableHeadSelectChange = (
    columnIndex: number,
    value: string | null,
  ) => {
    setSelectedColumns((prev) => {
      const newSelectedColoumns = { ...prev };

      for (const key in newSelectedColoumns) {
        if (newSelectedColoumns[key] === value) {
          newSelectedColoumns[key] = null;
        }
      }

      if (value === "skip") {
        value = null;
      }

      newSelectedColoumns[`column_${columnIndex}`] = value;
      return newSelectedColoumns;
    });
  };

  const progress = Object.values(selectedColumns).filter(Boolean).length;

  const handleContinue = () => {
    const getColumnIndex = (column: string) => {
      return column.split("_")[1];
    };

    const mappedData = {
      headers: headers.map((_headers, index) => {
        const columnIndex = getColumnIndex(`column_${index}`);
        return selectedColumns[`column_${columnIndex}`];
      }),

      body: body
        .map((row) => {
          const transformedRow = row.map((cell, index) => {
            const columnIndex = getColumnIndex(`column_${index}`);
            return selectedColumns[`column_${columnIndex}`] ? cell : null;
          });

          return transformedRow.every((item) => item === null)
            ? []
            : transformedRow;
        })
        .filter((row) => row.length > 0),
    };
    const arrayOfData = mappedData.body.map((row) => {
      return row.reduce((acc: any, cell, index) => {
        const header = mappedData.headers[index];
        if (header !== null) {
          acc[header] = cell;
        }
        return acc;
      }, {});
    });

    const formattedData = arrayOfData.map((item) => ({
      ...item,
      amount: convertAmountToMiliUnits(parseFloat(item.amount)),
      date: format(parse(item.date, dateFormat, new Date()), outputFormat),
    }));

    console.log(formattedData);

    onSubmit(formattedData);
  };

  return (
    <div className="max-w-screen-2xl mx-auto -mt-24 pb-10">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:justify-between lg:items-center">
          <CardTitle className="text-xl line-clamp-1">
            Import Transactions
          </CardTitle>
          <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
            <Button
              size="sm"
              className=" w-full lg:w-auto bg-rose-500 hover:bg-rose-500/90"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              disabled={progress < requiredOptions.length}
              size="sm"
              className=" w-full lg:w-auto bg-purple-700 hover:bg-purple-700/90"
              onClick={handleContinue}
            >
              Continue ({progress}/{requiredOptions.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectedColumns}
            onTableHeadSelectChange={onTableHeadSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};
