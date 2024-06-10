import { InferRequestType,InferResponseType } from "hono";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.accounts[":id"]["$patch"]>["json"]

export const useEditAccount = (id?: string)=>{
    const queryClient = useQueryClient();

    const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
    >({
        mutationFn: async(json) => {
            const response = await client.api.accounts[":id"]["$patch"]({
                param : {id},
                json
            })
            return await response.json()
        },
        onSuccess: () => {
            toast.success("Account Edited")
            queryClient.invalidateQueries({queryKey:["account",{id}]})
            queryClient.invalidateQueries({queryKey:["accounts"]})
            // TODO: Also invalidate summary query and transaction query
        },
        onError: () => {
            toast.error("Failed to create account")
        }
    })
    return mutation
}