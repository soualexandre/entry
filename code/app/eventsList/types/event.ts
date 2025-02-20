export interface Event {
    id: string;
    title: string;
    description: string;
    location: string;
    time: string;
    date: string;
    startTime: string;
    image: string;
    createdAt: string;
    updatedAt: string;
    batches: Batches[];
}

export interface Batches {
    id: string;
    price: number;
    quantity: number;
    eventId: string;
    isCurrent: true;
    createdAt: string;
    updatedAt: string;
}

export interface Pagination {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

export interface ApiResponse<T> {
    data: T;
    pagination: Pagination;
}
