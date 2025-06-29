// Quick fix for courses not loading
console.log('=== COURSES LOADING FIX ===');

// 1. Clear expired tokens
if (localStorage.getItem('token')) {
  try {
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp < currentTime) {
      console.log('🔥 Token expired, clearing localStorage...');
      localStorage.clear();
      alert('Token đã hết hạn, vui lòng đăng nhập lại');
      window.location.href = '/login';
    } else {
      console.log('✅ Token still valid');
    }
  } catch (error) {
    console.log('❌ Invalid token, clearing...');
    localStorage.clear();
    window.location.href = '/login';
  }
}

// 2. Add this to browser console to test API
const testCoursesAPI = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('❌ No token found');
    return;
  }
  
  try {
    const response = await fetch('http://localhost:5000/api/courses', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    console.log('🔍 API Response:', result);
    
    if (result.status === 'success' && result.data && result.data.courses) {
      console.log('✅ Found courses:', result.data.courses.length);
      result.data.courses.forEach(course => {
        console.log('📚', course.subject_name, '|', course.subject_code);
      });
    }
  } catch (error) {
    console.error('❌ API Error:', error);
  }
};

// Run test
testCoursesAPI(); 