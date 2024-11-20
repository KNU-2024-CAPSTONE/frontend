import React, { useEffect, useState } from 'react';
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


function S1() {  

  const [memberlog, setMemberlog] = useState(null);
  const [purchaselog, setPurchaselog] = useState(null);

  useEffect(() => {
    fetch('http://3.34.133.252:8081/api/database/member-log')
    .then((response) => response.json())
    .then((data) => setMemberlog(data));
  }, []);
  useEffect(() => {
    fetch('http://3.34.133.252:8081/api/database/purchase-log')
    .then((response) => response.json())
    .then((data) => setPurchaselog(data));
  }, []);

    return (
      <div className="S1">
         <div className="title2">쇼핑몰1 관리페이지</div>
         
          <Link to="/S1" className="no-visited tab tab1 place1">
              <span className="text">고객 통계</span>
          </Link>
          <Link to="/S2" className="no-visited tab tab2 place2">
              <span className="text">이탈 관리</span>
          </Link>
          <Link to="/S3" className="no-visited tab tab3 place3">
              <span className="text">맞춤 추천</span>
          </Link>
          
          <div className="main">
  
              <div className="main_2">
              <div className="box">
                  <span className="title_2">전체 고객통계 (명) </span>
                  <Line className="graph" options={options2} data={data1} />
              </div>
              <div className="box">
                  <span className="title_2">고객 유형별 통계</span>
                  <Bar className="graph" options={options} data={data2} />
              </div>
              </div>
              <div className="main_2">
              <div className="box">
                  <span className="title_2">전체  매출통계 (원) </span>
                  <Line className="graph" options={options2} data={data3} />
              </div>
              <div className="box">
                  <span className="title_2">고객 유형별 매출통계</span>
                  <Bar className="graph" options={options} data={data4} />
              </div>
              </div>
          </div>
      </div>
    );
  }
  
  export default S1;


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

  export const options2 = {
    layout: {
      padding: {
        top: 20,
        right: 20, 
        bottom: 10, 
        left: 10,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: false,
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
        label: '총 고객 (명)',
        data: [1, 2, 2, 4, 5, 6],
        borderColor: 'rgb(179, 170, 255)', 
        backgroundColor: 'rgba(179, 170, 255, 0.5)',
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

  export const data3 = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
    datasets: [
      {
        label: '총 매출 (원)',
        data: [1, 2, 2, 4, 5, 6],
        borderColor: 'rgb(179, 170, 255)', 
        backgroundColor: 'rgba(179, 170, 255, 0.5)',
      },
    ],
  };

  export const data4 = {
    labels : ['10대', '20대', '30대', '40대 이상'],
    datasets: [
      {
        label: '여성',
        data: [1, 2, 3, 4],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: '남성',
        data: [4, 3, 5, 1],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

