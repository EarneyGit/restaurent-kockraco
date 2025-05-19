declare module 'axios' {
  export interface AxiosInstance {
    get: any;
    post: any;
    put: any;
    delete: any;
  }
  const axios: AxiosInstance;
  export default axios;
} 