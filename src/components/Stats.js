import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { upperFirst } from 'lodash';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function Stats(props){

    const MAXSTAT = 250;
    const options = {
        indexAxis: 'x',
        barPercentage:1,
        categoryPercentage:.9,
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#212121',
                    font: {
                        size:12,
                    },
                    autoSkip: false,
                    maxRotation: 0,
                    minRotation: 0,
                },
                stacked:true,
            },
            y: {  
                display: false,
                beginAtZero: true,
                max: MAXSTAT,    
                grid: {
                    display: false
                },
                stacked:true,
            }
        },
        elements: {
            bar: {
            borderWidth: 0,
            },
        },
        responsive: true,
        events: [],
        plugins: {
            legend: {
                display: false,
                position: 'bottom',
            },
            title: {
                display: false,
                text: 'Chart.js Horizontal Bar Chart',
            },
            tooltip: {
                enabled: false,
            }
        },
    };
      
    const labels = props.pokemonStats.map(thisStat => {
        let name = thisStat.stat.name;
        if (name == 'special-attack'){name = 'Sp. Atk.'}
        if (name == 'special-defense'){name = 'Sp. Def.'}
        return upperFirst(name.replace('-',' '));
    });
      
    const data = {
        labels,
        datasets: [
            {
                label: 'Pokemon Stats',
                data: props.pokemonStats.map((thisStat) => thisStat.base_stat),
                borderColor: 'rgb(48, 167, 215)',
                backgroundColor: 'rgba(48, 167, 215, 1)',
            },
            {
                
                label: 'Remaining To Max',
                data: props.pokemonStats.map((thisStat) => MAXSTAT - thisStat.base_stat),
                borderColor: 'rgb(255,255,255,1)',
                backgroundColor: 'rgb(255,255,255,1)'
            }
        ],
    };

    return (
        <div className="stats">
            <span className="label">Stats</span>
            <Bar options={options} data={data} />
        </div>
    )
}

export default Stats;



