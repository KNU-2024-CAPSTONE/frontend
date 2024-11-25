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

function S2() { 

  const baseURL = 'http://3.34.133.252:8080'
  const [searchParams] = useSearchParams();
  const shopid = searchParams.get("shopid");

  useEffect(() => {
    fetch(`${baseURL}/api/outflux/${shopid}`)
    .then((response) => response.json())
    .then((data) => console.log(data));
  }, []);

  const [selected, setSelected] = useState("월간");
  const handleClick = (button) => {
    setSelected(button); 
  };

  const [outfluxlog, setOutfluxlog] = useState([]);
  const [ofcoslog, setOfcoslog] = useState([]);
  const [loyallog, setLoyallog] = useState([]);

  useEffect(() => {
    fetch(`${baseURL}/api/outflux/${shopid}`)
    .then((response) => response.json())
    .then((data) => setOutfluxlog(data));
  }, []);
  useEffect(() => {
    fetch(`${baseURL}/api/outflux/customers/${shopid}`)
    .then((response) => response.json())
    .then((data) => setOfcoslog(data));
  }, []);
  useEffect(() => {
    fetch(`${baseURL}/api/outflux/loyal/${shopid}`)
    .then((response) => response.json())
    .then((data) => setLoyallog(data));
  }, []);

  const ChartOfDate = (data0, datafield) => {
    const outflux = {};  const loyal = {};
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
      
      if (entry.isOutflux===true){
        if (!outflux[key]) {outflux[key] = 1;}
        else {outflux[key] += 1;}
      }
      else {
        if (!loyal[key]) {loyal[key] = 1;}
        else {loyal[key] += 1;}
      }
    });

  const labels = [];
  const outfluxdata = []; const loyaldata = [];

  if (selected === "월간") {
    const startMonth = month1;
    const startYear = year1;

    for (let i = 0; i < 6; i++) {
      const targetMonth = startMonth + i;
      const targetYear = startYear + Math.floor(targetMonth / 12);
      const monthInYear = targetMonth % 12;

      const targetKey = `${targetYear}-${monthInYear + 1}`;
      labels.push(`${monthInYear+1}월`);
      outfluxdata.push(outflux[targetKey] || 0);
      loyaldata.push(loyal[targetKey] || 0);
    }
  } else if (selected === "일간") {
    const startDate = sixDaysAgo;
    const endDate = currentDate;

    for (let d = startDate; d < endDate; d.setDate(d.getDate() + 1)) {
      const targetKey = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
      outfluxdata.push(outflux[targetKey] || 0);
      loyaldata.push(loyal[targetKey] || 0);
    }
  }

    return {
      labels,
      datasets: [
        {
          label: '이탈고객 (명)',
          data: outfluxdata,
          borderColor: 'rgba(255, 99, 132, 0.5)', 
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: '층성고객 (명)',
          data: loyaldata,
          borderColor: 'rgba(53, 162, 235, 0.5)', 
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
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

      if (isValid==true && entry.isOutflux==true) {
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

  const data1 = ChartOfDate(ofcoslog, 'postDate');
  const data2 = ChartOfGender(ofcoslog, 'postDate');


    return (
      <div className="S2">
        <div className="title2">쇼핑몰1 관리페이지</div>
         
         <Link to={`/S1?shopid=1`} className="no-visited tab tab2 place1">
             <span className="text">고객 통계</span>
         </Link>
         <Link to={`/S2?shopid=1`} className="no-visited tab tab1 place2">
             <span className="text">이탈 관리</span>
         </Link> 
         <Link to={`/S3?shopid=1`} className="no-visited tab tab3 place3">
             <span className="text">맞춤 추천</span>
         </Link>
         <div className="main">
            <div className="main_2">
                <div className="box"  style={{width: "580px"}}>
                    <div> <span className="title_2">이탈 알고리즘 관리</span> <div className="button3">설정</div> </div>
                    <div style={{margin:'15px', marginBottom: '0px'}}><span className="text4">마지막 구매날짜</span> <input value={outfluxlog.lastPurchase} className='blank'/> <span className='text5'>개월</span> </div>
                    <div style={{margin:'15px', marginBottom: '0px'}}><span className="text4">마지막 환불날짜</span> <input value={outfluxlog.lastRefund}  className='blank'/> <span className='text5'>개월</span> </div>
                    <div style={{margin:'15px', marginBottom: '0px'}}><span className="text4">지난달 환불비율</span> <input value={outfluxlog.refundPercent} className='blank' style={{width: '60px'}}/> <span className='text5'>%</span> </div>
                    <div style={{margin:'15px', marginBottom: '0px'}}><span className="text4">재발급 방지기간</span> <input value={outfluxlog.reIssue}className='blank'/> <span className='text5'>개월</span> </div>
                </div>
                <div className="box" style={{width: "530px"}}>
                    <span className="title_2">이탈·충성고객 추이</span>
                    <Line className="graph" options={options} data={data1} />
                </div>
                <span className="button2" style={{backgroundColor: selected === "월간" ? "rgba(164,164,164,1)" : "white",}} onClick={() => handleClick("월간")}>월간</span>
                <span className="button2" style={{backgroundColor: selected === "일간" ? "rgba(164,164,164,1)" : "white",}} onClick={() => handleClick("일간")}>일간</span>
                </div>
                <div className="main_2">
                <div className="box" style={{width: "580px"}}>
                    <div> <span className="title_2">충성 알고리즘 관리</span> <div className="button3">설정</div> </div>
                    <div style={{marginLeft: '100px', marginTop: '30px'}}>
                      <span className="text5">최근</span> <input value={outfluxlog.purchaseWithCategory} className='blank2' /> <span className="text5">개월 동안 동일상품</span>
                      <input value={outfluxlog.purchaseNumber} className='blank2'/> <span className="text5">회 이상 구매</span> 
                    </div>
                </div>
                <div className="box" style={{width: "600px"}}>
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
  