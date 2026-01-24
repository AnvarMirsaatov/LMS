"use client";
import { useSettleFineMoney } from "@/components/models/queries/admin";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Fine, FineType } from "@/types/fine";
import { useState } from "react";

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
  const [paymentType, setPaymentType] = useState("Naqd pul");
  const [comment, setComment] = useState("");

  const { mutate, isPending } = useSettleFineMoney(fineProps?.id!);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fineProps) return;

    if (fineProps.type) {
      // LOST uchun tanlangan variant bo'yicha
      let type: "revert" | "money" | "book-replacement" | "cancel" = "money";

      switch (paymentType) {
        case "Naqd pul":
          type = "money";
          break;
        case "Plastik karta":
          type = "money";
          break;
        case "Sababli kechiktirilgan jarimani o'chirish":
          type = "money";
          break;
          
        case "Kitobni o‘zini topib topshirdi":
          type = "revert";
          break;
        case "Kitobni qiymatini to‘ladi":
          type = "money";
          break;
        case "Boshqa kitob bilan to‘ladi":
          type = "book-replacement";
          break;
        case "Sababli kechiktirilgan jarimani o'chirish":
          type = "cancel";
          break;

        default:
          return; // variant tanlanmagan bo‘lsa yubormaymiz
      }
      console.log("bosildi");

      mutate(
        {
          type,
          data: type === "money" ? { paymentType, comment } : undefined,
        },
        {
          onSuccess: () => {
            onOpenChange(false);
            setComment("");
            setPaymentType("");
          },
        },
      );
    }
  };

  console.log(fineProps);

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
                      onChange={(e) => {
                        return setPaymentType(e.target.value);
                      }}
                    >
                      <option value="Naqd pul">Naqd pul</option>
                      <option value="Plastik karta">Plastik karta</option>
                      <option value="Onlayn to'lov">Onlayn to'lov</option>
                      <option value="Sababli kechiktirilgan jarimani o'chirish">
                        Sababli kechiktirilgan jarimani o'chirish
                      </option>
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
                      className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60 z-index-5"
                    >
                      {isPending ? "Yuborilmoqda..." : "Tasdiqlash"}
                    </button>
                  </form>
                )}
              </div>
            )}
            {fineProps.type === FineType.LOST && (
              <form onSubmit={handleSubmit} className="space-y-4 text-center">
                <select
                  className="border rounded p-2 w-full"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                >
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
                  placeholder="Tafsilotini kiriting"
                  className="w-full border rounded p-2"
                  value={comment} // <-- value bog‘landi
                  onChange={(e) => setComment(e.target.value)} // <-- onChange bog‘landi
                />

                <button
                  type="submit"
                  disabled={isPending || !paymentType}
                  className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
                >
                  {isPending ? "Yuborilmoqda..." : "Tasdiqlash"}
                </button>
              </form>
            )}
            {fineProps.type === FineType.DAMAGE && (
              <form onSubmit={handleSubmit} className="space-y-4 text-center">
                <select
                  className="border rounded p-2 w-full"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                >
                  {" "}
                  <option value="Kitobni o‘zini topib topshirdi">
                    Kitobni o‘zini topib topshirdi
                  </option>
                  <option value="Boshqa kitob bilan to‘ladi">
                    Boshqa kitob bilan to‘ladi
                  </option>
                  <option value="Kitobni qiymatini to‘ladi">
                    Kitobni qiymatini to‘ladi
                  </option>
                </select>
                <textarea
                  placeholder="Tafsilotini kiriting"
                  className="w-full border rounded p-2"
                  value={comment} // <-- value bog‘landi
                  onChange={(e) => setComment(e.target.value)} // <-- onChange bog‘landi
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Tasdiqlash
                </button>
              </form>
            )}
            {fineProps.type === FineType.IRREPARABLE_DAMAGE && (
              <form onSubmit={handleSubmit} className="space-y-4 text-center">
                <select
                  className="border rounded p-2 w-full"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                >
                  <option value="Kitobni qiymatini to‘ladi">
                    Kitobni qiymatini to‘ladi
                  </option>
                  <option value="Boshqa kitob bilan to‘ladi">
                    Boshqa kitob bilan to‘ladi
                  </option>
                </select>

                <textarea
                  placeholder="Tafsilotini kiriting"
                  className="w-full border rounded p-2"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <button
                  type="submit"
                  disabled={isPending || !paymentType}
                  className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
                >
                  {isPending ? "Yuborilmoqda..." : "Tasdiqlash"}
                </button>
              </form>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
