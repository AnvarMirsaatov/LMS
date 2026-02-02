"use client";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useActivePenaltyRate } from "@/hooks/useActivePenaltyRate";
import { useFines } from "@/hooks/useFines";
import { ActionColumns } from "@/components/pages/super-admin/penaltiesActionBtn";
import { FilterType } from "@/components/pages/super-admin/students";
import { Fine, FineType } from "@/types/fine";
import { EditPenaltyRateModal } from "@/components/pages/super-admin/EditPenaltyRateModal";
import MyTable, { IColumn } from "@/components/my-table";
import { Button, Tag } from "antd";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import ReactPaginate from "react-paginate";
import { useRouter, useSearchParams } from "next/navigation";
import TooltipBtn from "@/components/tooltip-btn";
import { TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Tabs } from "@/components/ui/tabs";
interface PenaltiesClientProps {
  slug?: string;
}
export type FineTypeFilter =
  | "all"
  | "LOST"
  | "OVERDUE"
  | "DAMAGE"
  | "IRREPARABLE_DAMAGE";

export default function PenaltiesClient({ slug }: PenaltiesClientProps) {
  const t = useTranslations();

  const [filter, setFilter] = useState<FineTypeFilter>("all");
  // const [searchField, setSearchField] = useState<"fullName" | "cardNumber">(
  //   "fullName",
  // );
  const [firstQuery, setFirstQuery] = useState("");
  const [secondQuery, setSecondQuery] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState<{
    field?: string;
    query?: string;
  }>({});

  const { data: activeRate, isLoading: rateLoading } = useActivePenaltyRate();
  const searchParams = useSearchParams();
  const querySlug = searchParams.get("query") || undefined;
  const searchPagination = useSearchParams();
  const router = useRouter();

  const [pageNumber, setPageNum] = useState<number>(
    Number(searchPagination.get("page")) || 1,
  );
  // const handlePageChange = (newPage: number) => {
  //   setPageNum(newPage);

  //   const params = new URLSearchParams(window.location.search);
  //   params.set("page", newPage.toString());

  //   if (appliedQuery.query) {
  //     params.set("query", appliedQuery.query);
  //   } else {
  //     params.delete("query");
  //   }

  //   router.push(`?${params.toString()}`);
  // };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    if (querySlug) {
      setAppliedQuery({
        field: isNaN(Number(querySlug)) ? "fullName" : "id",
        query: querySlug,
      });
    } else {
      setAppliedQuery({});
    }
  }, [querySlug]);

  const pageSize = useMemo(() => {
    return appliedQuery.query ? 100 : 10;
  }, [appliedQuery.query]);

  const queryObject = useMemo(() => {
    const name = firstQuery.trim().toUpperCase();
    const surname = secondQuery.trim().toUpperCase();

    if (!name && !surname) return {};
    if (name && !surname) {
      return {
        field: "fullName",
        query: `${name}~`,
      };
    }
    if (!name && surname) {
      return {
        field: "fullName",
        query: `~${surname}`,
      };
    }
    return {
      field: "fullName",
      query: `${name}~${surname}`,
    };
  }, [firstQuery, secondQuery]);

  const {
    data: fines = {
      data: [],
      totalPages: 1,
      currentPage: 1,
      totalElements: 0,
    },
    isLoading: finesLoading,
  } = useFines({
    status: filter === "all" ? "active" : filter,
    pageNumber,
    pageSize,
    sortDirection: "desc",
    ...(filter !== "all" && { type: filter }),
    ...appliedQuery,
  });

  const triggerSearch = () => {
    setAppliedQuery(queryObject);
    setPageNum(1);

    const params = new URLSearchParams(window.location.search);
    params.set("page", "1");

    if (queryObject.query) {
      params.set("query", queryObject.query);
    } else {
      params.delete("query");
    }

    router.push(`?${params.toString()}`);
  };

  const columns: IColumn[] = [
    {
      key: "index",
      title: "#",
      render: (_: any, __: Fine, index: number) =>
        (pageNumber - 1) * pageSize + index + 1,
    },
    {
      key: "name",
      title: "Ism",
      dataIndex: "name",
      render: (val: string) => val,
    },
    {
      key: "surname",
      title: "Familiya",
      dataIndex: "surname",
      render: (val: string) => val,
    },
    {
      key: "bookAuthor",
      title: "Kitob muallifi",
      dataIndex: "bookAuthor",
      render: (val?: string) =>
        val ? (val.length > 20 ? val.slice(0, 20) + "..." : val) : "-",
    },
    {
      key: "bookTitle",
      title: "Kitob nomi",
      dataIndex: "bookTitle",
      render: (val?: string) =>
        val ? (val.length > 30 ? val.slice(0, 30) + "..." : val) : "-",
    },
    {
      key: "type",
      title: "Jarima turi",
      dataIndex: "type",
      render: (type: FineType) => {
        switch (type) {
          case FineType.LOST:
            return "Yo‘qotilgan";
          case FineType.DAMAGE:
            return "Shikastlangan";
          case FineType.OVERDUE:
            return "Kechiktirilgan";
          case FineType.IRREPARABLE_DAMAGE:
            return "Yaroqsiz";
          default:
            return "-";
        }
      },
    },
    {
      key: "amount",
      title: "Summa",
      dataIndex: "amount",
      render: (val: number) => `${val} so'm`,
    },
    {
      key: "resolved",
      title: "Status",
      dataIndex: "resolved",
      render: (resolved: boolean) => (
        <Tag color={resolved ? "green" : "red"}>
          {resolved ? "To'lov qilindi" : "To'lov qilinmadi"}
        </Tag>
      ),
    },
    {
      key: "createdAt",
      title: "Sana",
      dataIndex: "createdAt",
    },
    {
      key: "actions",
      title: "Harakatlar",
      render: (_: any, record: Fine) => (
        <ActionColumns fine={record} onSuccess={() => {}} />
      ),
    },
  ];

  useEffect(() => {
    setPageNum(1);

    const params = new URLSearchParams(window.location.search);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  }, [pageSize]);
  const typeFromUrl = searchParams.get("type") as FineTypeFilter | null;

  useEffect(() => {
    if (typeFromUrl) {
      setFilter(typeFromUrl);
    }
  }, [typeFromUrl]);

  console.log(fines.data);

  return (
    <div className="space-y-6 p-2 bg-white rounded-md">
      <div className="p-4 border rounded bg-gray-50 flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold mb-2">Aktiv jarima stavkasi</h2>
          <p>Kunlik narx: {activeRate?.pricePerDay} so'm</p>
          <p>Sana: {activeRate?.createdAt}</p>
        </div>
        <button
          className="btn bg-green-600 text-white px-4 py-2 rounded-md hover:bg-red-500 active:scale-98"
          onClick={() => setModalOpen(true)}
        >
          Tahrirlash
        </button>
      </div>
      <MyTable
        title={<h1 className="text-xl font-bold">Jarimalar</h1>}
        columns={columns}
        dataSource={fines.data || []}
        isLoading={rateLoading || finesLoading}
        pagination={false}
        header={
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex items-center gap-3">
              <div className="flex-1 rounded-full shadow-lg p-1 flex items-center gap-2 bg-white dark:bg-gray-900">
                {/* Filter Dropdown */}
                {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <TooltipBtn
                        className="flex-shrink-0 mr-1 p-2.5 rounded-full transition-colors"
                        title={"Filter"}
                      >
                        <Settings2 size={18} />
                      </TooltipBtn>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuItem
                        onClick={() => {
                          setSearchField("cardNumber");
                          setSearchValue("");
                          setFirstQuery("");
                          setSecondQuery("");
                        }}
                        className={
                          searchField === "cardNumber" ? "bg-blue-50" : ""
                        }
                      >
                        {t("Card number")}
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          setSearchField("fullName");
                          setSearchValue("");
                          setFirstQuery("");
                          setSecondQuery("");
                        }}
                        className={searchField === "fullName" ? "bg-blue-50" : ""}
                      >
                        {t("Name and last name search")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> */}

                {/* Search Inputs */}
                <div className="flex-1 flex items-center gap-3 px-1 flex-wrap">
                  <>
                    <input
                      type="text"
                      placeholder={t("Name")}
                      value={firstQuery}
                      onChange={(e) => setFirstQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && triggerSearch()}
                      className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm dark:text-white"
                    />
                    <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 "></div>
                    <input
                      type="text"
                      placeholder={t("Last Name")}
                      value={secondQuery}
                      onChange={(e) => setSecondQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && triggerSearch()}
                      className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm dark:text-white"
                    />
                  </>
                  {/* ) : ( */}
                  {/* <input
                        type="text"
                        placeholder={t("Search")}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="w-90 flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm dark:text-white"
                      /> */}
                  {/* )} */}
                </div>
                <TooltipBtn title={t("Search")} onClick={triggerSearch}>
                  <Search size={18} />
                </TooltipBtn>
              </div>
            </div>
            {/* <Tabs
                value={filter}
                onValueChange={(val) => {
                  setFilter(val as any);
                  setPageNum(1);
                  setAppliedQuery({});

                  const params = new URLSearchParams(window.location.search);
                  params.set("page", "1");
                  params.delete("query");

                  router.push(`?${params.toString()}`);
                }}
              >
                <TabsList className="flex gap-2">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-green-600 px-2 py-1 rounded-lg data-[state=active]:text-white"
                  >
                    {t("All")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="resolved"
                    className="data-[state=active]:bg-green-600 px-2 py-1 rounded-lg data-[state=active]:text-white"
                  >
                    To'lov qilingan
                  </TabsTrigger>
                  <TabsTrigger
                    value="unresolved"
                    className="data-[state=active]:bg-green-600 px-2 py-1 rounded-lg data-[state=active]:text-white"
                  >
                    To'lov qilinmagan
                  </TabsTrigger>
                </TabsList>
              </Tabs> */}
            <Tabs
              value={filter}
              onValueChange={(val) => {
                const nextFilter = val as FineTypeFilter;

                setFilter(nextFilter);

                const params = new URLSearchParams(window.location.search);
                params.set("page", "1");

                if (nextFilter === "all") {
                  params.delete("type");
                } else {
                  params.set("type", nextFilter);
                }

                params.delete("query");

                router.push(`?${params.toString()}`);
              }}
            >
              <TabsList className="flex gap-2">
                <TabsTrigger value="all">Barchasi</TabsTrigger>

                <TabsTrigger value="LOST">Yo‘qotilgan</TabsTrigger>

                <TabsTrigger value="OVERDUE">Kechiktirilgan</TabsTrigger>

                <TabsTrigger value="DAMAGE">Shikastlangan</TabsTrigger>

                <TabsTrigger value="IRREPARABLE_DAMAGE">Yaroqsiz</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        }
        footer={
          <div
            className={
              "flex flex-col lg:flex-row justify-between items-center gap-2"
            }
          >
            <div className="font-bold text-[20px] space-y-1 flex items-center gap-5">
              <p className="text-sm">IColumn
                {t("Total Pages")}:{" "}
                <span className="text-green-600">{fines?.totalPages}</span>
              </p>
              <p className="text-sm">
                {t("Current Page")}:{" "}
                <span className="text-green-600">{fines?.currentPage}</span>
              </p>
              <p className="text-sm">
                {t("Total Elements")}:{" "}
                <span className="text-green-600">{fines?.totalElements}</span>
              </p>
            </div>

            <ReactPaginate
              breakLabel="..."
              onPageChange={(e) => handlePageChange(e.selected + 1)}
              forcePage={pageNumber - 1}
              pageRangeDisplayed={3}
              marginPagesDisplayed={1}
              pageCount={fines?.totalPages || 0}
              previousLabel={
                <Button className={"bg-white text-black"}>
                  <ChevronLeft />
                  {t("Return")}
                </Button>
              }
              nextLabel={
                <Button className={"bg-white text-black"}>
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

      <EditPenaltyRateModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        currentRate={activeRate?.pricePerDay}
      />
    </div>
  );
}
