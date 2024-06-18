"use client";

import { Loader2, Plus } from "lucide-react";

import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useBulkDeleteCategories } from "@/features/categories/api/use-bulk-delete-categories";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { columns } from "./columns";

const CategoriesPage = () => {
  const { onOpen } = useNewCategory();
  const categoriesQuery = useGetCategories();
  const deleteAccounts = useBulkDeleteCategories();

  const isDisabled = categoriesQuery.isLoading || deleteAccounts.isPending;

  const categories = categoriesQuery.data || [];

  if (categoriesQuery.isLoading) {
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
          <CardTitle className="text-xl line-clamp-1">
            Categories Page
          </CardTitle>
          <Button
            className="bg-purple-700 hover:bg-purple-700/90"
            onClick={onOpen}
          >
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
            data={categories}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesPage;
