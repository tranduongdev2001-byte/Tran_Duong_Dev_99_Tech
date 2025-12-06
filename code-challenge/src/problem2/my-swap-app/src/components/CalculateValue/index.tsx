const CalculateValue = ({ currency, price }: { currency: string; price: number }) => {
  return (
    <div className="text-left text-xs text-gray-400 mt-1">
      1 {currency} ≈ ${price.toFixed(2) || 0}
    </div>
  );
};

export default CalculateValue;
