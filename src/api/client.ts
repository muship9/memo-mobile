/**
 * HTTP クライアント共通処理
 */

export interface ApiError {
  message: string
  status: number
  statusText: string
}

/**
 * APIクライアントファクトリー
 */
export const createApiClient = (baseUrl: string, defaultHeaders: Record<string, string> = {}) => {
  const request = async <T>(
    path: string, 
    options: RequestInit & { params?: Record<string, string> } = {}
  ): Promise<T> => {
    const { params, ...requestOptions } = options
    
    let url = `${baseUrl}${path}`
    
    // Add query parameters
    if (params) {
      const searchParams = new URLSearchParams(params)
      url += `?${searchParams.toString()}`
    }
    
    const response = await fetch(url, {
      ...requestOptions,
      headers: {
        ...defaultHeaders,
        ...requestOptions.headers,
      },
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `API error: ${response.status}`
      
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.message || errorMessage
      } catch {
        // Ignore JSON parse error
      }
      
      const error: ApiError = {
        message: errorMessage,
        status: response.status,
        statusText: response.statusText,
      }
      
      throw error
    }
    
    return response.json()
  }

  const get = async <T>(path: string, params?: Record<string, string>): Promise<T> => {
    return request<T>(path, { method: 'GET', params })
  }

  const post = async <T>(path: string, data?: unknown): Promise<T> => {
    return request<T>(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  const put = async <T>(path: string, data?: unknown): Promise<T> => {
    return request<T>(path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  const remove = async <T>(path: string): Promise<T> => {
    return request<T>(path, { method: 'DELETE' })
  }

  return {
    request,
    get,
    post,
    put,
    delete: remove,
  }
}

// 後方互換性のためのクラス風ラッパー
export const ApiClient = createApiClient