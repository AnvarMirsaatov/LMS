"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TooltipBtn from "@/components/tooltip-btn";
import { Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";

export type FilterType = "all" | "active" | "inactive";

interface SearchFilterProps {
    filter: FilterType;
    setFilter: (value: FilterType) => void;
    searchField: "fullName" | "cardNumber";
    setSearchField: (value: "fullName" | "cardNumber") => void;
    firstQuery: string;
    setFirstQuery: (value: string) => void;
    secondQuery: string;
    setSecondQuery: (value: string) => void;
    searchValue: string;
    setSearchValue: (value: string) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
    filter,
    setFilter,
    searchField,
    setSearchField,
    firstQuery,
    setFirstQuery,
    secondQuery,
    setSecondQuery,
    searchValue,
    setSearchValue,
}) => {
    const t = useTranslations();

    return (
        <div className="flex items-center gap-3">
            {/* Search Field Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <TooltipBtn
                        className="flex-shrink-0 mr-1 p-2.5 rounded-full transition-colors dark:hover:bg-gray-800"
                        title={t("Filter")}
                    >
                        <Settings2 size={18} />
                    </TooltipBtn>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem
                        onClick={() => {
                            setSearchField("fullName");
                            setSearchValue("");
                            setFirstQuery("");
                            setSecondQuery("");
                        }}
                        className={searchField === "fullName" ? "bg-blue-50 dark:bg-blue-900" : ""}
                    >
                        {t("name and lastName search")}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => {
                            setSearchField("cardNumber");
                            setSearchValue("");
                            setFirstQuery("");
                            setSecondQuery("");
                        }}
                        className={searchField === "cardNumber" ? "bg-blue-50 dark:bg-blue-900" : ""}
                    >
                        {t("Card number search")}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Input Fields */}
            <div className="flex-1 flex items-center gap-3 px-2">
                {searchField === "fullName" ? (
                    <>
                        <input
                            type="text"
                            placeholder={t("Name")}
                            value={firstQuery}
                            onChange={(e) => setFirstQuery(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
                        />
                        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600"></div>
                        <input
                            type="text"
                            placeholder={t("Last Name")}
                            value={secondQuery}
                            onChange={(e) => setSecondQuery(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
                        />
                    </>
                ) : (
                    <input
                        type="text"
                        placeholder={t("Search card number")}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="w-90 flex-1 bg-transparent outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
                    />
                )}
            </div>

            {/* Filter Tabs */}
            <Tabs value={filter} onValueChange={(a: string) => setFilter(a as FilterType)}>
                <TabsList className="flex gap-2">
                    <TabsTrigger
                        value="all"
                        className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                    >
                        Barchasi                    </TabsTrigger>
                    <TabsTrigger
                        value="resolved"
                        className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                    >
                        Tugatilgan                    </TabsTrigger>
                    <TabsTrigger
                        value="rejected"
                        className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                    >
                        Tugatilmagan                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div >
    );
};
