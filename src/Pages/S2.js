import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title, 
    Tooltip,
    Legend,
    PointElement,
    LineElement,
  } from 'chart.js';
  import { Line, Bar } from 'react-chartjs-2';

function S2() { 
    return (
      <div className="S2">
        <div className="title2">쇼핑몰1 관리페이지</div>
         
         <Link to="/S1" className="no-visited tab tab2 place1">
             <span className="text">고객 통계</span>
         </Link>
         <Link to="/S2" className="no-visited tab tab1 place2">
             <span className="text">이탈 관리</span>
         </Link> 
         <Link to="/S3" className="no-visited tab tab3 place3">
             <span className="text">맞춤 추천</span>
         </Link>
         <div className="main">
            <div className="main_2">
                <div className="box">
                    <span className="title_2">이탈 알고리즘 설정</span>

                    <p className="text2">마지막 접속날짜</p>
                    <p className="text2">마지막 구매날짜</p>
                    <p className="text2">지난달 환불비율</p>
                    <p className="text2">재발급 방지기간</p>
                </div>
                <div className="box">
                    <span className="title_2">이탈·충성고객 추이</span>
                    <Line className="graph" options={options} data={data1} />
                </div>
                </div>
                <div className="main_2">
                <div className="box">
                    <span className="title_2">충성 알고리즘 설정</span>
                    
                </div>
                <div className="box">
                    <span className="title_2">이탈 유형 통계</span>
                    <Bar className="graph" options={options} data={data2} />
                </div>
                </div>

        </div>
      </div>
    );
  }
  
  export default S2;

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  export const options = {
    layout: {
      padding: {
        top: 5,
        right: 10, 
        bottom: 5, 
        left: 10,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      datalabels: {
        display: false, // 데이터 레이블을 보이지 않게 설정
      },
    },
  };
  
  
  
  export const data1 = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
    datasets: [
      {
        label: '이탈고객 (명)',
        data: [1, 2, 2, 4, 5, 6],
        borderColor: 'rgba(255, 99, 132, 0.5)', 
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: '층성고객 (명)',
        data: [6, 4, 3, 1, 3, 4],
        borderColor: 'rgba(53, 162, 235, 0.5)', 
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

export const data2 = {
    labels : ['10대', '20대', '30대', '40대 이상'],
    datasets: [
      {
        label: '여성',
        data: [1, 2, 3, 4],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',

      },
      {
        label: '남성',
        data: [2, 3, 4, 5],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',

      },
    ],
  };