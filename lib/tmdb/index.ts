/* eslint-disable prettier/prettier */
import axios, { AxiosError } from 'axios';
import {
  collections, credits, genres, images, keywords, languages,
  movies, search, season, tv, videos, watchProviders, person,
} from '@/lib/tmdb/api';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

const handleAxiosError = (error: AxiosError) => {
  if (error.response) {
    const { status } = error.response;
    console.error(`TMDB API error ${status}`);
  } else {
    console.error('TMDB network error:', error.code || error.message);
  }
};

export const axiosClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: { api_key: TMDB_API_KEY },
  timeout: 10000,
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as any;
    // Retry once on ECONNRESET / network errors
    if (!config._retry && (!error.response || error.code === 'ECONNRESET')) {
      config._retry = true;
      await new Promise(r => setTimeout(r, 500));
      return axiosClient(config);
    }
    handleAxiosError(error);
    return Promise.reject(error);
  },
);

export const tmdb = {
  collections, credits, genres, images, keywords, languages,
  movies, search, season, tv, videos, watchProviders, person,
};

export * from './models';
