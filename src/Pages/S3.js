import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title, 
    Tooltip,
    Legend,
    PointElement,
  } from 'chart.js';
  import { Bar, Pie } from 'react-chartjs-2';
  import ChartDataLabels from 'chartjs-plugin-datalabels';

function S3() { 
    return ( 
      <div className="S3">
        <div className="title2">쇼핑몰1 관리페이지</div>
         
         <Link to="/S1" className="no-visited tab tab2 place1">
             <span className="text">고객 통계</span>
         </Link>
         <Link to="/S2" className="no-visited tab tab3 place2">
             <span className="text">이탈 관리</span>
         </Link>
         <Link to="/S3" className="no-visited tab tab1 place3">
             <span className="text">맞춤 추천</span>
         </Link>

         <div className="main">

            <div className="main_2">
                <div className="box2" >
                    <span className="title_2">유형별 인기 키워드</span>
                    <Pie className="graph" options={options1} data={data1} />
                </div>
                <div className="box3">

                </div>
            </div>

            <div className="main_2">
                <div className="box">
                    <span className="title_2">구매전환 비율 (%)</span>
                    <Bar className="graph" options={options2} data={data2} />
                </div>
                <div className="box">
                    <span className="title_2">추천 알고리즘 설정</span>
                </div>
            </div>

        </div>
      </div>
    );
  }

  export default S3;

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
  );

  export const options1 = {
    layout: {
      padding: {
        top: 25,
        right: 35, 
        bottom: 20, 
        left: 10,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'left',
      },
      datalabels: {
        color: 'black',
        clamp: true,
        align: 'end',
        anchor: 'end',
        font: {
          size: 10,
        },
        formatter: (value) => {
          return value + '%';
        },
      },
    },
  };

  export const options2 = {
    layout: {
      padding: {
        top: 10,
        right: 35, 
        bottom: 10, 
        left: 10,
      },
    },
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: false,
      },
      datalabels: {
        color: 'black',
        clamp: true,
        align: 'end',
        anchor: 'end',
        font: {
          size: 10,
        },
        formatter: (value) => {
          return value + '%';
        },
      },
    },
  };
  
  export const data1 = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 6],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(179, 170, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(179, 170, 255, 1)',
        ],
      },
    ],
  };
  
  export const data2 = {
    labels : ['장바구니', '구매'],
    datasets: [
      {
        label: '비율 (%)',
        data: [7, 5],
        backgroundColor: 'rgba(179, 170, 255, 0.5)',
        maxBarThickness: 40,
      },
    ],
  };