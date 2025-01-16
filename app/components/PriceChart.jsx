"use client";
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function PriceChart() {
  const [activeChart, setActiveChart] = useState("buy"); // 'buy' or 'sell'
  const [priceData, setPriceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [countdown, setCountdown] = useState(30);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://thales.intentional-app.com/webhook/get-price"
      );
      const data = await response.json();
      setPriceData(data);
      setLastUpdate(new Date());
      setCountdown(30);
    } catch (error) {
      console.error("Error fetching price data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Fetch every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `USDT/DZD`,
        color: "#848E9C",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          title: function (context) {
            const timestamp = context[0].label;
            return new Date(Number(timestamp)).toLocaleString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
          },
          label: function (context) {
            return `${
              activeChart.charAt(0).toUpperCase() + activeChart.slice(1)
            } Price: ${context.raw} DZD`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "#282B31",
          display: false, // hide grid lines
        },
        ticks: {
          color: "#848E9C",
          maxTicksLimit: 6, // limit number of ticks
          callback: function (value, index, ticks) {
            const time = new Date(priceData[index].time);
            return time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          },
        },
      },
      y: {
        grid: {
          color: "#282B31",
        },
        ticks: {
          color: "#848E9C",
        },
        // Add padding to y-axis
        beginAtZero: false,
        suggestedMin:
          Math.min(...priceData.map((p) => p[`${activeChart}-price`])) * 0.999,
        suggestedMax:
          Math.max(...priceData.map((p) => p[`${activeChart}-price`])) * 1.001,
      },
    },
  };

  const data = {
    labels: priceData.map((p) => new Date(p.time).getTime()), // use timestamps as labels
    datasets: [
      {
        label: activeChart === "buy" ? "Buy Price" : "Sell Price",
        data: priceData.map((p) => p[`${activeChart}-price`]),
        borderColor: "#F0B90B",
        backgroundColor: "rgba(240, 185, 11, 0.1)",
        tension: 0.1,
        fill: true,
      },
    ],
  };

  return (
    <div className="w-full  p-6 rounded-lg">
      <div className="flex flex-col items-center gap-4 mb-4">
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setActiveChart("buy")}
            className={`px-4 py-2 rounded ${
              activeChart === "buy"
                ? "bg-[#F0B90B] text-[#1E2026]"
                : "bg-[#2B2F36] text-[#848E9C] hover:bg-[#2B2F36]/80"
            }`}
          >
            Buy Price
          </button>
          <button
            onClick={() => setActiveChart("sell")}
            className={`px-4 py-2 rounded ${
              activeChart === "sell"
                ? "bg-[#F0B90B] text-[#1E2026]"
                : "bg-[#2B2F36] text-[#848E9C] hover:bg-[#2B2F36]/80"
            }`}
          >
            Sell Price
          </button>
        </div>
        <div className="flex items-center justify-end w-full gap-2 text-sm text-[#848E9C]">
          <span> {countdown}</span>
          <button
            onClick={fetchData}
            className="px-2 py-1 rounded bg-[#2B2F36] hover:bg-[#2B2F36]/80 text-[#F0B90B]"
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        </div>
      </div>
      <Line options={options} data={data} />
    </div>
  );
}
