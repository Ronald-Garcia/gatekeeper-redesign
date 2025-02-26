export type UserType = {
  name: string;
  email: string;
};

export type TaskType = {
  title: string;
  description: string;
  user_id: number;
};

export type SortType = "name_desc" | "name_asc" | "year_asc" | "year_desc" | "jhed_asc" | "jhed_dsc"