'use client'
import { useState, useCallback, useEffect, useRef } from "react";
import { AxiosResponse } from "axios";
import  apiClient  from "@/lib/axiosClients";
import {
    ApiResponse,
    SingleApiResponse,
    LoadingState,
    ErrorState,
    ApiParams,
    UseApiDataOptions,
    UseApiDataReturn,
    MutationOptions
} from './types';
import {
    buildBaseURL,
    buildFetchURL,
    handleApiError,
    createOptimisticItem
} from './utils';

export const useApiData = <T extends object = any>(
    endpoint: string, 
    options: UseApiDataOptions<T> = {}
): UseApiDataReturn<T> => {
    const {
        enableFetch = false,
        pagination = false,
        limitItems = null,
        initialParams = {},
        resourceId = null,
        refetchOnWindowFocus = false,
        refetchOnReconnect = false,
        refetchInterval,
        retryCount = 30000,
        retryDelay = 100000,
        enableOptimisticUpdates = false,
        infiniteScroll = false
    } = options;
    
    // State
    const [data, setData] = useState<ApiResponse<T> | SingleApiResponse<T> | null>(null);
    const [params, setParams] = useState<ApiParams>({
        page: pagination ? 1 : null,
        search: "",
        ...initialParams,
    });
    const [loading, setLoading] = useState<LoadingState>({ post: false, put: false, delete: false });
    const [errors, setErrors] = useState<ErrorState>({ post: null, put: null, delete: null });
    const [isInitialLoading, setIsInitialLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [retryAttempts, setRetryAttempts] = useState<number>(0);
    const [optimisticItems, setOptimisticItems] = useState<T[]>([]);
    
    // Refs
    const abortControllerRef = useRef<AbortController | null>(null);
    const requestIdRef = useRef<number>(0);
    const isMountedRef = useRef(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            abortControllerRef.current?.abort();
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const cancel = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, []);

    const retry = useCallback(() => get(), []);

    // GET method
    const get = useCallback(async (customEndpoint?: string | null): Promise<any> => {
        const url = customEndpoint ? buildBaseURL(customEndpoint) : buildFetchURL(endpoint, params, limitItems, resourceId);
        
        if (!url) {
            setFetchError("Invalid URL");
            return null;
        }

        cancel();
        abortControllerRef.current = new AbortController();
        const currentRequestId = ++requestIdRef.current;
        
        const isFirstLoad = data === null;
        setIsFetching(true);
        if (isFirstLoad) setIsInitialLoading(true);
        setFetchError(null);

        try {
            const dataRes = await apiClient.get(url, { signal: abortControllerRef.current.signal });

            if (currentRequestId === requestIdRef.current && isMountedRef.current) {
                const apiResponse: ApiResponse<T> | SingleApiResponse<T> = dataRes.data;

                if (infiniteScroll && params.page && params.page > 1 && 'items' in apiResponse.data) {
                    const listResponse = apiResponse as ApiResponse<T>;
                    const currentData = data as ApiResponse<T>;
                    
                    if (currentData && 'items' in currentData.data) {
                        setData({
                            ...listResponse,
                            data: {
                                ...listResponse.data,
                                items: [...currentData.data.items, ...listResponse.data.items]
                            }
                        });
                    } else {
                        setData(listResponse);
                    }
                } else {
                    setData(apiResponse);
                }
                
                setRetryAttempts(0);
            }
            
            return dataRes.data;

        } catch (error: any) {
            if (error.name === 'AbortError' || !isMountedRef.current) return null;

            if (retryAttempts < retryCount && error.response?.status !== 404) {
                setRetryAttempts(prev => prev + 1);
                setTimeout(() => {
                    if (isMountedRef.current) get(customEndpoint);
                }, retryDelay * Math.pow(2, retryAttempts));
                return null;
            }
            
            setFetchError(handleApiError(error));
            throw error;
        } finally {
            if (isMountedRef.current) {
                setIsFetching(false);
                setIsInitialLoading(false);
            }
        }
    }, [endpoint, params, limitItems, resourceId, data, retryAttempts, retryCount, retryDelay, infiniteScroll, cancel]);

    // POST method
    const post = useCallback(async <K = any>(options: MutationOptions<K> = {}): Promise<any> => {
        const { data: postData, customEndpoint, onSuccess, onError, optimistic = enableOptimisticUpdates } = options;
        const url = buildBaseURL(customEndpoint || endpoint);

        setLoading(prev => ({ ...prev, post: true }));
        setErrors(prev => ({ ...prev, post: null }));

        if (optimistic && postData && data && 'items' in data.data) {
            const optimisticItem = createOptimisticItem(postData);
            setOptimisticItems([optimisticItem as unknown as T]);
            const currentData = data as ApiResponse<T>;
            setData({
                ...currentData,
                data: {
                    ...currentData.data,
                    items: [optimisticItem as unknown as T, ...currentData.data.items]
                }
            });
        }

        try {
            const response: AxiosResponse = await apiClient.post(url, postData);
            const apiResponse = response.data;

            if (optimistic && optimisticItems.length > 0) {
                setOptimisticItems([]);
                get();
            }

            onSuccess?.(apiResponse, postData);
            return apiResponse;

        } catch (error: any) {
            if (optimistic && optimisticItems.length > 0) {
                setOptimisticItems([]);
                get();
            }

            const errorMsg = handleApiError(error);
            setErrors(prev => ({ ...prev, post: errorMsg }));
            onError?.(error, postData);
            throw error;
        } finally {
            if (isMountedRef.current) setLoading(prev => ({ ...prev, post: false }));
        }
    }, [endpoint, enableOptimisticUpdates, data, optimisticItems, get]);

    // PUT method
    const put = useCallback(async <K = any>(options: MutationOptions<K> = {}): Promise<any> => {
        const { data: putData, customEndpoint, onSuccess, onError, optimistic = enableOptimisticUpdates } = options;
        const url = buildBaseURL(customEndpoint || endpoint, resourceId);

        setLoading(prev => ({ ...prev, put: true }));
        setErrors(prev => ({ ...prev, put: null }));

        try {
            const response: AxiosResponse = await apiClient.put(url, putData);
            const apiResponse = response.data;

            if (optimistic) get();
            onSuccess?.(apiResponse, putData);
            return apiResponse;

        } catch (error: any) {
            const errorMsg = handleApiError(error);
            setErrors(prev => ({ ...prev, put: errorMsg }));
            onError?.(error, putData);
            throw error;
        } finally {
            if (isMountedRef.current) setLoading(prev => ({ ...prev, put: false }));
        }
    }, [endpoint, resourceId, enableOptimisticUpdates, get]);

    // DELETE method
    const del = useCallback(async <K = any>(options: MutationOptions<K> = {}): Promise<any> => {
        const { data: deleteData, customEndpoint, onSuccess, onError, optimistic = enableOptimisticUpdates } = options;
        const url = buildBaseURL(customEndpoint || endpoint, resourceId);

        setLoading(prev => ({ ...prev, delete: true }));
        setErrors(prev => ({ ...prev, delete: null }));

        if (optimistic && resourceId && data && 'items' in data.data) {
            const currentData = data as ApiResponse<T>;
            setData({
                ...currentData,
                data: {
                    ...currentData.data,
                    items: currentData.data.items.filter((item: any) => item.id !== resourceId)
                }
            });
        }

        try {
            const config = deleteData ? { data: deleteData } : {};
            const response: AxiosResponse = await apiClient.delete(url, config);
            const apiResponse = response.data;

            if (optimistic) get();
            onSuccess?.(apiResponse, deleteData);
            return apiResponse;

        } catch (error: any) {
            if (optimistic) get();
            const errorMsg = handleApiError(error);
            setErrors(prev => ({ ...prev, delete: errorMsg }));
            onError?.(error, deleteData);
            throw error;
        } finally {
            if (isMountedRef.current) setLoading(prev => ({ ...prev, delete: false }));
        }
    }, [endpoint, resourceId, enableOptimisticUpdates, data, get]);

    const loadMore = useCallback(async (): Promise<void> => {
        if (pagination && params.page) {
            setParams(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
        }
    }, [pagination, params.page]);

    const updateParams = useCallback((newParams: Record<string, any>, refetch: boolean = false): void => {
        setParams(prev => ({ ...prev, ...newParams }));
        if (refetch && enableFetch) get();
    }, [enableFetch, get]);

    const clearFetchError = useCallback(() => setFetchError(null), []);

    const reset = useCallback((): void => {
        setData(null);
        setOptimisticItems([]);
        setRetryAttempts(0);
        setFetchError(null);
        setErrors({ post: null, put: null, delete: null });
        cancel();
    }, [cancel]);

    // Auto-fetch effect
    useEffect(() => {
        if (enableFetch) get();
    }, [enableFetch, params, resourceId]); // eslint-disable-line react-hooks/exhaustive-deps

    // Window focus refetch
    useEffect(() => {
        if (!refetchOnWindowFocus) return;
        const handleFocus = () => {
            if (enableFetch && document.visibilityState === 'visible') get();
        };
        document.addEventListener('visibilitychange', handleFocus);
        return () => document.removeEventListener('visibilitychange', handleFocus);
    }, [refetchOnWindowFocus, enableFetch, get]);

    // Network reconnect refetch
    useEffect(() => {
        if (!refetchOnReconnect) return;
        const handleOnline = () => {
            if (enableFetch) get();
        };
        window.addEventListener('online', handleOnline);
        return () => window.removeEventListener('online', handleOnline);
    }, [refetchOnReconnect, enableFetch, get]);

    // Interval refetch
    useEffect(() => {
        if (!refetchInterval || !enableFetch) return;
        intervalRef.current = setInterval(() => get(), refetchInterval);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [refetchInterval, enableFetch, get]);

    return {
        data,
        params,
        loading,
        isLoading: Object.values(loading).some(Boolean) || isFetching,
        isInitialLoading,
        isFetching,
        fetchError,
        hasFetchError: !!fetchError,
        get,
        post,
        put,
        delete: del,
        retry,
        cancel,
        loadMore,
        updateParams,
        clearFetchError,
        reset,
        refetch: get,
    };
};