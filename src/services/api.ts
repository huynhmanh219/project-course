
export const API_BASE_URL = 'http://localhost:3000/api'; // Backend port

const getAuthHeaders = (): any => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const handleApiResponse = <T>(response: any): T => {
  if (response && response.status === 'success') {
    return response.data;
  }
  return response;
};

export const handleApiError = (error: any): Error => {
  console.error('API Error:', error);
  
  if (error.response) {
    const message = error.response.data?.message || error.response.statusText || 'Server error';
    return new Error(message);
  } else if (error.request) {
    return new Error('No response from server');
  } else {
    return new Error(error.message || 'Unknown error');
  }
};

export const apiClient = {
  get: async (url: string): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('GET Error:', error);
      throw error;
    }
  },

  post: async (url: string, data: any): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('POST Error:', error);
      throw error;
    }
  },

  put: async (url: string, data: any): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('PUT Error:', error);
      throw error;
    }
  },

  delete: async (url: string): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('DELETE Error:', error);
      throw error;
    }
  }
};

export const testConnection = async (): Promise<any> => {
  try {
    const response = await fetch('http://localhost:3000/health');
    return await response.json();
  } catch (error: any) {
    console.error('Connection test failed:', error);
    throw error;
  }
};

export default apiClient; 