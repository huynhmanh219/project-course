import { API_BASE_URL } from './api';
import { authService } from './auth.service';

export interface MaterialType {
  DOCUMENT: 'document';
  VIDEO: 'video';
  AUDIO: 'audio';
  IMAGE: 'image';
  LINK: 'link';
}

export interface Material {
  id: number;
  title: string;
  description?: string;
  file_path?: string;
  file_name?: string;
  file_size?: number;
  file_size_formatted?: string;
  mime_type?: string;
  material_type: 'document' | 'video' | 'audio' | 'image' | 'link';
  chapter_id?: number;
  subject_id: number;
  uploaded_by: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  
  // Relations
  subject?: {
    id: number;
    subject_name: string;
    subject_code: string;
    description?: string;
  };
  chapter?: {
    id: number;
    title: string;
    description?: string;
  };
  uploader?: {
    id: number;
    first_name: string;
    last_name: string;
  };
  
  // Computed fields
  has_file?: boolean;
}

export interface CreateMaterialData {
  title: string;
  description?: string;
  subject_id: number;
  chapter_id?: number;
  material_type?: 'document' | 'video' | 'audio' | 'image' | 'link';
  is_public?: boolean;
}

export interface UpdateMaterialData {
  title?: string;
  description?: string;
  material_type?: 'document' | 'video' | 'audio' | 'image' | 'link';
  is_public?: boolean;
}

export interface MaterialQueryParams {
  page?: number;
  size?: number;
  search?: string;
  subject_id?: number;
  chapter_id?: number;
  material_type?: 'document' | 'video' | 'audio' | 'image' | 'link';
  is_public?: boolean;
  sort?: 'created_at' | 'title' | 'file_size';
  order?: 'asc' | 'desc';
}

export interface SearchMaterialParams {
  query: string;
  page?: number;
  size?: number;
}

export interface RecentMaterialParams {
  page?: number;
  size?: number;
  days?: number;
}

export interface MaterialsByTypeParams {
  type: 'document' | 'video' | 'audio' | 'image' | 'link';
  page?: number;
  size?: number;
}

export interface UploadMaterialData extends CreateMaterialData {
  file?: File;
}

export interface UploadMultipleMaterialsData {
  files: File[];
  subject_id: number;
  chapter_id?: number;
  is_public?: boolean;
}

export interface UploadProgressCallback {
  (progress: number): void;
}

