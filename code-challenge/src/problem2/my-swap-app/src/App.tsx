import "./App.css";
import "./i18n";
import SwapCard from "./components/SwapCard";
import FallingText from "./components/FallingIcon";

function App() {
  return (
    <div className="flex items-center justify-center h-screen">
      <FallingText
        text={`Ethereum Ripple (XRP) Cardano BNB Dogecoin Bitcoin Avalanche Uniswap Aave Solana Synthetix Optimism Loopring Tether`}
        highlightWords={["Bitcoin", "Ethereum", "BNB", "Solana", "Tether"]}
        highlightClass="highlighted"
        trigger="hover"
        backgroundColor="transparent"
        wireframes={false}
        gravity={0.5}
        fontSize="1.5rem"
        mouseConstraintStiffness={0.9}
      >
        <SwapCard />
      </FallingText>
    </div>
  );
}

export default App;
