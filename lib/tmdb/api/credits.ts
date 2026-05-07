/* eslint-disable prettier/prettier */
import { axiosClient } from '..';
import { Credits, Language } from '../models';

export const credits = async (variant: 'movie' | 'tv', id: number, language: Language) => {
  const { data } = await axiosClient.get<Credits>(`/${variant}/${id}/credits`, {
    params: {
      language,
    },
  });

  return data;
};
