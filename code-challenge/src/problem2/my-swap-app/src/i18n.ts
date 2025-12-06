import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      swap: "Swap",
      amountToSend: "Amount to send",
      amountToReceive: "Amount to receive",
      bestPrice: "Best Price",
      minimumReceived: "Minimum Received",
      totalReceived: "Total Received (USD)",
    },
  },
  zh: {
    translation: {
      swap: "兑换",
      amountToSend: "发送金额",
      amountToReceive: "接收金额",
      bestPrice: "最佳价格",
      minimumReceived: "最低接收量",
      totalReceived: "总接收（美元）",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
