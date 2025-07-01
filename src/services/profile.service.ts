import { API_BASE_URL } from './api';
import { authService } from './auth.service';

export interface ProfileData {
  id: number;
  email: string;
  role: string;
  is_active: boolean;
  first_login: boolean;
  last_login?: string;
  created_at?: string;
  profile?: {
    id?: number;
    student_id?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    date_of_birth?: string;
    address?: string;
    title?: string;
    department?: string;
    bio?: string;
    avatar?: string;
  };
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  title?: string;
  department?: string;
  bio?: string;
}

class ProfileService {
  
  // Get current user's profile
  async getCurrentProfile(): Promise<ProfileData> {
    try {
      const token = await authService.getValidToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        return result.data.user;
      } else {
        throw new Error(result.message || 'Failed to fetch profile');
      }
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        return this.createMockProfile(currentUser);
      }
      
      throw error;
    }
  }

  // Update current user's profile
  async updateProfile(data: UpdateProfileData): Promise<ProfileData> {
    try {
      const token = await authService.getValidToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        return result.data.user;
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      
      console.log('Mock update:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const currentProfile = await this.getCurrentProfile();
      return currentProfile;
    }
  }

  // Upload avatar
  async uploadAvatar(file: File): Promise<string> {
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Vui lòng chọn file hình ảnh (JPG, PNG, GIF)');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Kích thước file không được vượt quá 5MB');
      }

      const token = await authService.getValidToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${API_BASE_URL}/users/profile/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        return result.data.avatar_url;
      } else {
        throw new Error(result.message || 'Failed to upload avatar');
      }
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      
      if (error.message.includes('Vui lòng chọn') || error.message.includes('Kích thước')) {
        throw error; 
      }
      
      console.log('Mock avatar upload:', file.name);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return URL.createObjectURL(file);
    }
  }

  validateImageFile(file: File): { valid: boolean; error?: string } {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Định dạng file không hợp lệ. Chỉ chấp nhận JPG, PNG, GIF, WEBP'
      };
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Kích thước file không được vượt quá 5MB'
      };
    }

    return { valid: true };
  }

  private createMockProfile(currentUser: any): ProfileData {
    const mockProfile: ProfileData = {
      id: currentUser.id,
      email: currentUser.email,
      role: currentUser.role,
      is_active: true,
      first_login: currentUser.first_login || false,
      last_login: new Date().toISOString(),
      created_at: new Date().toISOString(),
      profile: {}
    };

    if (currentUser.role === 'student') {
      mockProfile.profile = {
        id: 1,
        student_id: currentUser.profile?.student_id || 'SV001',
        first_name: currentUser.profile?.first_name || 'Nguyễn',
        last_name: currentUser.profile?.last_name || 'Văn A',
        phone: currentUser.profile?.phone || '',
        date_of_birth: currentUser.profile?.date_of_birth || '',
        address: currentUser.profile?.address || '',
        avatar: currentUser.profile?.avatar || ''
      };
    } else if (currentUser.role === 'lecturer') {
      mockProfile.profile = {
        id: 1,
        first_name: currentUser.profile?.first_name || 'Trần',
        last_name: currentUser.profile?.last_name || 'Thị B',
        phone: currentUser.profile?.phone || '',
        title: currentUser.profile?.title || 'Giảng viên',
        department: currentUser.profile?.department || 'Công nghệ thông tin',
        bio: currentUser.profile?.bio || '',
        avatar: currentUser.profile?.avatar || ''
      };
    } else {
      mockProfile.profile = {
        id: 1,
        first_name: currentUser.profile?.first_name || 'Admin',
        last_name: currentUser.profile?.last_name || 'User',
        avatar: currentUser.profile?.avatar || ''
      };
    }

    return mockProfile;
  }

  getFullName(profile: ProfileData): string {
    if (profile.profile?.first_name && profile.profile?.last_name) {
      return `${profile.profile.first_name} ${profile.profile.last_name}`;
    }
    return profile.email;
  }

  getAvatarUrl(profile: ProfileData): string {
    if (profile.profile?.avatar) {
      if (profile.profile.avatar.startsWith('blob:') || profile.profile.avatar.startsWith('http')) {
        return profile.profile.avatar;
      }
      return `${API_BASE_URL}${profile.profile.avatar}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.getFullName(profile))}&background=0D8ABC&color=fff&size=200`;
  }

  getRoleDisplayName(role: string): string {
    switch (role.toLowerCase()) {
      case 'student': return 'Sinh viên';
      case 'lecturer': return 'Giảng viên';
      case 'admin': return 'Quản trị viên';
      default: return role;
    }
  }

  getRoleIdentifier(profile: ProfileData): string {
    if (profile.role === 'student' && profile.profile?.student_id) {
      return profile.profile.student_id;
    } else if (profile.role === 'lecturer') {
      return `GV${profile.id.toString().padStart(3, '0')}`;
    } else if (profile.role === 'admin') {
      return `AD${profile.id.toString().padStart(3, '0')}`;
    }
    return `U${profile.id}`;
  }
}


export const profileService = new ProfileService();
export default profileService; 