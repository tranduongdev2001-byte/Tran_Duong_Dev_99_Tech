import { TokenIcon } from "@web3icons/react";
import { motion } from "framer-motion";

const icons = ["btc", "eth", "bnb", "lunc", "sei"];

const WaveIcons = () => {
  return (
    <div className="mt-3">
      <div className="flex space-x-3 items-center">
        {icons.map((symbol, index) => (
          <motion.div
            key={symbol}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2,
            }}
          >
            <TokenIcon
              symbol={symbol}
              variant="mono"
              size="34"
              color="#FFFFFF"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WaveIcons;
