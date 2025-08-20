// types.ts
import { AxiosError } from "axios";

export interface ApiPagination {
    current_page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
}

export interface ApiResponse<T = unknown> {
    status: 'success' | 'error';
    message: string;
    errors: Record<string, unknown> | null;
    data: {
        items: T[];
        pagination: ApiPagination;
    };
}

export interface SingleApiResponse<T = unknown> {
    status: 'success' | 'error';
    message: string;
    errors: Record<string, unknown> | null;
    data: T;
}

export interface LoadingState {
    post: boolean;
    put: boolean;
    delete: boolean;
}

export interface ErrorState {
    post: string | null;
    put: string | null;
    delete: string | null;
}

export interface ApiParams {
    page?: number | null;
    search?: string;
    [key: string]: unknown;
}

export interface UseApiDataOptions<T = unknown> {
    enableFetch?: boolean;
    pagination?: boolean;
    limitItems?: number | null;
    initialParams?: Record<string, unknown>;
    resourceId?: string | number | null;
    refetchOnWindowFocus?: boolean;
    refetchOnReconnect?: boolean;
    refetchInterval?: number;
    retryCount?: number;
    retryDelay?: number;
    enableOptimisticUpdates?: boolean;
    infiniteScroll?: boolean;
}

export interface BaseRequestOptions {
    customEndpoint?: string | null;
    optimistic?: boolean;
    retry?: boolean;
}

export interface MutationOptions<T = unknown> extends BaseRequestOptions {
    data?: T;
    onSuccess?: (result: unknown, sentData?: T) => void;
    onError?: (error: AxiosError, sentData?: T) => void;
}

export interface UseApiDataReturn<T = unknown> {
    data: ApiResponse<T> | SingleApiResponse<T> | null;
    params: ApiParams;
    loading: LoadingState;
    isLoading: boolean;
    isInitialLoading: boolean;
    isFetching: boolean;
    fetchError: string | null;
    hasFetchError: boolean;
    get: (customEndpoint?: string | null) => Promise<unknown>;
    post: <K = unknown>(options?: MutationOptions<K>) => Promise<unknown>;
    put: <K = unknown>(options?: MutationOptions<K>) => Promise<unknown>;
    delete: <K = unknown>(options?: MutationOptions<K>) => Promise<unknown>;
    retry: () => void;
    cancel: () => void;
    loadMore: () => Promise<void>;
    updateParams: (newParams: Record<string, unknown>, refetch?: boolean) => void;
    clearFetchError: () => void;
    reset: () => void;
    refetch: (customEndpoint?: string | null) => Promise<unknown>;
}