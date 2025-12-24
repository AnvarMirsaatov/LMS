"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Fine, FineType } from "@/types/fine";

interface FineSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fineProps?: Fine | null; // optional qilindi
    title: string;
}

export function FineSheet({
    open,
    onOpenChange,
    fineProps,
    title,
}: FineSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="bg-white dark:bg-background w-fit" side="center">
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                </SheetHeader>

                {!fineProps ? null : (
                    <div className="mt-4 space-y-4">
                        {fineProps.type === FineType.OVERDUE && (
                            <form action="" className="space-y-4 text-center">
                                <select className="border rounded p-2 w-full">
                                    <option value="Naqd pul">Naqd pul</option>
                                    <option value="Plastik karta">Plastik karta</option>
                                    <option value="Onlayn to'lov">Onlayn to'lov</option>
                                </select>
                                <textarea name="" placeholder="Tafsilotini kiriting" className="w-full border rounded p-2"
                                    id=""></textarea>
                                <button type="button" className="bg-green-600 text-white px-4 py-2 rounded">Tasdiqlash</button>
                            </form>
                        )}

                        {(fineProps.type === FineType.LOST ||
                            fineProps.type === FineType.DAMAGE) && (
                                <form action="" className="space-y-4 text-center">
                                    <select className="border rounded p-2 w-full">
                                        <option value="Kitobni o‘zini topib topshirdi">
                                            Kitobni o‘zini topib topshirdi
                                        </option>
                                        <option value="Kitobni qiymatini to‘ladi">
                                            Kitobni qiymatini to‘ladi
                                        </option>
                                        <option value="Boshqa kitob bilan to‘ladi">
                                            Boshqa kitob bilan to‘ladi
                                        </option>
                                    </select>
                                    <textarea name="" placeholder="Tafsilotini kiriting" className="w-full border rounded p-2"
                                        id=""></textarea>
                                    <button type="button" className="bg-green-600 text-white px-4 py-2 rounded">Tasdiqlash</button>
                                </form>
                            )}
                        {fineProps.type === FineType.IRREPARABLE_DAMAGE && (
                            <form action="" className="space-y-4 text-center">
                                <select className="border rounded p-2 w-full">
                                    <option value="Kitobni qiymatini to‘ladi">
                                        Kitobni qiymatini to‘ladi
                                    </option>
                                    <option value="Boshqa kitob bilan to‘ladi">
                                        Boshqa kitob bilan to‘ladi
                                    </option>
                                </select>
                                <textarea name="" placeholder="Tafsilotini kiriting" className="w-full border rounded p-2"
                                    id=""></textarea>
                                <button type="button" className="bg-green-600 text-white px-4 py-2 rounded">Tasdiqlash</button>
                            </form>
                        )}
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
