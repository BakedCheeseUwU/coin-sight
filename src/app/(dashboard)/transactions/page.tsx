"use client";

import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions";

import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { transactions as transactionSchema } from "@/db/schema";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { columns } from "./columns";
import { useState } from "react";
import { UploadButton } from "./upload-button";
import { ImportCard } from "./import-card";

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};

const TransactionsPage = () => {
  const [AccountDialog, confirm] = useSelectAccount();
  const [variants, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);
  const { onOpen } = useNewTransaction();
  const bulkCreateTransactions = useBulkCreateTransactions();
  const transactionsQuery = useGetTransactions();
  const deleteTransactions = useBulkDeleteTransactions();

  const onUpload = (result: typeof INITIAL_IMPORT_RESULTS) => {
    setImportResults(result);
    setVariant(VARIANTS.IMPORT);
  };

  const onSubmitImport = async (
    value: (typeof transactionSchema.$inferInsert)[],
  ) => {
    const accountId = await confirm();

    if (!accountId) {
      return toast.error("Please select an accont to continue.");
    }

    const data = value.map((value) => ({
      ...value,
      accountId: accountId as string,
    }));

    bulkCreateTransactions.mutate(data, {
      onSuccess: () => {
        onCancelImport();
      },
    });
  };

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const isDisabled =
    transactionsQuery.isLoading || deleteTransactions.isPending;

  const transactions = transactionsQuery.data || [];

  if (transactionsQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto -mt-24 pb-10">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variants === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto -mt-24 pb-10">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:justify-between lg:items-center">
          <CardTitle className="text-xl line-clamp-1">
            Transactions History
          </CardTitle>
          <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
            <Button
              size="sm"
              className=" w-full lg:w-auto bg-purple-700 hover:bg-purple-700/90"
              onClick={onOpen}
            >
              <Plus />
              Add new
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            onDelete={(rows) => {
              const ids = rows.map((r) => r.original.id);
              deleteTransactions.mutate({ ids });
            }}
            disabled={isDisabled}
            filterKey="payee"
            columns={columns}
            data={transactions}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
