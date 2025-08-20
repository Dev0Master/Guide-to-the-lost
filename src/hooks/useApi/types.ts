// types.ts
import { AxiosError } from "axios";

export interface ApiPagination {
    current_page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
}

export interface ApiResponse<T = any> {
    status: 'success' | 'error';
    message: string;
    errors: any;
    data: {
        items: T[];
        pagination: ApiPagination;
    };
}

export interface SingleApiResponse<T = any> {
    status: 'success' | 'error';
    message: string;
    errors: any;
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
    [key: string]: any;
}

export interface UseApiDataOptions<T = any> {
    enableFetch?: boolean;
    pagination?: boolean;
    limitItems?: number | null;
    initialParams?: Record<string, any>;
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

export interface MutationOptions<T = any> extends BaseRequestOptions {
    data?: T;
    onSuccess?: (result: any, sentData?: T) => void;
    onError?: (error: AxiosError, sentData?: T) => void;
}

export interface UseApiDataReturn<T = any> {
    data: ApiResponse<T> | SingleApiResponse<T> | null;
    params: ApiParams;
    loading: LoadingState;
    isLoading: boolean;
    isInitialLoading: boolean;
    isFetching: boolean;
    fetchError: string | null;
    hasFetchError: boolean;
    get: (customEndpoint?: string | null) => Promise<any>;
    post: <K = any>(options?: MutationOptions<K>) => Promise<any>;
    put: <K = any>(options?: MutationOptions<K>) => Promise<any>;
    delete: <K = any>(options?: MutationOptions<K>) => Promise<any>;
    retry: () => void;
    cancel: () => void;
    loadMore: () => Promise<void>;
    updateParams: (newParams: Record<string, any>, refetch?: boolean) => void;
    clearFetchError: () => void;
    reset: () => void;
    refetch: (customEndpoint?: string | null) => Promise<any>;
}