import React, { useState, useEffect } from 'react';
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
  import { useSearchParams } from "react-router-dom";

function S3() { 

  const baseURL = 'http://3.34.133.252:8080'
  const [searchParams] = useSearchParams();
  const shopid = searchParams.get("shopid");

  const [recommend, setRecommend] = useState(null);
  const [purchaselog, setPurchaselog] = useState(null);
  const button_categories = ["10대", "20대", "30대", "40대+", "남성", "여성"];
  const [selected, setSelected] = useState([]); 
  
  useEffect(() => {
    fetch(`${baseURL}/api/customer/sale/recommend/${shopid}`)
    .then((response) => response.json())
    .then((data) => setRecommend(data));
  }, []);

  useEffect(() => {
    fetch(`${baseURL}/api/customer/sale/product/${shopid}`)
    .then((response) => response.json())
    .then((data) => setPurchaselog(data));
  }, []);
  console.log(recommend);
  const Frequency = (purchaselog) => {
    const keywordCount = {};

    if (!purchaselog) return [];

    purchaselog.forEach((item) => {
      if (item.product) {
      const keyword = item.product.name;

        if (keywordCount[keyword]) {
          keywordCount[keyword]=keywordCount[keyword]+item.quantity;
        } else {
          keywordCount[keyword] = item.quantity;
        }
      ;
    }
    });

    const sortedKeywords = Object.entries(keywordCount)
      .sort((a, b) => b[1] - a[1])  
      .map(([keyword, count]) => ({ keyword, count }));
    
    return sortedKeywords.slice(0, 3);  
  };

  const sortedKeywords = Frequency(purchaselog);

    
  const data1 = {
    labels: [sortedKeywords[0]?.keyword || '없음', sortedKeywords[1]?.keyword || '없음', sortedKeywords[2]?.keyword || '없음'],
    datasets: [
      {
        label: '# of Votes',
        data: [sortedKeywords[0]?.count || 0, sortedKeywords[1]?.count || 0, sortedKeywords[2]?.count || 0],
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

  const data2 = recommend ?{
    labels : ['장바구니', '구매'],
    datasets: [
      {
        label: '비율 (%)',
        data: [recommend.cartPercent, recommend.purchasePercent],
        backgroundColor: 'rgba(179, 170, 255, 0.5)',
        maxBarThickness: 40,
      },
    ],
  }:{};

  const toggleSelection = (index) => {
    setSelected((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index) // 이미 선택된 경우 제거
        : [...prevSelected, index] // 선택되지 않은 경우 추가
    );
  };

    return ( 
      <div className="S3">
        <div className="title2">쇼핑몰1 관리페이지</div>
         
         <Link to={`/S1?shopid=1`} className="no-visited tab tab2 place1">
             <span className="text">고객 통계</span>
         </Link>
         <Link to={`/S2?shopid=1`} className="no-visited tab tab3 place2">
             <span className="text">이탈 관리</span>
         </Link>
         <Link to={`/S3?shopid=1`} className="no-visited tab tab1 place3">
             <span className="text">맞춤 추천</span>
         </Link>

         <div className="main">
         <div className='bar2' style={{gap:'10px', marginLeft:'60px'}}>
              <span className="title_2" style={{left:'120px'}}>유형별 인기상품</span>
              <div>
                {button_categories.map((category, index) => (
                 <button key={index} className="button1"
                 style={{backgroundColor: selected.includes(index) ? "white" : "rgba(228,228,228,1)",}}
                 onClick={() => toggleSelection(index)}
                 >{category}</button>
                 ))}
              </div>
            </div>
            <div className="main_3">
                <div className="box" style={{width: "500px", marginTop: "0px"}} >
                    <Pie className="graph" options={options1} data={data1} />
                </div>
                <div className="box" style={{width: "800px", marginTop: "0px"}}>
                <div className="result">
                  <p className='text3'>1위 : {sortedKeywords[0]?.keyword || '없음'}</p>
                  <p className='text3'>2위 : {sortedKeywords[1]?.keyword || '없음'}</p>
                  <p className='text3'>3위 : {sortedKeywords[2]?.keyword || '없음'}</p>
                </div>
                </div>
            </div>

            <div className="main_2">
                <div className="box" style={{width: "500px"}}>
                    <span className="title_2">구매전환 비율 (%)</span>
                    {recommend ? (
                     <Bar className="graph" options={options2} data={data2} />
                    ) : (
                     <p>Loading...</p>
                     )}
                </div>
                <div className="box" style={{width: "800px"}}>
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
          return value + '회';
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
  
  
  
  