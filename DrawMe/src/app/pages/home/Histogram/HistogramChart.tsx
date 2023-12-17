import React, { useState, useEffect, useRef } from "react"

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
  ChartData,
  ChartTypeRegistry,
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
  // const chartRef = useRef<any>(null)
  const downsampleData = (pixels: number[], width: number) => {
    const length = data.length
    const ratio = Math.floor(length / width)
    const result = new Array(width)

    for (let i = 0; i < width; i++) {
      const index = Math.min(i * ratio, length - 1)
      result[i] = pixels[index]
    }

    return result
  }

  // useEffect(() => {
  //   if (chartRef.current && chartRef.current.chartInstance) {
  //     const canvas = chartRef.current.chartInstance.canvas
  //     const ctx = canvas.getContext("2d")

  //     const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
  //     gradient.addColorStop(0, "rgba(104,1,239,1)")
  //     gradient.addColorStop(1, "rgba(206,65,245,1)")

  //     ctx.fillStyle = gradient
  //     ctx.fillRect(0, 0, canvas.width, canvas.height)
  //   }
  // }, [])

  // console.log(data)
  // data[0] = 0
  // data[255] = 0

  return (
    <Line
      // ref={chartRef}
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
      width={300}
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
            padding: {
              top: 20,
              bottom: 20,
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
