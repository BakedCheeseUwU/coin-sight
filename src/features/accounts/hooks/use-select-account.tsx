import { useRef, useState } from "react";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";

import { Select } from "@/components/select";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const useSelectAccount = (): [
  () => JSX.Element,
  () => Promise<unknown>,
] => {
  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();

  const onCreateAccount = (name: string) =>
    accountMutation.mutate({
      name,
    });

  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const [promise, setPromise] = useState<{
    resolve: (value: string | undefined) => void;
  } | null>(null);

  const selectValue = useRef<string>();

  const confirm = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(selectValue.current);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(undefined);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Account</DialogTitle>
          <DialogDescription>
            Please Select an account to continue
          </DialogDescription>
        </DialogHeader>
        <Select
          placeholder="Select an account"
          onCreate={onCreateAccount}
          options={accountOptions}
          disabled={accountQuery.isLoading || accountMutation.isPending}
          onChange={(value) => (selectValue.current = value)}
        />
        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            className="bg-purple-700 hover:bg-purple-700/90"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDialog, confirm];
};
