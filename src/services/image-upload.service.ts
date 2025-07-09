import { API_BASE_URL } from './api';
import { authService } from './auth.service';

export async function uploadImage(
  file: File,
  subjectId: number,
  chapterId?: number
): Promise<string> {
  const form = new FormData();
  form.append('material', file);
  form.append('subject_id', subjectId.toString());
  if (chapterId) form.append('chapter_id', chapterId.toString());

  const token = await authService.getValidToken();

  const res = await fetch(`${API_BASE_URL}/materials/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: form
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Upload image failed');
  }
  if (typeof json.data === 'string') return json.data;
  if (json.data.url) return json.data.url;
  if (json.data.file_path) {
    const base = API_BASE_URL.replace(/\/api$/, '');
    return `${base}/uploads/${json.data.file_path}`;
  }
  throw new Error('Invalid upload response');
} 