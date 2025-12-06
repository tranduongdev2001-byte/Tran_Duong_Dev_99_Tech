import {
  Select,
  Input,
  message,
  Menu,
  Dropdown,
  Spin,
  Tooltip,
  Modal,
  notification,
} from "antd";
import { FiRefreshCcw } from "react-icons/fi";
import { useCallback, useEffect, useRef, useState } from "react";
import { SettingOutlined, DownOutlined } from "@ant-design/icons";
import type { CoinType, Currency } from "../types/coin";
import { getListCoin } from "../hooks/getListCoin";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import WaveIcons from "./WaveIcon";
import GlitchText from "./GlitchText";
import CalculateValue from "./CalculateValue";
import { currencyIconMap } from "../types/icon";
import swapSound from "../assets/sounds/swapCoin.wav";
import transferSound from "../assets/sounds/transferCoin.wav";
import errorSound from "../assets/sounds/error.wav";

const { Option } = Select;

const TokenOption = ({ label }: { label: string }) => (
  <div className="flex items-center space-x-2">
    <Tooltip title={label}>
      {currencyIconMap[label] && (
        <img
          src={currencyIconMap[label]}
          alt={label}
          className="w-5 h-5 rounded-full object-contain ml-3"
        />
      )}
    </Tooltip>
    <span className="ml-2">{label}</span>
  </div>
);

