"use client";
import { Radar } from "react-chartjs-2";
import "chart.js/auto";

export default function RadarChart({ attrs }: { attrs: any }) {
    const data = {
        labels: ['Attack', 'Defense', 'Speed', 'Agility', 'Capacity'],
        datasets: [
            {
                label: 'Flying Machine',
                data: [
                    attrs.Attack,
                    attrs.Defense,
                    attrs.Speed,
                    attrs.Agility,
                    attrs.Capacity
                ],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    }

    return (
        <div className="w-full rounded-md border border-zinc-200 bg-zinc-50 p-4">
            <div className="mb-3 text-sm font-semibold">Stats</div>
            <div className="h-64 flex justify-center">

                <Radar
                    data={data} options={{ scales: { r: { suggestedMin: 0, suggestedMax: 5 } } }} />
            </div>
        </div>
    );
}