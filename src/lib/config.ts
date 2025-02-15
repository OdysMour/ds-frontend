import { env } from '$env/dynamic/public';

export const API_URL = env.PUBLIC_API_URL;

export const makeApiUrl = (path: string): string => {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${API_URL}/${cleanPath}`;
};

interface ApiOptions {
    method?: string;
    token?: string;
    body?: any;
}

class ApiError extends Error {
    status: number;
    data?: any;

    constructor(response: Response, data?: any) {
        super(response.statusText);
        this.name = 'ApiError';
        this.status = response.status;
        this.data = data;
    }
}

export const apiCall = async (path: string, options: ApiOptions = {}) => {
    const { method = 'GET', token, body } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const fetchOptions: RequestInit = {
        method,
        headers
    };

    if (body) {
        fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(makeApiUrl(path), fetchOptions);
    
    // For 204 No Content responses, return null
    if (response.status === 204) {
        return null;
    }

    // Try to parse response as JSON regardless of status
    const contentType = response.headers.get('content-type');
    let data = null;
    
    if (contentType && contentType.includes('application/json')) {
        try {
            data = await response.json();
        } catch (e) {
            console.error('Failed to parse JSON response:', e);
        }
    }

    // If response is not ok, throw error with parsed data
    if (!response.ok) {
        throw new ApiError(response, data);
    }

    // Return successfully parsed data
    return data;
};