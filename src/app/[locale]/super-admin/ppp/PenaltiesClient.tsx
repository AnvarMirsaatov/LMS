// "use client";

// import { useState } from "react";
// import { useActivePenaltyRate } from "@/hooks/useActivePenaltyRate";
// import { useFines } from "@/hooks/useFines";

// export default function PenaltiesClient() {
//     // --- UI state ---
//     const [page, setPage] = useState(1);
//     const [status, setStatus] = useState<"all" | "resolved" | "unresolved">("all");

//     // --- API calls ---
//     const {
//         data: activeRate,
//         isLoading: rateLoading,
//     } = useActivePenaltyRate();

//     const {
//         data: fines,
//         isLoading: finesLoading,
//     } = useFines({
//         status,
//         pageNumber: page,
//         pageSize: 10,
//         sortDirection: "desc",
//     });

//     // --- Loading ---
//     if (rateLoading || finesLoading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="space-y-6">
//             {/* ===== ACTIVE PENALTY RATE ===== */}
//             <div className="p-4 border rounded">
//                 <h2 className="text-lg font-bold">Aktiv jarima stavkasi</h2>
//                 <p>Kunlik narx: {activeRate.pricePerDay}</p>
//                 <p>Sana: {activeRate.createdAt}</p>
//             </div>

//             {/* ===== FILTER ===== */}
//             <div>
//                 <select
//                     value={status}
//                     onChange={(e) => setStatus(e.target.value as any)}
//                 >
//                     <option value="all">Barchasi</option>
//                     <option value="resolved">Yechilgan</option>
//                     <option value="unresolved">Yechilmagan</option>
//                 </select>
//             </div>

//             {/* ===== FINES TABLE ===== */}
//             <table className="w-full border">
//                 <thead>
//                     <tr>
//                         <th>Student</th>
//                         <th>Kitob</th>
//                         <th>Jarima turi</th>
//                         <th>Summa</th>
//                         <th>Status</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {fines.data.map((fine: any) => (
//                         <tr key={fine.id}>
//                             <td>{fine.name} {fine.surname}</td>
//                             <td>{fine.bookTitle}</td>
//                             <td>{fine.type}</td>
//                             <td>{fine.amount}</td>
//                             <td>{fine.resolved ? "Yechilgan" : "Yechilmagan"}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             {/* ===== PAGINATION ===== */}
//             <div className="flex gap-2">
//                 <button
//                     disabled={page === 1}
//                     onClick={() => setPage((p) => p - 1)}
//                 >
//                     Prev
//                 </button>

//                 <span>{page}</span>

//                 <button
//                     disabled={page === fines.totalPages}
//                     onClick={() => setPage((p) => p + 1)}
//                 >
//                     Next
//                 </button>
//             </div>
//         </div>
//     );
// }


"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/components/models/axios";
import MyTable, { type IColumn } from "@/components/my-table";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import TooltipBtn from "@/components/tooltip-btn";
import Link from "next/link";
import { Undo2 } from "lucide-react";
import useLayoutStore from "@/store/layout-store";
import { Tag, Card, Divider } from "antd";

