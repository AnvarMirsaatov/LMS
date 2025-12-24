// types/fine.ts

export enum FineType {
    OVERDUE = "OVERDUE",
    DAMAGE = "DAMAGE",
    LOST = "LOST",
    IRREPARABLE_DAMAGE = "IRREPARABLE_DAMAGE",
}

export interface Fine {
    id: number;

    name?: string;
    surname?: string;
    faculty?: string;

    bookAuthor?: string;
    bookTitle?: string;
    inventoryNumber?: string;

    type: FineType;
    amount: number;
    resolved?: boolean;

    createdAt?: string;
}

export interface FinesResponse {
    data: Fine[];
    totalPages: number;
    currentPage: number;
    totalElements: number;
}

export interface CreatePenaltyData {
    type: "lost" | "irreparable_damage" | "damage";
    fineId?: number; // agar kerak bo‘lsa
    details: string;
}