const SwapCard = () => {
  const { t, i18n } = useTranslation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioTranserRef = useRef<HTMLAudioElement | null>(null);
  const errorTranserRef = useRef<HTMLAudioElement | null>(null);
  const languageMenu = (
    <Menu
      items={[
        { key: "en", label: "English" },
        { key: "zh", label: "中文 (Chinese)" },
      ]}
      onClick={({ key }) => {
        i18n.changeLanguage(key);
      }}
    />
  );
  const [sellingCoin, setSellingCoin] = useState<CoinType>({
    name: "",
    currency: "",
    price: 0,
    toDollar: 0,
    amount: 0,
  });

  const [buyingCoin, setBuyingCoin] = useState<CoinType>({
    name: "",
    currency: "",
    price: 0,
    toDollar: 0,
    amount: 0,
  });

  const [listCoin, setListCoin] = useState<Currency[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [hasInputError, setHasInputError] = useState(false);

  const handleTransfer = () => {
    if (sellingCoin.amount <= 0) {
      setHasInputError(true);
      errorTranserRef.current?.play();
      notification.error({
        message: (
          <span style={{ fontWeight: 600, fontSize: 16 }}>
            <span style={{ color: "#FF6B6B" }}>Invalid Amount</span>
          </span>
        ),
        description: (
          <div style={{ fontSize: 13, marginTop: 4 }}>
            Please enter a valid amount greater than <strong>0</strong>.
          </div>
        ),
        placement: "topRight",
        style: {
          background:
            "radial-gradient(circle at top left, rgba(34,197,94,0.25), rgba(59,130,246,0.25))",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)", // Safari support
          color: "#FFFFFF",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.4)",
          borderRadius: "16px",
          padding: "16px 24px",
          fontFamily: "'Inter', sans-serif",
        },
        duration: 3.5,
      });
      return;
    }
    audioTranserRef.current?.play();
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    fetchListCoin();
    setIsModalVisible(false);
  };

  const renderOptionsCoin = (key: boolean) =>
    listCoin
      .filter(
        (coin) =>
          coin.currency !== (key ? sellingCoin.currency : buyingCoin.currency)
      )
      .map((coin) => (
        <Option clas key={coin.currency} value={coin.currency}>
          <TokenOption label={coin.currency} />
        </Option>
      ));

  const fetchListCoin = async () => {
    try {
      setIsLoading(true);
      const response = await getListCoin();
      if (response) {
        setListCoin(response);
        const valueUsd = response.find(
          (item) => item.currency === "USD" || item.currency === "USDC"
        );
        const valueEth = response.find((item) => item.currency === "ETH");

        if (valueEth) {
          setSellingCoin({
            name: valueEth.name,
            currency: valueEth.currency,
            price: valueEth.price,
            toDollar: 0,
            amount: 0,
          });
        }

        if (valueUsd) {
          setBuyingCoin({
            name: valueUsd.name,
            currency: valueUsd.currency,
            price: valueUsd.price,
            toDollar: 0,
            amount: 0,
          });
        }
      }
    } catch {
      message.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListCoin();
    audioRef.current = new Audio(swapSound);
    audioTranserRef.current = new Audio(transferSound);
    errorTranserRef.current = new Audio(errorSound);
  }, []);

  useEffect(() => {
    if (sellingCoin.price && buyingCoin.price) {
      const toDollar = sellingCoin.amount * sellingCoin.price;
      const amount = toDollar / buyingCoin.price;
      setBuyingCoin((prev) => ({
        ...prev,
        amount: parseFloat(amount.toFixed(6)),
        toDollar: parseFloat(toDollar.toFixed(6)),
      }));
    }
  }, [sellingCoin.amount, sellingCoin.price, buyingCoin.price]);

  const handleSwapCoin = useCallback(() => {
    if (!sellingCoin.currency || !buyingCoin.currency) return;
    audioRef.current?.play();
    setSellingCoin(buyingCoin);
    setBuyingCoin(sellingCoin);
  }, [sellingCoin, buyingCoin]);

  return (
    <Spin spinning={isLoading} tip="Loading..." size="large">
      <div className="w-full max-w-md mx-auto bg-white/5 text-white rounded-2xl p-6 shadow-2xl backdrop-blur-md border border-white/10 font-sans">
        <div className="flex justify-between items-center mb-4">
          <div className="font-semibold mb-6">
            <GlitchText
              speed={1}
              enableShadows={true}
              enableOnHover={false}
              className="custom-class"
            >
              {t("swap")}{" "}
            </GlitchText>
            <WaveIcons />
          </div>
          <Dropdown overlay={languageMenu} placement="bottomRight">
            <div className="text-xl font-semibold mb-6 cursor-pointer">
              <SettingOutlined />
            </div>
          </Dropdown>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className={`bg-white/10 p-4 rounded-xl mb-4 ${
              hasInputError ? "border-red-500 border-2 rounded-md" : ""
            }`}
          >
            <div className="flex justify-between text-sm mb-1">
              <span className="font-bold">{t("amountToSend")}</span>
            </div>
            <div className="flex justify-between items-center space-x-2">
              <Input
                value={sellingCoin.amount}
                type="number"
                min={0}
                onChange={(e) => {
                  setSellingCoin((prev) => ({
                    ...prev,
                    amount: parseFloat(e.target.value || "0"),
                  }));
                  if (parseFloat(e.target.value) > 0) {
                    setHasInputError(false);
                  }
                }}
                className="bg-transparent text-white text-2xl font-bold w-full p-2"
                style={{
                  backgroundColor: "transparent",
                  color: "white",
                  border: "none",
                  boxShadow: "none",
                }}
              />
              <Select
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  String(option?.value)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                value={sellingCoin.currency}
                className="w-64 rounded-lg"
                dropdownStyle={{ background: "white", color: "white" }}
                suffixIcon={
                  <DownOutlined style={{ color: "#fff", fontSize: 12 }} />
                }
                onChange={(value) => {
                  const selectedCoin = listCoin.find(
                    (coin) => coin.currency === value
                  );
                  if (selectedCoin) {
                    setSellingCoin((prev) => ({
                      ...prev,
                      currency: selectedCoin.currency,
                      name: selectedCoin.name,
                      price: selectedCoin.price,
                    }));
                  }
                }}
              >
                {renderOptionsCoin(false)}
              </Select>
            </div>
            <CalculateValue
              currency={sellingCoin.currency}
              price={sellingCoin.price}
            />
          </div>
        </motion.div>

        <div className="flex justify-center mb-4">
          <div
            onClick={handleSwapCoin}
            className="bg-blue-600 rounded-full p-2 text-white shadow-md cursor-pointer"
          >
            <motion.div
              whileTap={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              onClick={handleSwapCoin}
              className="text-white shadow-md cursor-pointer"
            >
              <FiRefreshCcw />
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/10 p-4 rounded-xl mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-bold">{t("amountToReceive")}</span>
            </div>
            <div className="flex justify-between items-center space-x-2">
              <Input
                type="number"
                value={buyingCoin.amount}
                disabled
                className="bg-transparent text-white text-2xl font-bold w-full p-2"
                style={{
                  backgroundColor: "transparent",
                  color: "white",
                  border: "none",
                  boxShadow: "none",
                }}
              />
              <Select
                filterOption={(input, option) =>
                  String(option?.value)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                showSearch
                value={buyingCoin.currency}
                className="w-64 rounded-lg"
                dropdownStyle={{ background: "white", color: "white" }}
                suffixIcon={
                  <DownOutlined style={{ color: "#fff", fontSize: 12 }} />
                }
                onChange={(value) => {
                  const selectedCoin = listCoin.find(
                    (coin) => coin.currency === value
                  );
                  if (selectedCoin) {
                    setBuyingCoin((prev) => ({
                      ...prev,
                      currency: selectedCoin.currency,
                      name: selectedCoin.name,
                      price: selectedCoin.price,
                    }));
                  }
                }}
              >
                {renderOptionsCoin(true)}
              </Select>
            </div>
            <CalculateValue
              currency={buyingCoin.currency}
              price={buyingCoin.price}
            />
          </div>
        </motion.div>

        <div className="text-sm text-gray-300 space-y-1 mb-6">
          <div className="flex justify-between">
            <span>{t("bestPrice")}</span>
            <span>
              1 {buyingCoin.currency} ={" "}
              {(buyingCoin.price / sellingCoin.price).toFixed(10)}{" "}
              {sellingCoin.currency}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t("minimumReceived")}</span>
            <span>
              {buyingCoin.amount.toFixed(6)} {buyingCoin.currency}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t("totalReceived")}</span>
            <span>${(buyingCoin.amount * buyingCoin.price).toFixed(2)}</span>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300"
          onClick={handleTransfer}
        >
          🚀 Transfer
        </motion.button>

        <AnimatePresence>
          {isModalVisible && (
            <Modal
              open={isModalVisible}
              footer={null}
              onCancel={handleCloseModal}
              closable={false}
              centered
              maskStyle={{
                backdropFilter: "blur(6px)",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
              }}
            >
              <div className="rounded-2xl bg-gradient-to-br from-[#1e1e2f] to-[#2a2a3d] p-6 text-white text-center shadow-2xl border border-white/10">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-500/20 p-3 rounded-full">
                    <svg
                      className="w-8 h-8 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Transfer Successful
                </h2>
                <p className="text-sm text-gray-300 mb-4">
                  Your token transfer has been confirmed on the blockchain.
                </p>
                <button
                  onClick={handleCloseModal}
                  className="bg-gradient-to-r from-green-500 to-indigo-500 hover:from-green-600 hover:to-indigo-600 text-white px-4 py-2 rounded-md transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </Spin>
  );
};

export default SwapCard;
