import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { api } from "@/components/models/axios";

type Fine = {
    id: string;
    name: string;
    surname: string;
    bookTitle: string;
    type: string;
    amount: number;
    resolved: boolean;
};

type Params = {
    status: "all" | "resolved" | "unresolved";
    pageNumber: number;
    pageSize: number;
    sortDirection: "asc" | "desc";
    field?: "studentId" | "fullName" | "cardNumber";
    query?: string;
};

export const useFines = (params: Params): UseQueryResult<Fine[]> => {
    const { field, query, ...rest } = params;

    return useQuery<Fine[]>({
        queryKey: ["fines", params],
        queryFn: async () => {
            const res = await api.get("/admin/fine", {
                params: {
                    ...rest,
                    ...(field && query ? { field, query } : {}),
                },
            });
            return res.data.data;
        },
        keepPreviousData: true, // Endi type mos keladi
    });
};
