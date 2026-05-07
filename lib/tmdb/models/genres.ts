/* eslint-disable prettier/prettier */
type Genre = {
  id: number;
  name: string;
};

export type GetGenresResponse = {
  genres: Genre[];
};
