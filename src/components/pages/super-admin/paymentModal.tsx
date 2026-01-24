"use client";

import {
  useDeletePenalties,
  useSettleFineMoney,
} from "@/components/models/queries/admin";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Fine, FineType } from "@/types/fine";
import { useEffect, useState } from "react";

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
  interface FineSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fineProps?: Fine | null;
    title: string;
  }
  const [paymentType, setPaymentType] = useState("Naqd pul");
  const [comment, setComment] = useState("");

  const { mutate, isPending } = useSettleFineMoney(fineProps?.id!);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fineProps) return;

    mutate(
      {
        paymentType,
        comment,
      },
      {
        onSuccess: () => {
          onOpenChange(false); // sheet yopiladi
          setComment("");
        },
      },
    );
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-white dark:bg-background w-fit" side="center">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        {!fineProps ? null : (
          <div className="mt-4 space-y-4">
            {!fineProps ? null : (
              <div className="mt-4 space-y-4">
                {fineProps.type === FineType.OVERDUE && (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 text-center"
                  >
                    <select
                      className="border rounded p-2 w-full"
                      value={paymentType}
                      onChange={(e) => setPaymentType(e.target.value)}
                    >
                      <option value="Naqd pul">Naqd pul</option>
                      <option value="Plastik karta">Plastik karta</option>
                      <option value="Onlayn to'lov">Onlayn to'lov</option>
                    </select>

                    <textarea
                      placeholder="Tafsilotini kiriting"
                      className="w-full border rounded p-2"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />

                    <button
                      type="submit"
                      disabled={isPending}
                      className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
                    >
                      {isPending ? "Yuborilmoqda..." : "Tasdiqlash"}
                    </button>
                  </form>
                )}
              </div>
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
                <textarea
                  name=""
                  placeholder="Tafsilotini kiriting"
                  className="w-full border rounded p-2"
                  id=""
                ></textarea>
                <button
                  type="button"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Tasdiqlash
                </button>
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
                <textarea
                  name=""
                  placeholder="Tafsilotini kiriting"
                  className="w-full border rounded p-2"
                  id=""
                ></textarea>
                <button
                  type="button"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Tasdiqlash
                </button>
              </form>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}


interface FineSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fineProps?: Fine | null;
  title: string;
}

export function DeletePenaltiesModal({
  open,
  onOpenChange,
  fineProps,
  title,
}: FineSheetProps) {
  if (!fineProps) return null;

  const { mutate, isPending } = useDeletePenalties(fineProps.id);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      { comment },
      {
        onSuccess: () => {
          onOpenChange(false);
          setComment("");
        },
      }
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-white dark:bg-background w-fit" side="center">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4 text-center">
            <textarea
              placeholder="Tafsilotini kiriting"
              className="w-full border rounded p-2"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button
              type="submit"
              disabled={isPending}
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {isPending ? "Yuborilmoqda..." : "Tasdiqlash"}
            </button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

