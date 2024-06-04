"use client";

import { Loader2, Plus } from "lucide-react";

import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { columns } from "./columns";

const AccountsPage = () => {
  const { onOpen } = useNewAccount();
  const accountsQuery = useGetAccounts();
  const deleteAccounts = useBulkDeleteAccounts();

  const isDisabled = accountsQuery.isLoading || deleteAccounts.isPending;

  const accounts = accountsQuery.data || [];

  if (accountsQuery.isLoading) {
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

  return (
    <div className="max-w-screen-2xl mx-auto -mt-24 pb-10">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:justify-between lg:items-center">
          <CardTitle className="text-xl line-clamp-1">Accounts Page</CardTitle>
          <Button onClick={onOpen}>
            <Plus />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            onDelete={(rows) => {
              const ids = rows.map((r) => r.original.id);
              deleteAccounts.mutate({ ids });
            }}
            disabled={isDisabled}
            filterKey="name"
            columns={columns}
            data={accounts}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPage;
