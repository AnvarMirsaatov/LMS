// hooks/useFines.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/components/models/axios";
import { FinesParams, FinesResponse } from "@/types/fine";

export const useFines = (params: FinesParams) => {
    const cleanedParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined && v !== "")
    );

    return useQuery<FinesResponse, Error>({
        queryKey: ["fines", cleanedParams],
        queryFn: async (): Promise<FinesResponse> => {
            const res = await api.get("/admin/fine", { params: cleanedParams });
            return res.data.data;
        },
    });
};
