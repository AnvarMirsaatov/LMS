"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/components/models/axios";

export const useActivePenaltyRate = () => {
    return useQuery({
        queryKey: ["active-penalty-rate"],
        queryFn: async () => {
            const res = await api.get("/admin/penalty-rate/active");
            return res.data.data;
        },
    });
};