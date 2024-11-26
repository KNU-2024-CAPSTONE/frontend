import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  import styled from 'styled-components';

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
  

function S3() { 

  const baseURL = 'http://localhost:8080';
  const [searchParams] = useSearchParams();
  const shopid = searchParams.get("shopid");
  const button_categories = ["10대", "20대", "30대", "40대+", "남성", "여성"];
  const toggleData = [
    { id: 1, label: "별점 반영", key: "isStarCount", marginRight: "120px" },
    { id: 2, label: "리뷰 반영", key: "isReview", marginRight: "120px" },
    { id: 3, label: "등록일 반영", key: "isPostDate", marginRight: "98px" },
  ];

  const recommend = useDataFetch(`${baseURL}/api/customer/sale/recommend/${shopid}`);
  const purchaselog = useDataFetch(`${baseURL}/api/customer/sale/product/${shopid}`);
  const shoplog = useDataFetch(`${baseURL}/api/shop`);
  const fetchedData = useDataFetch(`${baseURL}/api/recommend/${shopid}`);
  const [productReco, setProductReco] = useState([]);
  const [selected, setSelected] = useState([]); 

  useEffect(() => {
    if (fetchedData && Object.keys(fetchedData).length > 0) {
      setProductReco(fetchedData);
    }
  }, [fetchedData]);

  const toggleHandler = (key) => {
    setProductReco((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const handleInputChange = (key, value) => {
    setProductReco((prev) => ({...prev, [key]: value, }));
  };
  const toggleSelection = (index) => {
    setSelected((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index] 
    );
  };

  const Frequency = (purchaselog, selected) => {
    const keywordCount = {};

    if (!purchaselog) return [];

    const isGenderMatching = (item) => {
      if (selected.includes(4) && selected.includes(5)) return true;
      if (selected.includes(4) && item.gender !== "male") return false;
      if (selected.includes(5) && item.gender !== "female") return false;
      return true;
    };

    const isMatchingCriteria = (item) => {
      if (selected.includes(0) && (item.age >= 10 && item.age < 20)) { return isGenderMatching(item);}
      if (selected.includes(1) && (item.age >= 20 && item.age < 30)) { return isGenderMatching(item);}
      if (selected.includes(2) && (item.age >= 30 && item.age < 40)) { return isGenderMatching(item);}
      if (selected.includes(3) && (item.age >= 40)) { return isGenderMatching(item);}
      if (!selected.includes(0) && !selected.includes(1) && !selected.includes(2) && !selected.includes(3)) { return isGenderMatching(item);}
      return false;
    };

    purchaselog.filter(isMatchingCriteria).forEach((item) => {
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

  const sortedKeywords = Frequency(purchaselog, selected);

    
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
        data: [recommend?.cartPercent || 0, recommend?.purchasePercent || 0],
        backgroundColor: 'rgba(179, 170, 255, 0.5)',
        maxBarThickness: 40,
      },
    ],
  }:{};

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${baseURL}/api/recommend/${shopid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productReco),
      });

      if (response.ok) {
        alert("설정이 성공적으로 저장되었습니다.");
      } else {
        alert("설정 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("서버와 연결에 실패했습니다.");
    }
  };

    return ( 
      <div className="S3">
        <div className="title2">{shoplog?.[shopid-1]?.name || " "} 관리페이지</div>
         
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
              <span className="title_2" style={{left:'170px'}}>유형별 인기상품</span>
              <div style={{marginLeft: '160px'}}>
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
                <div className="box" style={{width: "700px", marginTop: "0px"}}>
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
                <div className="box" style={{width: "700px"}}>
                  <div> <span className="title_2">추천 알고리즘 관리</span> <div className="button3" onClick={handleSubmit}>설정</div> </div>
                  <div style={{display: 'flex'}}>
                  <div>
                  {toggleData.map((item) => (
                  <div key={item.id} style={{ margin: "15px", marginBottom: "0px" }}>
                    <span className="text4" style={{ marginRight: item.marginRight, top: "2px" }}>{item.label}</span>
                    <ToggleContainer onClick={() => toggleHandler(item.key)}>
                      <span className={`toggle-container ${ productReco[item.key] ? "toggle--checked" : ""}`}/>
                      <span className={`toggle-circle ${ productReco[item.key] ? "toggle--checked" : ""}`}/>
                    </ToggleContainer>
                  </div>
                ))}
                </div>
                <div>
                <div style = {{margin: '15px', marginLeft: '0px'}}><span className="text4" style={{marginRight: '90px'}}>추천 상품 수</span> <input value={productReco.k} onChange={(e) => handleInputChange("k", e.target.value)} className='blank2'/> <span className='text5'>개</span></div>
                <div><span className="text4" style={{marginRight: '100px'}}>전환 비율</span> <input value={productReco.conversionRate} style={{width: '60px'}} onChange={(e) => handleInputChange("conversionRate", e.target.value)} className='blank2'/> <span className='text5'>%</span> </div>
                </div> </div>
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
  
  
  const ToggleContainer = styled.span`
  position: absolute;
  cursor: pointer;
  margin-top: 10px;

  > .toggle-container {
    width: 50px;
    height: 24px;
    border-radius: 30px;
    display: inline-block;
    background-color: rgba(204,204,204,1);}
    //.toggle--checked 클래스가 활성화 되었을 경우의 CSS를 구현
  > .toggle--checked {
    background-color: rgb(179, 170, 255);
    transition : 0.5s
  }

  > .toggle-circle {
    position: absolute;
    top: 1px;
    left: 1px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: rgb(255,254,255);
    transition : 0.5s
    //.toggle--checked 클래스가 활성화 되었을 경우의 CSS를 구현
  } >.toggle--checked {
    left: 27px;
    transition : 0.5s
  }
`;
  
  