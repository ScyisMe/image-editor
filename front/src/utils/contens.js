export const API_BASE_URL = 'http://localhost:8000';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/api_v1/auth/login',
    LOGOUT: '/api/api_v1/auth/logout',
    REGISTER: '/api/api_v1/auth/register',
    FORGOT_PASSWORD: '/api/api_v1/auth/forgot-password',
    RESET_PASSWORD: '/api/api_v1/auth/reset-password',
    VERIFY: '/api/api_v1/auth/verify',
    REQUEST_VERIFY_TOKEN: '/api/api_v1/auth/request-verify-token',
  },
  USERS: {
    ME: '/api/api_v1/users/me',
    BY_ID: '/api/api_v1/users',
  },
  IMAGE: {
    UPLOAD: '/api/api_v1/image/',
    INFO: '/api/api_v1/image/info',
    CONVERT_TYPE: '/api/api_v1/image/convert/type',
    CONVERT_SIZE: '/api/api_v1/image/convert/size',
    CONVERT_DECREASE: '/api/api_v1/image/convert/decrease',
    CONVERT_CUT: '/api/api_v1/image/convert/cut',
    CONVERT_MERGE: '/api/api_v1/image/convert/merge',
    CONVERT_TRANSPOSE: '/api/api_v1/image/convert/transpose',
  }
};

export const IMAGE_FORMATS = ['JPEG', 'PNG', 'WEBP', 'BMP', 'TIFF'];

export const OPERATION_TYPES = [
  { value: 'info', label: 'Get Info' },
  { value: 'convert-type', label: 'Convert Type' },
  { value: 'convert-size', label: 'Resize' },
  { value: 'convert-decrease', label: 'Decrease Quality' },
  { value: 'convert-cut', label: 'Cut/Crop' },
  { value: 'convert-merge', label: 'Merge' },
  { value: 'convert-transpose', label: 'Transpose' }
];