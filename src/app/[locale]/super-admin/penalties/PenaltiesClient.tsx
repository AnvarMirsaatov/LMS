"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useActivePenaltyRate } from "@/hooks/useActivePenaltyRate";
import { useFines } from "@/hooks/useFines";
import { ActionColumns } from "@/components/pages/super-admin/penaltiesActionBtn";
import { SearchFilter } from "@/components/pages/super-admin/penaltySearchFilter";
import { FilterType } from "@/components/pages/super-admin/students";
import { useSearchParams } from "next/navigation";
import { Fine, FinesResponse, FineType } from "@/types/fine";
import { EditPenaltyRateModal } from "@/components/pages/super-admin/EditPenaltyRateModal";
export default function PenaltiesClient({
    slug,
}: {
    slug?: string;
}) {
    const t = useTranslations();

    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState<FilterType>("all");
    const [searchField, setSearchField] = useState<"fullName" | "cardNumber">("fullName");
    const [firstQuery, setFirstQuery] = useState("");
    const [secondQuery, setSecondQuery] = useState("");
    const [searchValue, setSearchValue] = useState("");

    const [modalOpen, setModalOpen] = useState(false);

    // activeRate dan pricePerDay ni olish
    const { data: activeRate, isLoading: rateLoading } = useActivePenaltyRate();

    // Query string orqali kelgan slug
    const searchParams = useSearchParams();
    const querySlug = searchParams.get("query") || undefined;
    const { data: fines, isLoading: finesLoading } = useFines({
        status: filter,
        pageNumber: page,
        pageSize: 1000,
        sortDirection: "desc",
        ...(querySlug
            ? { field: isNaN(Number(querySlug)) ? "fullName" : "id", query: querySlug }
            : searchField === "fullName"
                ? {
                    field: firstQuery && secondQuery ? "fullName" : firstQuery ? "name" : "surname",
                    query: firstQuery && secondQuery
                        ? `${firstQuery}~${secondQuery}`
                        : firstQuery || secondQuery,
                }
                : searchField === "cardNumber" && searchValue
                    ? { field: "cardNumber", query: searchValue }
                    : {}),
    });
    useEffect(() => {
        if (querySlug) {
            if (querySlug.includes("~")) {
                const [first, second] = querySlug.split("~");
                setFirstQuery(first);
                setSecondQuery(second);
            } else {
                setFirstQuery(querySlug);
                setSecondQuery("");
            }
        } else {
            setFirstQuery("");
            setSecondQuery("");
        }
    }, [querySlug]);

    return (
        <div className="space-y-6 p-2 bg-white rounded-md">
            {/* Active penalty rate */}
            <div className="p-4 border rounded bg-gray-50 flex justify-between items-start">
                <div> <h2 className="text-lg font-bold mb-2">Aktiv jarima stavkasi</h2>
                    <p>Kunlik narx: {activeRate?.pricePerDay} so'm</p>
                    <p>Sana: {activeRate?.createdAt}</p></div>
                <button
                    className="btn bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 active:scale-98"
                    onClick={() => setModalOpen(true)}
                >
                    Tahrirlash
                </button>            </div>

            {/* Search + Filter */}
            <SearchFilter
                filter={filter}
                setFilter={(val) => { setFilter(val); setPage(1); }}
                searchField={searchField}
                setSearchField={(val) => { setSearchField(val); setPage(1); }}
                firstQuery={firstQuery}
                setFirstQuery={(val) => { setFirstQuery(val); setPage(1); }}
                secondQuery={secondQuery}
                setSecondQuery={(val) => { setSecondQuery(val); setPage(1); }}
                searchValue={searchValue}
                setSearchValue={(val) => { setSearchValue(val); setPage(1); }}
            />

            {/* Fines Table */}
            <div className="overflow-x-auto">
                <table className="w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">#</th>
                            <th className="border p-2">Ism</th>
                            <th className="border p-2">Familiya</th>
                            <th className="border p-2">Kitob muallifi</th>
                            <th className="border p-2">Kitob nomi</th>
                            <th className="border p-2">Jarima turi</th>
                            <th className="border p-2">Summa</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Sana</th>
                            <th className="border p-2">Harakatlar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rateLoading || finesLoading ? (
                            Array(10).fill(0).map((_, i) => (
                                <tr key={i} className="w-['100%'] gap-2">
                                    {Array(10).fill(0).map((_, j) => (
                                        <td key={j} className="mt-2 h-6 bg-gray-200 animate-pulse border p-2 text-center"></td>
                                    ))}
                                </tr>
                            ))
                        ) : fines?.data?.length ? (
                            fines.data.map((fine: Fine, index: number) => (
                                <tr key={fine.id} className="hover:bg-gray-50">
                                    <td className="border p-2 text-center">{(page - 1) * 10 + index + 1}</td>
                                    <td className="border p-2">{fine.name} </td>
                                    <td className="border p-2"> {fine.surname}</td>
                                    <td>
                                        {fine.bookAuthor
                                            ? fine.bookAuthor.length > 20
                                                ? fine.bookAuthor.slice(0, 20) + "..."
                                                : fine.bookAuthor
                                            : "-"}
                                    </td>
                                    <td>
                                        {fine.bookTitle
                                            ? fine.bookTitle.length > 30
                                                ? fine.bookTitle.slice(0, 30) + "..."
                                                : fine.bookTitle
                                            : "-"}
                                    </td>
                                    <td className="border p-2 text-center">
                                        {fine.type === FineType.LOST ? "Yo‘qotilgan"
                                            : fine.type === FineType.DAMAGE ? "Shikastlangan"
                                                : fine.type === FineType.OVERDUE ? "Kechiktirilgan"
                                                    : "Shikastlanmagan"}
                                    </td>
                                    <td className="border p-2 text-center">{fine.amount}</td>
                                    <td className="border p-2 text-center text-wrap">
                                        {/* <Tag color={fine.resolved ? "green" : "red"}>
                                        </Tag> */}
                                        {fine.resolved ? "To'lov qilindi" : "To'lov qilinmadi"}
                                    </td>
                                    <td className="border p-2 text-center">{fine.createdAt}</td>
                                    <td className="border p-2 text-center">
                                        <ActionColumns fine={fine} onSuccess={() => { }} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={10} className="p-4 text-center">Ma’lumot topilmadi</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <EditPenaltyRateModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                currentRate={activeRate?.pricePerDay}
            />
            {/* Pagination */}
            <div className="flex items-center gap-4">

                <button
                    className="border px-3 py-1 rounded disabled:opacity-50"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                >
                    Prev
                </button>
                <span>{page} / {fines?.totalPages}</span>
                <button
                    className="border px-3 py-1 rounded disabled:opacity-50"
                    disabled={page === fines?.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </button>
            </div>

        </div >
    );
}
