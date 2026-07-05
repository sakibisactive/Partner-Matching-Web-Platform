/// <reference types="vite/client" />
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const getBaseUrl = () => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl) {
    const raw = envUrl.replace(/\/$/, '');
    return raw.endsWith('/api') ? raw : `${raw}/api`;
  }
  return '/api';
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('soul_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Profile', 'Match', 'Like', 'Chat', 'Message', 'Report', 'Interest'],
  endpoints: () => ({}),
});
