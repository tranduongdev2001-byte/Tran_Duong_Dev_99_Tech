import { message } from "antd";
import axios from "axios";
import type { Currency } from "../types/coin";

export const getListCoin = async (): Promise<Currency[]> => {
    try {
      const { data } = await axios.get<Currency[]>(
        "https://interview.switcheo.com/prices.json"
      );

      const uniqueList = data.filter(
        (item, index, arr) =>
          arr.findIndex((x) => x.currency === item.currency) === index
      );
      return uniqueList;
    } catch (error) {
      console.error(error);
      message.error("Something went wrong!");
      return [];
    }
  };
