// components/pages/super-admin/penaltiesActionBtn.tsx
"use client";

import TooltipBtn from "@/components/tooltip-btn";
import { Eye, EllipsisVertical, GraduationCap, User } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import useLayoutStore from "@/store/layout-store";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { useTranslations } from "next-intl";
export function ActionColumns({
    fine,
    onSuccess,
}: {
    fine: any;
    onSuccess?: () => void;
}) {
    const t = useTranslations();
    const { user } = useLayoutStore();
    const role = user?.role?.toString().toLowerCase().replace("_", "-");
    const [detailOpen, setDetailOpen] = useState(false);
    const [viewingDetail, setViewingDetail] = useState<Record<
        string,
        any
    > | null>(null);
    console.log('setViewingDetail =>>>', fine);

    return (
        <div className="flex gap-2 justify-center">
            {/* DETAIL */}
            <TooltipBtn
                size="sm"
                title="Ko‘rish"
                onClick={() => {
                    console.log("Detail:", fine);
                    setDetailOpen(true);
                    setViewingDetail(fine);


                }}
            >
                <Eye size={16} />
            </TooltipBtn>

            {/* RESOLVE */}

            {role === "super-admin" && (
                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <TooltipBtn title={"Turi"}>
                            <EllipsisVertical />
                        </TooltipBtn>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white dark:bg-gray-900 rounded-lg border border-gray-300 p-1  shadow-lg">
                        <DropdownMenuItem className="hover:bg-gray-200  p-1" style={{ cursor: 'pointer' }}
                        // onClick={() => {
                        //     router.push(
                        //         `/super-admin/users/students/${record.id}?type=active`,
                        //     );
                        // }}
                        >
                            {"To'lov qilindi"}
                        </DropdownMenuItem>

                        {
                            fine.type === 'OVERDUE' &&
                            <DropdownMenuItem className="hover:bg-gray-200 p-1 " style={{ cursor: 'pointer' }}
                            // onClick={() => {
                            //     router.push(
                            //         `/super-admin/users/students/${record.id}?type=archive`,
                            //     );
                            // }}
                            >
                                {"Jarimani o'chirish"}
                            </DropdownMenuItem>}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
            }

            <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
                <SheetContent
                    className="bg-white dark:bg-background hide-scroll w-fit"
                    side={"center"}
                >
                    <SheetHeader>
                        <SheetTitle>Student Details</SheetTitle>
                    </SheetHeader>
                    {viewingDetail && (
                        <div className="mt-5 mx-5 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2.5 h-full">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Ism
                                    </label>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        {viewingDetail.name}
                                    </div>
                                </div>
                                <div className="space-y-2.5 h-full">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Familiya
                                    </label>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        {viewingDetail.surname}
                                    </div>
                                </div>
                                <div className="space-y-2.5 h-full">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Fakultet
                                    </label>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        {viewingDetail.faculty}
                                    </div>
                                </div>
                                <div className="space-y-2.5 h-full">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Inventar raqami
                                    </label>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        {fine.inventoryNumber
                                            ? fine.inventoryNumber
                                            : "-"}
                                    </div>
                                </div>
                                <div className="space-y-2.5 h-full">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Yaratilgan vaqti
                                    </label>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        {fine.createdAt}
                                    </div>
                                </div>
                                <div className="space-y-2.5 h-full">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Id
                                    </label>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        {fine.id
                                            ? fine.id
                                            : "-"}
                                    </div>
                                </div>
                                <div className="space-y-2.5 h-full">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Kitob muallifi
                                    </label>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        {fine.bookAuthor
                                        }
                                    </div>
                                </div>
                                <div className="space-y-2.5 h-full">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Kitob nomi
                                    </label>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        {fine.bookTitle
                                        }
                                    </div>
                                </div>
                                <div className="space-y-2.5 h-full">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Jarima turi
                                    </label>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        {fine.type === fine.type.LOST
                                            ? "Yo‘qotilgan"
                                            : fine.type === fine.type.DAMAGED
                                                ? "Shikastlangan"
                                                : "Kechiktirilgan"}                                    </div>
                                </div>
                                <div className="space-y-2.5 h-full">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Summa
                                    </label>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        {fine.amount
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div >
    );
}
