import dayjs from "dayjs";

import { TIME_FROMAT } from "@/config/constant";

export const getTimeByStamp = (stamp: number): string => {
  return dayjs(stamp).format(TIME_FROMAT);
};

export const getTimeByLocal = (local?: string): string => {
  return dayjs(local).format(TIME_FROMAT);
};
