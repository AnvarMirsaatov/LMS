// hooks/useFines.ts
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { api } from "@/components/models/axios";
import { FinesResponse } from "@/types/fine";

export interface FinesParams {
    status?: string;
    pageNumber?: number;
    pageSize?: number;
    sortDirection?: "asc" | "desc";
    field?: string;
    query?: string;
}

export const useFines = (
    params: FinesParams
): UseQueryResult<FinesResponse, Error> => {
    const { field, query, ...rest } = params;

    return useQuery<FinesResponse>({
        queryKey: ["fines", params],
        queryFn: async () => {
            const res = await api.get("/admin/fine", { params });
            return res.data;
        },
    });

};
