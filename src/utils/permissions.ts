import { authService } from '../services/auth.service';

export class PermissionUtils {
  
  static canAccessQuiz(quiz: any): { canAccess: boolean; reason?: string } {
    const currentUser = authService.getCurrentUser();
    
    
    if (!currentUser) {
      return { canAccess: false, reason: 'Không tìm thấy thông tin người dùng' };
    }

    if (currentUser.role === 'admin') {
      return { canAccess: true };
    }

    if (currentUser.role !== 'lecturer') {
      return { canAccess: false, reason: 'Chỉ giảng viên mới có quyền truy cập bài kiểm tra' };
    }

    if (!quiz) {
      return { canAccess: false, reason: 'Không tìm thấy thông tin bài kiểm tra' };
    }

    return { canAccess: true };
  }

  static canEditQuiz(quiz: any): { canEdit: boolean; reason?: string } {
    const accessCheck = this.canAccessQuiz(quiz);
    if (!accessCheck.canAccess) {
      return { canEdit: false, reason: accessCheck.reason };
    }

    if (quiz.status === 'closed') {
      return { canEdit: false, reason: 'Không thể chỉnh sửa bài kiểm tra đã đóng' };
    }

    return { canEdit: true };
  }

  static canDeleteQuiz(quiz: any): { canDelete: boolean; reason?: string } {
    const accessCheck = this.canAccessQuiz(quiz);
    if (!accessCheck.canAccess) {
      return { canDelete: false, reason: accessCheck.reason };
    }

    if (quiz.status === 'published') {
      return { canDelete: false, reason: 'Không thể xóa bài kiểm tra đã xuất bản' };
    }

    return { canDelete: true };
  }

  static canManageQuestions(quiz: any): { canManage: boolean; reason?: string } {
    const accessCheck = this.canAccessQuiz(quiz);
    if (!accessCheck.canAccess) {
      return { canManage: false, reason: accessCheck.reason };
    }

    if (quiz.status === 'closed') {
      return { canManage: false, reason: 'Không thể chỉnh sửa câu hỏi của bài kiểm tra đã đóng' };
    }

    return { canManage: true };
  }

  static getCurrentLecturerId(): number | null {
    const currentUser = authService.getCurrentUser();
    return currentUser?.lecturer_id || currentUser?.id || null;
  }

  static isCurrentUserLecturer(): boolean {
    const currentUser = authService.getCurrentUser();
    return currentUser?.role === 'lecturer' || currentUser?.role === 'admin';
  }

  static formatPermissionError(reason: string): string {
    return `🚫 ${reason}`;
  }

  static showPermissionError(reason: string): void {
    alert(this.formatPermissionError(reason));
  }

  static redirectIfNoPermission(canAccess: boolean, reason?: string, redirectPath: string = '/teacher/quiz'): boolean {
    if (!canAccess) {
      if (reason) {
        this.showPermissionError(reason);
      }
      
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 1000);
      
      return true; 
    }
    
    return false; 
  }
}

export default PermissionUtils; 