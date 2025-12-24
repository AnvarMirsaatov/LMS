"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Fine } from "@/types/fine";
import { usePenaltyCreate } from "@/components/models/queries/admin";
import { toast } from "sonner";

interface CreatePenaltyModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fineProps?: Fine | null;
    title: string;
}

export function CreatePenaltyModal({ open, onOpenChange, title, fineProps }: CreatePenaltyModalProps) {
    const [type, setType] = useState("Naqd pul");
    const [details, setDetails] = useState("");

    // const createPenalty = usePenaltyCreate();
    const { mutate, isLoading } = usePenaltyCreate();
    const createPenalty = { mutate, isLoading };

    const handleSubmit = () => {
        let penaltyType: "lost" | "irreparable_damage" | "damage";
        switch (type) {
            case "Naqd pul":
                penaltyType = "lost";
                break;
            case "Plastik karta":
                penaltyType = "irreparable_damage";
                break;
            case "Onlayn to'lov":
                penaltyType = "damage";
                break;
            default:
                toast.error("Noma'lum jarima turi");
                return;
        }

        if (!details) {
            toast.error("Iltimos, tafsilotni kiriting");
            return;
        }

        createPenalty.mutate(
            {
                type: penaltyType,
                fineId: fineProps?.id,
                details,
            },
            {
                onSuccess: () => {
                    toast.success("Jarima muvaffaqiyatli yaratildi!");
                    setType("Naqd pul");
                    setDetails("");
                    onOpenChange(false);
                },
                onError: (err: any) => {
                    console.error(err);
                    toast.error("Jarima yaratishda xatolik yuz berdi");
                },
            }
        );
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="bg-white dark:bg-background w-96" side="center">
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                </SheetHeader>

                <div className="mt-4 space-y-4">
                    <form className="space-y-4 text-center" onSubmit={(e) => e.preventDefault()}>
                        <select
                            className="border rounded p-2 w-full"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="Naqd pul">Yo‘qotildi deb belgilash</option>
                            <option value="Plastik karta">Yaroqsiz deb belgilash</option>
                            <option value="Onlayn to'lov">Shikas uchun jarima</option>
                        </select>

                        <textarea
                            placeholder="Tafsilotini kiriting"
                            className="w-full border rounded p-2"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                        />

                        <button
                            type="button"
                            className={`bg-green-600 text-white px-4 py-2 rounded ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? "Yaratilmoqda..." : "Tasdiqlash"}
                        </button>

                    </form>
                </div>
            </SheetContent>
        </Sheet>
    );
}
