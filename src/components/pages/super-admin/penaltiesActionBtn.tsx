// components/pages/super-admin/penaltiesActionBtn.tsx
"use client";

import TooltipBtn from "@/components/tooltip-btn";
import { Eye, CheckCircle, EllipsisVertical } from "lucide-react";
import { api } from "@/components/models/axios";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import useLayoutStore from "@/store/layout-store";
import { log } from "util";

export function ActionColumns({
    fine,
    onSuccess,
}: {
    fine: any;
    onSuccess?: () => void;
}) {
    const { user } = useLayoutStore();
    const role = user?.role?.toString().toLowerCase().replace("_", "-");
    return (
        <div className="flex gap-2 justify-center">
            {/* DETAIL */}
            <TooltipBtn
                size="sm"
                title="Ko‘rish"
                onClick={() => {
                    console.log("Detail:", fine);
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
        </div >
    );
}
