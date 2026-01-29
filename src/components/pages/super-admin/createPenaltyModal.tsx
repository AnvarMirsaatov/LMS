"use client";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Fine } from "@/types/fine";
import { usePenaltyCreate } from "@/components/models/queries/admin";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface CreatePenaltyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fineProps?: Fine | null;
  booking?: { id: number } | null;
  title: string;
}

export function CreatePenaltyModal({
  open,
  onOpenChange,
  title,
  fineProps,
}: CreatePenaltyModalProps) {
  const [type, setType] = useState<"lost" | "irreparable_damage" | "damage">(
    "lost",
  );

  const [details, setDetails] = useState("");
  const { mutate, isLoading } = usePenaltyCreate();
  const createPenalty = { mutate, isLoading };
  const queryClient = useQueryClient();

  //   const handleSubmit = () => {
  //     let penaltyType: "lost" | "irreparable_damage" | "damage";
  //     switch (type) {
  //       case "lost":
  //         penaltyType = "lost";
  //         break;
  //       case "irreparable_damage":
  //         penaltyType = "irreparable_damage";
  //         break;
  //       case "damage":
  //         penaltyType = "damage";
  //         break;
  //       default:
  //         toast.error("Noma'lum jarima turi");
  //         return;
  //     }

  //     if (!details) {
  //       toast.error("Iltimos, tafsilotni kiriting");
  //       return;
  //     }

  //     createPenalty.mutate(
  //       {
  //         type: penaltyType,
  //         fineId: fineProps?.id,
  //         details,
  //       },
  //       {
  //         onSuccess: () => {
  //           toast.success("Jarima muvaffaqiyatli yaratildi!");
  //           //   setType("Naqd pul");
  //           setType("lost");
  //           setDetails("");
  //           onOpenChange(false);
  //         },
  //         onError: (err: any) => {
  //           console.error(err);
  //           toast.error("Jarima yaratishda xatolik yuz berdi");
  //         },
  //       },
  //     );
  //   };

  const handleSubmit = () => {
    if (!fineProps?.id) {
      toast.error("Booking ID topilmadi");
      return;
    }

    if (!details.trim()) {
      toast.error("Iltimos, tafsilotni kiriting");
      return;
    }

    createPenalty.mutate(
      {
        type,
        fineId: fineProps.id,
        details, // ✅ shu majburiy
      },
      {
        onSuccess: () => {
          toast.success("Jarima muvaffaqiyatli yaratildi!");
          queryClient.invalidateQueries({
            predicate: (query) => query.queryKey[0] === "fines",
          });

          setType("lost");
          setDetails("");
          onOpenChange(false);
        },

        onError: (err: any) => {
          console.error(err);
          toast.error("Jarima yaratishda xatolik yuz berdi");
        },
      },
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-white dark:bg-background w-96" side="center">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <form
            className="space-y-4 text-center"
            onSubmit={(e) => e.preventDefault()}
          >
            <select
              className="border rounded p-2 w-full"
              value={type}
              //   onChange={(e) => setType(e.target.value)}
              onChange={(e) =>
                setType(
                  e.target.value as "lost" | "irreparable_damage" | "damage",
                )
              }
            >
              <option value="lost">Yo‘qotildi deb belgilash</option>
              <option value="irreparable_damage">Yaroqsiz deb belgilash</option>
              <option value="damage">Shikas uchun jarima</option>
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
