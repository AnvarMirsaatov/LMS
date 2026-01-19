import { useQuery } from "@tanstack/react-query";
import { api } from "@/components/models/axios";
import { FinesParams, FinesResponse } from "@/types/fine";

interface FinesApiResponse {
  data: FinesResponse;
  message: string;
  success: boolean;
}

export const useFines = (params: FinesParams) => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== ""),
  );

  return useQuery<FinesResponse, Error, FinesResponse>({
    queryKey: ["fines", cleanedParams],
    queryFn: async (): Promise<FinesResponse> => {
      const res = await api.get<FinesApiResponse>("/admin/fine", {
        params: { ...cleanedParams, pageSize: 10 },
      });
      console.log("FinesResponse", res.data.data);
      return res.data.data;
    },
  });
};

// // hooks/useFines.ts
// import { useQuery } from "@tanstack/react-query";
// import { api } from "@/components/models/axios";
// import { FinesParams, FinesResponse } from "@/types/fine";

// interface FinesApiResponse {
//   data: FinesResponse;
//   message: string;
//   success: boolean;
// }

// export const useFines = (params: FinesParams) => {
//   const cleanedParams = Object.fromEntries(
//     Object.entries(params).filter(([_, v]) => v !== undefined && v !== ""),
//   );

//   return useQuery<FinesResponse | undefined, Error>({
//     queryKey: ["fines", cleanedParams],
//     queryFn: async (): Promise<FinesResponse> => {
//       const res = await api.get<FinesApiResponse>("/admin/fine", {
//         params: { ...cleanedParams, pageSize: 10 },
//       });
//       return res.data.data;
//     },
//     keepPreviousData: true,
//   });
// };

// export const useFines = (params: FinesParams) => {
//   const cleanedParams = Object.fromEntries(
//     Object.entries(params).filter(([_, v]) => v !== undefined && v !== ""),
//   );
//   return useQuery<FinesResponse, Error>({
//     queryKey: ["fines", cleanedParams],
//     queryFn: async (): Promise<FinesResponse> => {
//       const res = await api.get<FinesApiResponse>("/admin/fine", {
//         params: { ...cleanedParams, pageSize: 10 },
//       });
//       return res.data.data;
//     },
//     keepPreviousData: true, // ✅ hozir xato bermasligi kerak
//   });
// };
