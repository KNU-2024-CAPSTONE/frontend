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
  import { useSearchParams } from "react-router-dom";

  const useDataFetch = (endpoint) => {
    const [data, setData] = useState([]);
  
    useEffect(() => {
      fetch(endpoint)
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => console.error("Fetch error:", error));
    }, [endpoint]);
  
    return data;
  };

function S1() {  

  const baseURL = 'http://3.34.133.252:8080'
  const [searchParams] = useSearchParams();
  const shopid = searchParams.get("shopid");

  /*useEffect(() => {
    fetch(`${baseURL}/api/customer/sale/${shopid}`)
    .then((response) => response.json())
    .then((data) => console.log(data));
  }, []);*/

  const [selected, setSelected] = useState("월간");
  const handleClick = (button) => {
    setSelected(button); 
  };

  const shoplog = useDataFetch(`${baseURL}/api/shop`);
  const memberlog = useDataFetch(`${baseURL}/api/customer/influx/${shopid}`);
  const purchaselog = useDataFetch(`${baseURL}/api/customer/sale/${shopid}`);

  const ChartOfDate = (data0, datafield) => {
    const groupedData = {};
    const currentDate = new Date('2024-10-15');

    const sixMonthsAgo = new Date(currentDate);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const [month1, year1] = [sixMonthsAgo.getMonth() + 1, sixMonthsAgo.getFullYear()];

    const sixDaysAgo = new Date(currentDate);
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
    data0.forEach((entry) => {
      const date = new Date(entry[datafield]);
      let key;
      
      if (selected === "월간") {
        key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      } else if (selected === "일간") {
        key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      }

      if (!groupedData[key]) {
        groupedData[key] = 1;
      }
      if (datafield==="purchaseTime") {
        groupedData[key] += entry.totalPrice/10000; 
      }
      else {
        groupedData[key] += 1; 
      }
      
    });

  const labels = [];
  const data = [];

  if (selected === "월간") {
    const startMonth = month1;
    const startYear = year1;

    for (let i = 0; i < 6; i++) {
      const targetMonth = startMonth + i;
      const targetYear = startYear + Math.floor(targetMonth / 12);
      const monthInYear = targetMonth % 12;

      const targetKey = `${targetYear}-${monthInYear + 1}`;
      labels.push(`${monthInYear+1}월`);
      data.push(groupedData[targetKey] || 0);
    }
  } else if (selected === "일간") {
    const startDate = sixDaysAgo;
    const endDate = currentDate;

    for (let d = startDate; d < endDate; d.setDate(d.getDate() + 1)) {
      const targetKey = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
      data.push(groupedData[targetKey] || 0); 
    }
  }

    return {
      labels,
      datasets: [
        {
          label: "-",
          data,
          borderColor: "rgb(179, 170, 255)",
          backgroundColor: "rgba(179, 170, 255, 0.5)",
        },
      ],
    };
  };

  const ChartOfGender = (data0, datafield) => {
    const woman = [0, 0, 0, 0];
    const man = [0, 0, 0, 0];  
    
    const currentDate = new Date('2024-10-15');
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    data0.forEach((entry) => {
      const date = new Date(entry[datafield]);
      const age = entry.age;
      let isValid = false;
      if (selected === "월간" && date.getMonth() === currentMonth) {
        isValid = true;}
      else if (selected === "일간" && date.getDate() === currentDay) {
        isValid = true;
      }

      if (isValid==true) {
        let ageIndex = 3; 
        if (age >= 10 && age <= 19) ageIndex = 0; 
        if (age >= 20 && age <= 29) ageIndex = 1;
        if (age >= 30 && age <= 39) ageIndex = 2;
        
        if (entry.gender === 'female') {
          if (datafield==='purchaseTime') {woman[ageIndex] += entry.totalPrice/10000;}
          else {woman[ageIndex] += 1;}
        } else if (entry.gender === 'male') {
          if (datafield==='purchaseTime') {man[ageIndex] += entry.totalPrice/10000;}
          else {man[ageIndex] += 1;}
        }
    }})

    return {
      labels : ['10대', '20대', '30대', '40대 이상'],
    datasets: [
      {
        label: '여성',
        data: woman,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: '남성',
        data: man,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
    };
  };

  const data1 = ChartOfDate(memberlog, 'registerDate');
  const data2 = ChartOfGender(memberlog, 'registerDate');
  const data3 = ChartOfDate(purchaselog, 'purchaseTime');
  const data4 = ChartOfGender(purchaselog, 'purchaseTime');

    return (
      <div className="S1">
         <div className="title2">{shoplog?.[shopid-1]?.name || " "} 관리페이지</div>
         
          <Link to={`/S1?shopid=1`} className="no-visited tab tab1 place1">
              <span className="text">고객 통계</span>
          </Link>
          <Link to={`/S2?shopid=1`}  className="no-visited tab tab2 place2">
              <span className="text">이탈 관리</span>
          </Link>
          <Link to={`/S3?shopid=1`} className="no-visited tab tab3 place3">
              <span className="text">맞춤 추천</span>
          </Link>
          
          <div className="main">
  
              <div className="main_2">
              <div className="box">
                  <span className="title_2">가입 고객 추이 (단위 : 명) </span>
                  <Line className="graph" options={options2} data={data1} />
              </div>
              <div className="box">
                  <span className="title_2">고객 유형별 통계</span>
                  <Bar className="graph" options={options} data={data2} />
              </div>
              <span className="button2" style={{backgroundColor: selected === "월간" ? "rgba(164,164,164,1)" : "white",}} onClick={() => handleClick("월간")}>월간</span>
              <span className="button2" style={{backgroundColor: selected === "일간" ? "rgba(164,164,164,1)" : "white",}} onClick={() => handleClick("일간")}>일간</span>
              </div>
              <div className="main_2">
              <div className="box">
                  <span className="title_2">매출 추이 (단위 : 만원) </span>
                  <Line className="graph" options={options2} data={data3} />
              </div>
              <div className="box" style={{width: "680px"}}>
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


