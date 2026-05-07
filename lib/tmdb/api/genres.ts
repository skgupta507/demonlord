/* eslint-disable prettier/prettier */
import { axiosClient } from '..';
import { GetGenresResponse, Language } from '../models';

export const genres = async (type: 'movie' | 'tv', language: Language) => {
  const { data } = await axiosClient.get<GetGenresResponse>(`/genre/${type}/list`, {
    params: {
      language,
    },
  });

  return data;
};
