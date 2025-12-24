"use client";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { usePenaltyRateUpdate } from "@/hooks/usePenaltyRateUpdate";

interface EditPenaltyRateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentRate?: number;
}

export const EditPenaltyRateModal = ({ open, onOpenChange, currentRate }: EditPenaltyRateModalProps) => {
    const [price, setPrice] = useState(currentRate || 0);
    const mutation = usePenaltyRateUpdate();

    useEffect(() => {
        setPrice(currentRate || 0);
    }, [currentRate]);

    const handleSubmit = () => {
        if (price <= 0) return;

        mutation.mutate(
            { pricePerDay: price },
            {
                onSuccess: () => onOpenChange(false),
            }
        );
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="center" className="w-96 bg-white dark:bg-background">
                <SheetHeader>
                    <SheetTitle>Jarima stavkasini tahrirlash</SheetTitle>
                </SheetHeader>

                <div className="mt-4 space-y-4">
                    <input
                        type="number"
                        min={1000}
                        step={1000}
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                        className="w-full border rounded p-2"
                    />
                    <button
                        className={`bg-green-600 text-white px-4 py-2 rounded ${mutation.isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={handleSubmit}
                        disabled={mutation.isLoading}
                    >
                        {mutation.isLoading ? "Yangilanmoqda..." : "Yangilash"}
                    </button>
                </div>
            </SheetContent>
        </Sheet>
    );
};
