/* eslint-disable prettier/prettier */
import { axiosClient } from '..';
import { GetLanguagesResponse } from '../models';

export const languages = async () => {
  const { data } = await axiosClient.get<GetLanguagesResponse>('/configuration/languages');

  return data;
};
