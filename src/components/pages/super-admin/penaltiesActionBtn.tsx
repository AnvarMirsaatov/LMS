"use client";
import TooltipBtn from "@/components/tooltip-btn";
import { Eye, EllipsisVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import useLayoutStore from "@/store/layout-store";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Fine, FineType } from "@/types/fine";
import { useTranslations } from "next-intl";
import { FineSheet } from "./paymentModal";

interface ActionColumnsProps {
    fine: Fine;
    onSuccess?: () => void;
}





export function ActionColumns({ fine, onSuccess }: ActionColumnsProps) {
    const t = useTranslations();
    const { user } = useLayoutStore();
    const role = user?.role?.toString().toLowerCase().replace("_", "-");
    const [detailOpen, setDetailOpen] = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [viewingDetail, setViewingDetail] = useState<Fine | null>(null);
    const [viewingPayment, setViewingPayment] = useState<Fine | null>(null);




    return (
        <div className="flex gap-2 justify-center">
            {/* DETAIL */}
            <TooltipBtn
                size="sm"
                title="Ko‘rish"
                onClick={() => {
                    setDetailOpen(true);
                    setViewingDetail(fine);
                }}
            >
                <Eye size={16} />
            </TooltipBtn>

            {/* RESOLVE */}
            {role === "super-admin" && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <TooltipBtn title={"Turi"}>
                            <EllipsisVertical />
                        </TooltipBtn>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white dark:bg-gray-900 rounded-lg border border-gray-300 p-1 shadow-lg">
                        <DropdownMenuItem
                            className="hover:bg-gray-200 p-1"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                setPaymentOpen(true);
                                setViewingPayment(fine);
                            }}
                        >
                            To'lov qilindi
                        </DropdownMenuItem>

                        {fine.type === FineType.OVERDUE && (
                            <DropdownMenuItem
                                className="hover:bg-gray-200 p-1"
                                style={{ cursor: "pointer" }}
                            >
                                {"Jarimani o'chirish"}
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
                <SheetContent
                    className="bg-white dark:bg-background hide-scroll w-fit"
                    side={"center"}
                >
                    <SheetHeader>
                        <SheetTitle>Student haqida</SheetTitle>
                    </SheetHeader>
                    {viewingDetail && (
                        <div className="mt-5 mx-5 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2.5 h-full">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Student
                                    </label>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        {viewingDetail.surname} {viewingDetail.name}
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
                                        Jarima yaratilgan vaqti
                                    </label>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        {fine.createdAt}
                                    </div>
                                </div>
                                <div className="space-y-2.5 h-full">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Inventar raqami
                                    </label>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        {fine.inventoryNumber ?? "-"}
                                    </div>
                                </div>

                                <div className="space-y-2.5 h-full">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Kitob muallifi
                                    </label>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        {fine.bookAuthor}
                                    </div>
                                </div>
                                <div className="space-y-2.5 h-full">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Kitob nomi
                                    </label>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        {fine.bookTitle}
                                    </div>
                                </div>
                                <div className="space-y-2.5 h-full">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Jarima turi
                                    </label>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        {fine.type === FineType.LOST
                                            ? "Yo‘qotilgan"
                                            : fine.type === FineType.DAMAGE
                                                ? "Shikastlangan"
                                                : "Kechiktirilgan"}
                                    </div>
                                </div>
                                <div className="space-y-2.5 h-full">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Summa
                                    </label>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        {fine.amount} so'm
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            <FineSheet
                open={paymentOpen}
                onOpenChange={setPaymentOpen}
                fineProps={viewingPayment}
                title="Jarimani hal qilish"
            />
        </div>
    );
}
