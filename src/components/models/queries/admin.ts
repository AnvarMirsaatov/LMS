import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/components/models/axios";
import { toast } from "sonner";
import { CreatePenaltyData } from "@/types/fine";





export const usePenaltyCreate = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreatePenaltyData) => {
      let endpoint = "";
      switch (data.type) {
        case "lost":
          endpoint = "/admin/fine/create/lost";
          break;
        case "irreparable_damage":
          endpoint = "/admin/fine/create/irreparable_damage";
          break;
        case "damage":
          endpoint = "/admin/fine/create/damage";
          break;
        default:
          throw new Error("Noma’lum jarima turi");
      }

      const res = await api.post(endpoint, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Jarima muvaffaqiyatli yaratildi!");
      queryClient.invalidateQueries({ queryKey: ["fines"] });
    },
    onError: (err: any) => {
      console.error('onError=>>>', err);
      toast.error("Jarima yaratishda xatolik yuz berdi");
    },
  });

  return {
    ...mutation,
    isLoading: mutation.status === "pending", // "loading" emas, "pending"
  };

};

export const useAdministrators = ({
  pageNumber,
  sortDirection,
}: {
  pageNumber: number;
  sortDirection: "asc" | "desc";
}) =>
  useQuery({
    queryKey: ["administrators", pageNumber, sortDirection],
    queryFn: async () => {
      const res = await api.get(
        `/super-admin/admins?pageNumber=${pageNumber}&size=10&sortDirection=${sortDirection}`,
      );
      return res.data;
    },

    select: (data: Record<string, any>) => data?.data,
  });

// export const useAdminDelete = () => {
//   return useMutation({
//     mutationFn: async (id: string | number) => {
//       const res = await api.delete(`/super-admin/admins/${id}`);
//       return res.data; // <-- natijani qaytaramiz
//     },
//   });
// };

export const useAdminDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/super-admin/admins/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["administrators"] });
    },
  });
};

export const useCreateAdministrator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const res = await api.post("/super-admin/admins/initiate", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["administrators"] });
    },
  });
};

export const useActivateAccount = () => {
  const queryClient = useQueryClient(); // 👈 qo'shamiz

  return useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const res = await api.post(`/super-admin/admins/confirm`, data);
      return res.data;
    },
    onSuccess: () => {
      // ✅ jadvalni yangilaydi
      queryClient.invalidateQueries({ queryKey: ["administrators"] });
    },
  });
};

export const useResendActivationCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const res = await api.post(`/admin/password-reset/initiate`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["administrators"] });
      toast.success("Kod qayta yuborildi");
    },
  });
};