class SimpleMaterialService {
  private getHeaders(): Record<string, string> {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  private getUploadHeaders(): Record<string, string> {
    const token = authService.getToken();
    return {
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  private handleAuthError(response: Response) {
    if (response.status === 401) {
      authService.logout();
      window.location.href = '/login';
      throw new Error('Authentication required');
    }
  }

  private logValidationErrors(result: any) {
    if (result.errors && Array.isArray(result.errors)) {
      result.errors.forEach((error: any, index: number) => {
      });
    }
  }

  async getMaterials(params?: MaterialQueryParams): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) {
        queryParams.append('page', String(Number(params.page)));
      }
      if (params?.size) {
        queryParams.append('size', String(Number(params.size)));
      }
      if (params?.search) {
        queryParams.append('search', params.search);
      }
      if (params?.subject_id) {
        queryParams.append('subject_id', String(Number(params.subject_id)));
      }
      if (params?.chapter_id) {
        queryParams.append('chapter_id', String(Number(params.chapter_id)));
      }
      if (params?.material_type) {
        queryParams.append('material_type', params.material_type);
      }
      if (params?.is_public !== undefined) {
        queryParams.append('is_public', String(params.is_public));
      }
      if (params?.sort) {
        queryParams.append('sort', params.sort);
      }
      if (params?.order) {
        queryParams.append('order', params.order);
      }

      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/materials${queryString ? `?${queryString}` : ''}`;
      
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        let errorMessage = 'Failed to fetch materials';
        try {
          const errorResult = await response.json();
          errorMessage = errorResult.message || errorMessage;
          this.logValidationErrors(errorResult);
        } catch (e) {
        }
        
        if (response.status === 401) {
          this.handleAuthError(response);
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();

      const safeResponse = {
        items: [],
        totalPages: 1,
        totalItems: 0,
        currentPage: params?.page || 1,
        size: params?.size || 20
      };

      if (result && result.success && result.data) {
        const data = result.data;
        
        if (data.data && Array.isArray(data.data)) {
          safeResponse.items = data.data || [];
          safeResponse.totalPages = data.totalPages || Math.ceil((data.totalItems || data.data.length) / (params?.size || 20));
          safeResponse.totalItems = data.totalItems || data.data.length;
          safeResponse.currentPage = data.currentPage || params?.page || 1;
          safeResponse.size = data.size || params?.size || 20;
        } else if (Array.isArray(data)) {
          safeResponse.items = data as never[];
          safeResponse.totalItems = data.length;
          safeResponse.totalPages = 1;
        }
      } else if (result && Array.isArray(result)) {
        safeResponse.items = result as never[];
        safeResponse.totalItems = result.length;
        safeResponse.totalPages = 1;
      }

      return safeResponse;

    } catch (error: any) {
      
      // const errorResponse = {
      //   items: [],
      //   totalPages: 1,
      //   totalItems: 0,
      //   currentPage: params?.page || 1,
      //   size: params?.size || 20,
      //   error: error.message
      // };
      
      throw error;
    }
  }

  async getMaterial(id: number): Promise<Material> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();

      if (response.ok) {
        return result.data || result;
      } else {
        this.handleAuthError(response);
        throw new Error(result.message || 'Failed to fetch material');
      }
    } catch (error: any) {
      throw error;
    }
  }

  async createMaterial(data: CreateMaterialData): Promise<Material> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/materials`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        return result.data || result;
      } else {
        this.handleAuthError(response);
        this.logValidationErrors(result);
        throw new Error(result.message || 'Failed to create material');
      }
    } catch (error: any) {
      throw error;
    }
  }

  async updateMaterial(id: number, data: UpdateMaterialData): Promise<Material> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        return result.data || result;
      } else {
        this.handleAuthError(response);
        this.logValidationErrors(result);
        throw new Error(result.message || 'Failed to update material');
      }
    } catch (error: any) {
      throw error;
    }
  }

  // DELETE /materials/:id
  async deleteMaterial(id: number): Promise<any> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      const result = await response.json();

      if (response.ok) {
        return result.data || result;
      } else {
        this.handleAuthError(response);
        throw new Error(result.message || 'Failed to delete material');
      }
    } catch (error: any) {
      throw error;
    }
  }

  // GET /materials/:id/details 
  async getMaterialDetails(id: number): Promise<Material> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/materials/${id}/details`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();

      if (response.ok) {
        return result.data || result;
      } else {
        this.handleAuthError(response);
        throw new Error(result.message || 'Failed to fetch material details');
      }
    } catch (error: any) {
      throw error;
    }
  }

 

  // POST /materials/upload
  async uploadMaterial(data: UploadMaterialData, onProgress?: UploadProgressCallback): Promise<Material> {
    try {
      
      const formData = new FormData();
      
      if (data.file) {
        formData.append('material', data.file);
      }
      
      formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      formData.append('subject_id', String(data.subject_id));
      if (data.chapter_id) formData.append('chapter_id', String(data.chapter_id));
      if (data.material_type) formData.append('material_type', data.material_type);
      formData.append('is_public', String(data.is_public || false));

      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        };

        xhr.onload = () => {
          try {
            const result = JSON.parse(xhr.responseText);

            if (xhr.status === 201) {
              resolve(result.data || result);
            } else {
              if (xhr.status === 401) {
                authService.logout();
                window.location.href = '/login';
                reject(new Error('Authentication required'));
                return;
              }
              this.logValidationErrors(result);
              reject(new Error(result.message || 'Failed to upload material'));
            }
          } catch (error) {
            reject(new Error('Failed to parse response'));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Upload failed'));
        };

        xhr.open('POST', `${API_BASE_URL}/materials/upload`);
        
        // Set auth header
        const token = authService.getToken();
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        
        xhr.send(formData);
      });
    } catch (error: any) {
      throw error;
    }
  }

  // GET /materials/:id/download
  async downloadMaterial(id: number, filename?: string): Promise<void> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/materials/${id}/download`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || `material_${id}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        this.handleAuthError(response);
        const result = await response.json();
        throw new Error(result.message || 'Failed to download material');
      }
    } catch (error: any) {      
      throw error;
    }
  }

  // POST /materials/upload-multiple
  async uploadMultipleMaterials(data: UploadMultipleMaterialsData, onProgress?: UploadProgressCallback): Promise<Material[]> {
    try {
      
      const formData = new FormData();
      
      data.files.forEach((file) => {
        formData.append('materials', file);
      });
      
      formData.append('subject_id', String(data.subject_id));
      if (data.chapter_id) formData.append('chapter_id', String(data.chapter_id));
      formData.append('is_public', String(data.is_public || false));

      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        };

        xhr.onload = () => {
          try {
            const result = JSON.parse(xhr.responseText);

            if (xhr.status === 201) {
              resolve(result.data || result);
            } else {
              if (xhr.status === 401) {
                authService.logout();
                window.location.href = '/login';
                reject(new Error('Authentication required'));
                return;
              }
              this.logValidationErrors(result);
              reject(new Error(result.message || 'Failed to upload materials'));
            }
          } catch (error) {
            reject(new Error('Failed to parse response'));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Upload failed'));
        };

        xhr.open('POST', `${API_BASE_URL}/materials/upload-multiple`);
        
        // Set auth header
        const token = authService.getToken();
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        
        xhr.send(formData);
      });
    } catch (error: any) {
      throw error;
    }
  }

 
  // GET /materials/search
  async searchMaterials(params: SearchMaterialParams): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      
      queryParams.append('query', params.query);
      if (params.page) queryParams.append('page', String(Number(params.page)));
      if (params.size) queryParams.append('size', String(Number(params.size)));

      const url = `${API_BASE_URL}/materials/search?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();

      if (response.ok) {
        return result.data || result;
      } else {
        this.handleAuthError(response);
        throw new Error(result.message || 'Failed to search materials');
      }
    } catch (error: any) {
      throw error;
    }
  }

      // GET /materials/recent
  async getRecentMaterials(params?: RecentMaterialParams): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', String(Number(params.page)));
      if (params?.size) queryParams.append('size', String(Number(params.size)));
      if (params?.days) queryParams.append('days', String(Number(params.days)));

      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/materials/recent${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();

      if (response.ok) {
        return result.data || result;
      } else {
        this.handleAuthError(response);
        throw new Error(result.message || 'Failed to fetch recent materials');
      }
    } catch (error: any) {
      throw error;
    }
  }

  // GET /materials/by-type
  async getMaterialsByType(params: MaterialsByTypeParams): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      
      queryParams.append('type', params.type);
      if (params.page) queryParams.append('page', String(Number(params.page)));
      if (params.size) queryParams.append('size', String(Number(params.size)));

      const url = `${API_BASE_URL}/materials/by-type?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();

      if (response.ok) {
        return result.data || result;
      } else {
        this.handleAuthError(response);
        throw new Error(result.message || 'Failed to fetch materials by type');
      }
    } catch (error: any) {
      throw error;
    }
  }

  // Get materials by subject
  async getMaterialsBySubject(subjectId: number, params?: Omit<MaterialQueryParams, 'subject_id'>): Promise<Material[]> {
    try { 
      
      const response = await this.getMaterials({ 
        ...params,
        subject_id: subjectId,
        size: params?.size || 100
      });
      
      if (response && response.data) {
        return response.data;
      } else if (response && response.items) {
        return response.items;
      } else if (Array.isArray(response)) {
        return response;
      }
      
      return [];
    } catch (error: any) {
      throw error;
    }
  }

  // Get materials by chapter
  async getMaterialsByChapter(chapterId: number, params?: Omit<MaterialQueryParams, 'chapter_id'>): Promise<Material[]> {
    try {
      
      const response = await this.getMaterials({ 
        ...params,
        chapter_id: chapterId,
        size: params?.size || 100
      });
      
      if (response && response.data) {
        return response.data;
      } else if (response && response.items) {
        return response.items;
      } else if (Array.isArray(response)) {
        return response;
      }
      
      return [];
    } catch (error: any) {
      throw error;
    }
  }

  async getMaterialStats(subjectId?: number): Promise<{ total: number; by_type: Record<string, number> }> {
    try {
      const params = subjectId ? { subject_id: subjectId, size: 1000 } : { size: 1000 };
      const response = await this.getMaterials(params);
      
      let materials: Material[] = [];
      
      if (response && response.data) {
        materials = response.data;
      } else if (response && response.items) {
        materials = response.items;
      } else if (Array.isArray(response)) {
        materials = response;
      }
      
      const stats = {
        total: materials.length,
        by_type: {
          document: 0,
          video: 0,
          audio: 0,
          image: 0,
          link: 0
        }
      };
      
      materials.forEach(material => {
        if (stats.by_type[material.material_type] !== undefined) {
          stats.by_type[material.material_type]++;
        }
      });
      
      return stats;
    } catch (error: any) {
      return { total: 0, by_type: { document: 0, video: 0, audio: 0, image: 0, link: 0 } };
    }
  }

  async checkFileExists(materialId: number): Promise<boolean> {
    try {
      const material = await this.getMaterial(materialId);
      return !!(material.file_path && material.has_file);
    } catch (error) {
      return false;
    }
  }

  formatFileSize(bytes?: number): string {
    if (!bytes) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.some(type => file.type.includes(type) || file.name.toLowerCase().endsWith(type));
  }

  validateFileSize(file: File, maxSizeMB: number): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }
}

export const simpleMaterialService = new SimpleMaterialService(); 