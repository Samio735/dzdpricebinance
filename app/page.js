import { PriceChart } from "./components/PriceChart";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 text-white">
      <div className="flex items-center gap-3">
        <Image
          src="/Binance_Logo.svg"
          alt="Binance Logo"
          width={24}
          height={24}
        />
        <h1 className="text-2xl font-bold text-[#F0B90B]">
          DZD/USDT on Binance P2P
        </h1>
      </div>
      <div className="w-full max-w-4xl h-[60vh]">
        <PriceChart />
      </div>
    </div>
  );
}
