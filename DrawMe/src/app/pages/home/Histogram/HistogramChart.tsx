import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"

interface HistogramProps {
  channelLabel: string
  data: number[]
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
)

export default function HistogramChart({ channelLabel, data }: HistogramProps) {
  return (
    <Line
      data={{
        labels: [...Array(256).keys()],
        datasets: [
          {
            label: channelLabel,
            data,
            tension: 0.75,
            fill: true,
            borderColor: ["rgba(104,1,239,1)", "rgba(206,65,245,1) 100%)"],
            backgroundColor: "rgba(206,65,245,1)",
          },
        ],
      }}
      width={250}
      height={200}
      options={{
        responsive: false,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              display: false,
            },
            grid: {
              display: false,
            },
          },
        },
        elements: {
          point: {
            radius: 0,
          },
        },
        plugins: {
          title: {
            display: true,
            text: channelLabel,
            color: "#100041",
            padding: {
              top: 20,
              bottom: 20,
            },
            font: {
              size: 14,
              family: "Inter",
              weight: "bold",
            },
          },
          legend: {
            display: false,
          },
        },
      }}
    />
  )
}