export default function PenaltiesClient() {
    const { id } = useParams<{ id: string }>();
    const searchParams = useSearchParams();
    const type = searchParams.get("type") || "active"; // active / archive
    const t = useTranslations();

    const { user } = useLayoutStore();
    const role = user?.role?.toString().toLowerCase().replace("_", "-");

    // ======== HOOKS ========
    const { data: bookingData, isLoading: bookingLoading } = useQuery({
        queryKey: ["booking", id],
        queryFn: async () => {
            // const res = await api.get("/admin/booking", {
            const res = await api.get("/admin/penalty-rate/active", {
                params: {
                    field: "student",
                    query: id,
                    filter: "all",
                    pageNum: 1,
                    pageSize: 10,
                    sortDirection: "desc",
                },
            });
            return res.data;

        },
        enabled: !!id,
    });

    const { data: historyData, isLoading: historyLoading } = useQuery({
        queryKey: ["history", id],
        queryFn: async () => {
            const res = await api.get("/admin/penalty-rate/active", {
                params: {
                    field: "student",
                    query: id,
                    pageNumber: 1,
                    pageSize: 10,
                    sortDirection: "desc",
                },
            });
            return res.data;
        },
        enabled: !!id,
    });

    const { data: penaltyData, isLoading: penaltyLoading } = useQuery({
        queryKey: ["penalty-rate"],
        queryFn: async () => {
            const res = await api.get("/admin/penalty-rate");

            return res.data;

        },
    });

    // ======== TABLE COLUMNS ========
    const bookingColumns = useMemo<IColumn[]>(() => [
        { key: "index", title: "#", dataIndex: "index", width: 50, render: (_: any, __: any, index: number) => index + 1 },
        { key: "title", title: t("Title"), dataIndex: "title" },
        { key: "author", title: t("Author"), dataIndex: "author" },
        { key: "givenAt", title: t("Given Date"), dataIndex: "givenAt" },
        { key: "dueDate", title: t("Due Date"), dataIndex: "dueDate" },
        { key: "status", title: t("Status"), dataIndex: "status", render: (status: string) => <Tag color={status === "APPROVED" ? "green" : "red"}>{t(status)}</Tag> },
    ], [t]);

    const historyColumns = useMemo<IColumn[]>(() => [
        { key: "index", title: "#", dataIndex: "index", width: 50, render: (_: any, __: any, index: number) => index + 1 },
        { key: "inventoryNumber", title: t("Inventory №"), dataIndex: "inventoryNumber" },
        { key: "bookTitle", title: t("Title"), dataIndex: "bookTitle" },
        { key: "author", title: t("Author"), dataIndex: "author" },
        { key: "givenAt", title: t("Given Date"), dataIndex: "givenAt" },
        { key: "dueDate", title: t("Due Date"), dataIndex: "dueDate" },
        { key: "returnedAt", title: t("Returned Date"), dataIndex: "returnedAt" },
    ], [t]);

    const penaltyColumns = useMemo<IColumn[]>(() => [
        { key: "index", title: "#", dataIndex: "index", width: 50, render: (_: any, __: any, index: number) => index + 1 },
        { key: "rate", title: t("Penalty Rate"), dataIndex: "rate" },
        { key: "description", title: t("Description"), dataIndex: "description" },
    ], [t]);

    // ======== RENDER ========
    return (
        <div className="p-6 space-y-6">
            {/* HEADER */}
            <Card className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    {type === "archive" ? t("Archive bronlar") : t("Active bronlar")}
                </h1>
                <div className="flex gap-2">
                    {role === "admin" && <Link href="/admin/users"><TooltipBtn title={t("Return")}><Undo2 className="w-5 h-5" /></TooltipBtn></Link>}
                    {role === "super-admin" && <Link href="/super-admin/users/students"><TooltipBtn title={t("Return")}><Undo2 className="w-5 h-5" /></TooltipBtn></Link>}
                </div>
            </Card>

            <Divider />
            {/* HISTORY TABLE */}
            <Card>
                <h2 className="text-lg font-semibold mb-2">{t("History")}</h2>
                <MyTable
                    columns={historyColumns}
                    dataSource={historyData?.data || []}
                    isLoading={historyLoading}
                    pagination={{ total: historyData?.totalElements, pageSize: 10 }}
                />
            </Card>

            {/* PENALTY RATES TABLE */}
            <Card>
                <h2 className="text-lg font-semibold mb-2">{t("Penalty Rates")}</h2>
                <MyTable
                    columns={penaltyColumns}
                    dataSource={penaltyData?.data || []}
                    isLoading={penaltyLoading}
                    pagination={false}
                />
            </Card>
        </div>
    );
}
