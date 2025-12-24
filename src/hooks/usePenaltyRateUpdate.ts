// hooks/usePenaltyRateUpdate.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/components/models/axios";
import { toast } from "sonner";

export interface UpdatePenaltyRateData {
    pricePerDay: number;
}

export const usePenaltyRateUpdate = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (data: UpdatePenaltyRateData) => {
            const res = await api.post("/admin/penalty-rate", data);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Jarima stavkasi muvaffaqiyatli yangilandi!");
            queryClient.invalidateQueries({ queryKey: ["activePenaltyRate"] });
        },
        onError: (err: any) => {
            console.error(err);
            toast.error("Yangilashda xatolik yuz berdi");
        },
    });

    // isLoading qo‘shib qaytaramiz
    return {
        ...mutation,
        isLoading: mutation.status === "pending",
    };
};
