import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ImportTable } from "./import-table";

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

  return (
    <div className="max-w-screen-2xl mx-auto -mt-24 pb-10">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:justify-between lg:items-center">
          <CardTitle className="text-xl line-clamp-1">
            Import Transactions
          </CardTitle>
          <div className="flex items-center gap-x-2">
            <Button
              size="sm"
              className=" w-full bg-purple-700 hover:bg-purple-700/90"
              onClick={onCancel}
            >
              Cancel
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
