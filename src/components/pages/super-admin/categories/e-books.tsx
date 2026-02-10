"use client";

import {
  ChevronLeft,
  ChevronRight,
  PenSquareIcon,
  Plus,
  Search,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import DeleteActionDialog from "@/components/delete-action-dialog";
import { AutoForm, FormField } from "@/components/form/auto-form";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/components/models/queries/e-books-categories";
import MyTable, { IColumn } from "@/components/my-table";
import TooltipBtn from "@/components/tooltip-btn";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import ReactPaginate from "react-paginate";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

const EBookCategories = () => {
  const t = useTranslations();
  // const { data: categories, isLoading } = useCategories();

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  // pagination
  const searchPagination = useSearchParams();
  const router = useRouter();

  const [appliedQuery, setAppliedQuery] = useState<{
    field?: string;
    query?: string;
  }>({});

  // Hozirgi sahifa
  const [pageNumber, setPageNum] = useState<number>(
    Number(searchPagination.get("page")) || 1,
  );

  // Sahifa o‘lchami
  const pageSize = useMemo(() => {
    return appliedQuery.query ? 100 : 10;
  }, [appliedQuery.query]);

  // Sahifa o'zgarganda URL va state yangilash
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const triggerSearch = () => {
    setAppliedQuery({ field: "name", query: search });
    setPageNum(1); // yangi search bo‘lsa, sahifa 1 ga qaytadi

    const params = new URLSearchParams(window.location.search);
    params.set("page", "1");
    if (search) params.set("query", search);
    else params.delete("query");

    router.push(`?${params.toString()}`);
  };

  const { data: categories, isLoading } = useCategories();

  // const { data: categories, isLoading } = useCategories({
  //   pageNumber,
  //   pageSize,
  //   ...(appliedQuery.query ? { query: appliedQuery.query } : {}),
  // });
  console.log("categories", categories);
  // pagination end

  const [submitting, setSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Record<
    string,
    any
  > | null>(null);
  const [open, setOpen] = useState(false);
  const form = useForm();

  const [search, setSearch] = useState("");
  // const filteredCategories = useMemo(() => {
  //   if (!categories?.data) return [];
  //   return categories.data.filter((item: any) =>
  //     item.name.toLowerCase().includes(search.toLowerCase()),
  //   );
  // }, [categories, search]);

  const filteredCategories = useMemo(() => {
    if (!categories?.data) return [];
    return categories.data.filter((item: any) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [categories, search]);
  const fields = useMemo<FormField[]>(
    () => [
      {
        label: t("name"),
        name: "name",
        type: "text",
        required: true,
      },
    ],
    [t],
  );

  const columns = useMemo<IColumn[]>(
    () => [
      {
        key: "index",
        dataIndex: "index",
        title: "#",
        width: 300,
        render: (_: any, __: any, index: number) => index + 1,
      },
      {
        key: "name",
        dataIndex: "name",
        title: t("name"),
        width: 350,
      },
      {
        key: "bookCount",
        dataIndex: "bookCount",
        title: t("Book count"),
        width: 400,
      },
      {
        key: "actions",
        dataIndex: "actions",
        width: 200,
        title: t("actions"),
        render: (_: any, record: any) => (
          <div className="flex gap-2">
            <TooltipBtn
              variant={"view"}
              size={"sm"}
              title={t("Edit category")}
              onClick={() => {
                setEditingCategory(record);
                form.reset({ name: record.name });
                setOpen(true);
              }}
            >
              <PenSquareIcon />
            </TooltipBtn>
            <DeleteActionDialog
              title={t("Delete category")}
              onConfirm={() => {
                deleteCategory.mutate(record.id);
              }}
            />
          </div>
        ),
      },
    ],
    [deleteCategory, form, t],
  );

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    if (editingCategory) {
      updateCategory.mutate(
        {
          id: editingCategory.id,
          name: data.name,
        },
        {
          onSuccess: () => {
            toast.success(t("Category updated successfully"));
            setSubmitting(false);
            setOpen(false);
          },
        },
      );
    } else {
      createCategory.mutate(
        {
          name: data.name,
        },
        {
          onSuccess: () => {
            toast.success(t("Category created successfully"));
            setSubmitting(false);
            setOpen(false);
          },
          onError: (error: any) => {
            if (error?.response?.status === 409) {
              toast.error(t("This category already exists"));
              setSubmitting(false);
            } else {
              toast.error(t("Error creating category"));
              setSubmitting(false);
            }
          },
        },
      );
    }
  };
  return (
    <div>
      <MyTable
        className={"p-2"}
        title={
          <h1 className="text-2xl font-semibold">
            {t("Categories of E-Base Books")}
          </h1>
        }
        columns={columns}
        isLoading={isLoading}
        dataSource={filteredCategories}
        pagination={false}
        header={
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Bar Container */}
            <div className="flex-1 rounded-full shadow-lg p-1 flex items-center gap-2">
              {/* Filter Icon (inactive state) */}
              {/*<TooltipBtn*/}
              {/*  className="flex-shrink-0 mr-1 p-2.5 rounded-full transition-colors"*/}
              {/*  title={t("Boshqa filter mavjud emas")}*/}
              {/*>*/}
              {/*  <Settings2 size={18} />*/}
              {/*</TooltipBtn>*/}

              {/* Search Input */}
              <div className="flex-1 flex items-center">
                <Input
                  placeholder={t("Search category")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                />
              </div>
              {/* <TooltipBtn
                title={t("Search")}
                className="flex-shrink-0 mr-1 p-2.5 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                <Search size={18} />
              </TooltipBtn> */}
              <TooltipBtn
                title={t("Search")}
                onClick={triggerSearch} // <-- qo‘shish
                className="flex-shrink-0 mr-1 p-2.5 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                <Search size={18} />
              </TooltipBtn>
            </div>

            {/* Add Category Button */}
            <TooltipBtn
              variant={"default"}
              title={t("Add Category")}
              onClick={() => {
                setEditingCategory(null);
                form.reset({ name: "" });
                setOpen(true);
              }}
            >
              <Plus />
              {t("Add Category")}
            </TooltipBtn>
          </div>
        }
        footer={
          <div
            className={
              "flex flex-col lg:flex-row justify-between items-center gap-2"
            }
          >
            <div className="font-bold text-[20px] space-y-1 flex items-center gap-5">
              <p className="text-sm">
                {t("Total Pages")}:{" "}
                <span className="text-green-600">{categories?.totalPages}</span>
              </p>
              <p className="text-sm">
                {t("Current Page")}:{" "}
                <span className="text-green-600">
                  {categories?.currentPage}
                </span>
              </p>
              <p className="text-sm">
                {t("Total Elements")}:{" "}
                <span className="text-green-600">
                  {categories?.totalElements}
                </span>
              </p>
            </div>

            <ReactPaginate
              breakLabel="..."
              onPageChange={(e) => handlePageChange(e.selected + 1)}
              forcePage={pageNumber - 1}
              pageRangeDisplayed={3}
              marginPagesDisplayed={1}
              pageCount={categories?.totalPages || 0}
              previousLabel={
                <Button
                  className={
                    "bg-white text-black dark:bg-gray-800 dark:text-white"
                  }
                >
                  {" "}
                  <ChevronLeft />
                  {t("Return")}
                </Button>
              }
              nextLabel={
                <Button
                  className={
                    "bg-white text-black dark:bg-gray-800 dark:text-white"
                  }
                >
                  {" "}
                  {t("Next")} <ChevronRight />
                </Button>
              }
              className={"flex justify-center gap-2 items-center my-5"}
              renderOnZeroPageCount={null}
              pageClassName="list-none"
              pageLinkClassName="px-3 py-1 rounded-full border cursor-pointer block"
              activeLinkClassName="bg-green-600 text-white rounded-full"
            />
          </div>
        }
      />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {submitting || editingCategory
                ? t("Edit Category")
                : t("Add Category")}
            </SheetTitle>
          </SheetHeader>
          <div className="p-3">
            <AutoForm
              submitText={
                submitting || editingCategory
                  ? t("Edit Category")
                  : t("Add Category")
              }
              onSubmit={onSubmit}
              form={form}
              fields={fields}
              showResetButton={false}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default EBookCategories;
