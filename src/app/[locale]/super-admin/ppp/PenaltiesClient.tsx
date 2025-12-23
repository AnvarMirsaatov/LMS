"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Tag } from "lucide-react";
import { useActivePenaltyRate } from "@/hooks/useActivePenaltyRate";
import { useFines } from "@/hooks/useFines";
import { ActionColumns } from "@/components/pages/super-admin/penaltiesActionBtn";
import { SearchFilter } from "@/components/pages/super-admin/penaltySearchFilter";
import { FilterType } from "@/components/pages/super-admin/students";

export default function PenaltiesClient() {
    const t = useTranslations();

    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState<FilterType>("all");
    const [searchField, setSearchField] = useState<"fullName" | "cardNumber">("fullName");
    const [firstQuery, setFirstQuery] = useState("");
    const [secondQuery, setSecondQuery] = useState("");
    const [searchValue, setSearchValue] = useState("");

    const { data: activeRate, isLoading: rateLoading } = useActivePenaltyRate();
    const { data: fines, isLoading: finesLoading } = useFines({
        status: filter,
        pageNumber: page,
        pageSize: 1000,
        sortDirection: "desc",
        ...(searchField === "fullName"
            ? {
                field: firstQuery && !secondQuery
                    ? "name"          // faqat ism bo'yicha
                    : !firstQuery && secondQuery
                        ? "surname"   // faqat familiya bo'yicha
                        : "fullName",  // ism + familiya
                query:
                    firstQuery && secondQuery
                        ? `${firstQuery}~${secondQuery}`  // ism + familiya
                        : firstQuery
                            ? firstQuery                 // faqat ism
                            : secondQuery,               // faqat familiya
            }
            : searchField === "cardNumber" && searchValue
                ? { field: "cardNumber", query: searchValue }
                : {}),
    });


    return (
        <div className="space-y-6 p-2 bg-white rounded-md">
            {/* Active penalty rate */}
            <div className="p-4 border rounded bg-gray-50">
                <h2 className="text-lg font-bold mb-2">Aktiv jarima stavkasi</h2>
                <p>Kunlik narx: {activeRate?.pricePerDay}</p>
                <p>Sana: {activeRate?.createdAt}</p>
            </div>

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
                            <th className="border p-2">Student</th>
                            <th className="border p-2">Fakultet</th>
                            <th className="border p-2">Kitob</th>
                            <th className="border p-2">Inventory №</th>
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
                                    {
                                        Array(10).fill(0).map((_, i) => (
                                            <td className=" mt-2 h-6 bg-gray-200 animate-pulse border p-2 text-center"></td>
                                        ))
                                    }
                                </tr>
                            ))
                        ) : (
                            fines?.data?.length ? (
                                fines.data.map((fine: any, index: number) => (
                                    <tr key={fine.id} className="hover:bg-gray-50">
                                        <td className="border p-2 text-center">{(page - 1) * 10 + index + 1}</td>
                                        <td className="border p-2">{fine.name} {fine.surname}</td>
                                        <td className="border p-2 whitespace-pre-line">{fine.faculty}</td>
                                        <td className="border p-2">
                                            <div className="font-medium">{fine.bookTitle}</div>
                                            <div className="text-sm text-gray-500">{fine.bookAuthor}</div>
                                        </td>
                                        <td className="border p-2 text-center">{fine.inventoryNumber}</td>
                                        <td className="border p-2 text-center">
                                            {fine.type === fine.type.LOST
                                                ? "Yo‘qotilgan"
                                                : fine.type === fine.type.DAMAGED
                                                    ? "Shikastlangan"
                                                    : "Kechiktirilgan"}
                                        </td>
                                        <td className="border p-2 text-center">{fine.amount}</td>
                                        <td className="border p-2 text-center">
                                            <Tag color={fine.resolved ? "green" : "red"}>
                                                {fine.resolved ? "Yechilgan" : "Yechilmagan"}
                                            </Tag>
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
                            ))}
                    </tbody>
                </table>
            </div>

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
        </div>
    );
}
