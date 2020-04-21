import React, {useState,useEffect} from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";

import indiaAll from "../data/india";

import {mapData
    ,piedata
    ,lineDataTotal
    ,lineData
    ,othersTotal
    ,optionProperties
    ,optionPropertiesTotal
    ,mapOptions
    ,barChartData 
    ,optionBar} from "../data/data";

import Async from 'react-async';

import Loader  from '../component/Loader'
import Card  from '../component/Card'
import SimpleGraph  from '../component/SimpleGraph'
import StateWiseData  from '../component/StateWiseData'
import ServerDown  from './ServerDown'
import HomeUpdateCard  from '../component/HomeUpdateCard'

import {Doughnut,Bar} from 'react-chartjs-2';

import {Helmet} from 'react-helmet'
import sortBy from "lodash/orderBy";
import cloneDeep from 'lodash/cloneDeep';

highchartsMap(Highcharts);
  
  export default function Home() {

    const [states,setStates] = useState([]);
    const [articles,setArticles] = useState([]);
    const [myMap, setMyMap] = useState([]); 
    const [data, setData] = useState({});  
    const [graph, setGraph] = useState({});  
    const [metaContent, setMetaContent] = useState({});  

    const [countryFlag,setCountryFlag] = useState(0);
    const [confirmFlag,setConfirmFlag] = useState(0);
    const [activeFlag,setActiveFlag] = useState(0);
    const [recoveredFlag,setRecoveredFlag] = useState(0);
    const [deathFlag,setDeathFlag] = useState(0);

    const [fetched,setFetched] = useState(false);

    useEffect(() => {
        if (fetched === false) {
          loadUsers();
        }
      }, [fetched]);

      const loadUsers = async() =>
        await fetch("https://curecovid19.in/readings/readings/get_summary")
        // fetch("http://192.168.1.157:5000/readings/get_summary")
        .then(res => res.json()
        .then(data =>{ 
          setArticles(data.articles);
          console.log(data)

          data.statewise.forEach(element => {
              mapData.forEach((field,i) => {
                  if(element.state.toLowerCase()=== field[0]){
                      mapData[i][1]=element.total;
                  }
              });
          });


          const map = cloneDeep(mapOptions);
            map.series[0].mapData = indiaAll;
            const indiaData = [];

            data.statewise.forEach(element => {
                indiaData.push({name:(element.state),
                            value:element.total,
                            active:element.active,
                            recovered:element.recovered,
                            deaths:element.deaths})
            });
            
          //  console.log(indiaData);
            map.series[0].data = indiaData;
            map.series[0].joinBy =  ['name', 'name']
            map.tooltip =  {
                formatter: function(){
                    var s = '<p><b>' + (this.point.name).toUpperCase() + '</b></p><br/>';
                    s += 'CONFIRMED : <b>' + (this.point.value===undefined?"NA":this.point.value) + '</b><br/>';
                    s += 'ACTIVE : <b>' + (this.point.active===undefined?"NA":this.point.active) + '</b><br/>';
                    s += 'RECOVERED : <b>' + (this.point.recovered===undefined?"NA":this.point.recovered) + '</b><br/>';
                    s += 'DECEASED : <b>' + (this.point.deaths===undefined?"NA":this.point.deaths)+'</b>';
                    return s;
                },
            }
            setMyMap(map);  
            setStates(data.statewise);
            setData(data);

                    const totalValue = [];
                    const deathsValue = [];
                    const activeValue = [];
                    const recoveredValue = [];

                    const totalValue1 = [];
                    const daysValue1 = [];
                    const deathsValue1 = [];
                    const activeValue1 = [];
                    const recoveredValue1 = [];
                    const cumulative_confirmed = [];


                    const last_value = -20
                    lineData.datasets=othersTotal.datasets;
                    lineData.labels = (data.dashboard_graphs).map(a => a.day).reverse().slice(last_value) 
                    const simpleTotal = cloneDeep(lineData);
                    const simpleDeaths = cloneDeep(lineData);
                    const simpleActive = cloneDeep(lineData);
                    const simpleRecovered = cloneDeep(lineData);

                    data.dashboard_graphs.forEach(element => {
                        totalValue.push(element.daily_total);
                        deathsValue.push(element.daily_deaths);
                        activeValue.push(element.daily_active);
                        recoveredValue.push(element.daily_recovered);

                        totalValue1.push(element.total);
                        daysValue1.push(element.day.split(" ").slice(0, 2));
                        deathsValue1.push(element.deaths);
                        activeValue1.push(element.active);
                        recoveredValue1.push(element.recovered);
                    });

          
            simpleTotal.datasets[0].data = totalValue.slice(last_value);
            simpleTotal.datasets[0].borderColor = "red"
            
            simpleDeaths.datasets[0].data = deathsValue.slice(last_value);
            simpleDeaths.datasets[0].borderColor = "#292b2c"
            
            simpleActive.datasets[0].data = activeValue.slice(last_value);
            simpleActive.datasets[0].borderColor = "#0275d8"
            
            simpleRecovered.datasets[0].data = recoveredValue.slice(last_value);
            simpleRecovered.datasets[0].borderColor = "#5cb85c"

            optionPropertiesTotal.scales.yAxes[0].ticks.max = Math.round(Math.max(...totalValue) + (Math.max(...totalValue)*0.04));
            optionPropertiesTotal.scales.yAxes[0].ticks.min = -15;

            lineDataTotal.labels  = daysValue1.slice(-30);
            lineDataTotal.datasets[1].data = totalValue.slice(-30);
            lineDataTotal.datasets[2].data = recoveredValue.slice(-30);
            lineDataTotal.datasets[0].data = (data.cumulative_confirmed).map(a => a.count).slice(-30)
            lineDataTotal.datasets[3].data = deathsValue.slice(-30);

            barChartData.labels = Object.keys(data.age);
            barChartData.datasets[0].data = Object.values(data.age);

            const genderValue=[];
            const gernderLabel=[];
            data.gender.forEach(element=>{
                genderValue.push(element.count);
                gernderLabel.push(element.gender)
            })
            if(data.gender.length === 2)
            { 
              genderValue.push(0);
            }
            piedata.datasets[0].data = genderValue;
            piedata.labels = gernderLabel;

            setGraph({"total":simpleTotal,
                      "active":simpleActive,
                      "recovered":simpleRecovered,
                      "deaths":simpleDeaths})

          setMetaContent(`Total Cases:${data.summary.total},Active Cases:${data.summary.active},Recovered:${data.summary.recovered},Deaths:${data.summary.deaths}`)

          setFetched(true);

        })
       
      )

    function  orderData(e) {

      setCountryFlag(0);
      setConfirmFlag(0);
      setActiveFlag(0);
      setRecoveredFlag(0);
      setDeathFlag(0);
      const id = e.target.id;
      switch(id){
          case "state":
              setCountryFlag(setFlag(countryFlag,id));
          break;
          case "active":
              setActiveFlag(setFlag(activeFlag,id));
          break;
          case "total":
              setConfirmFlag(setFlag(confirmFlag,id));
          break;
          case "deaths":
              setDeathFlag(setFlag(deathFlag,id));
          break;
          default:
              setRecoveredFlag(setFlag(recoveredFlag,id)); 
      }

      // console.log(e.target.id)
  }

  function setFlag(flag,data){
      if(flag===0 || flag==2){
          setStates(sortBy(states,data,'desc'))
          return 1;
      }else{
        setStates(sortBy(states,data,'asc'))
          return 2;
      }
  }


                    return ( 
                        <>
                          {!fetched && ( <Loader/> )}
                          {fetched && (  
                          <React.Fragment>
                          <Helmet>
                          <title>India Covid 19 Dashboard</title>
                            <meta name="description" content={metaContent}  data-react-helmet="true" />
                            <meta name="theme-color" content="#008f68"  data-react-helmet="true" />
                          </Helmet>
                        
                        {/* first one start */} 
                        <div className="row">
                            <div className="col-sm-5">
                                <h6 className="pb-2">
                                    <span className="font-weight-bold"> 
                                        Dashboard for COVID-19 India 
                                        <br/>
                                        <span className="font-weight-bold text-danger" style={{fontSize: "16px"}}> 
                                            {data.num_days} 
                                        </span>
                                        <span className="text-danger" style={{fontSize: "12px"}}> days since first outbreak
                                        </span>
                                        <br/>
                                    </span>
                                    <span className="text-success" style={{fontSize: "12px"}}>
                                        Last Updated: {data.summary.last_updated_time}
                                    </span>
                                </h6>
                                
                                {/* Dashboard Tiles */} 
                                <div className="row">
                                    <div className="col-sm-12 col-xxl-12">
                                        <div className="row mb-xl-4 mb-xxl-3">
                                            <Card name="CONFIRMED" styleName="text-danger" 
                                                data={data.summary.total.toLocaleString("en-IN")} diff={data.total_diff}
                                                values={graph.total} option={optionPropertiesTotal}
                                                />
                                            <Card name="ACTIVE" styleName="text-primary" 
                                                data={data.summary.active.toLocaleString("en-IN")} diff={0}
                                                values={graph.active} option={optionPropertiesTotal}
                                                />
                                            <Card name="RECOVERED" styleName="text-success" 
                                                data={data.summary.recovered.toLocaleString("en-IN")} diff={data.recovered_diff}
                                                values={graph.recovered} option={optionPropertiesTotal}
                                                />
                                            <Card name="DECEASED" styleName="text-secondary" 
                                                data={data.summary.deaths.toLocaleString("en-IN")} diff={data.deaths_diff}
                                                values={graph.deaths} option={optionPropertiesTotal}
                                                />
                                        </div>
                                    </div>
                                </div>

                                {/* Graphs */}
                                <div className="element-wrapper pb-2">
                                    <div className="element-box">
                                      <SimpleGraph values={lineDataTotal} option={optionProperties} />
                                    </div>
                                </div>

                            </div>
                            
                            <div className="col-sm-7">
                                <div className="element-wrapper">
                                    <h6 className="element-header">
                                        <svg height="50" width="12" className="blinking"><circle cx="5" cy="24" r="5" fill="red" /></svg> Updates 
                                    </h6>
                                    <div className="element-box-tp">
                                        {articles.map(element=><HomeUpdateCard data={element} key={element.id}/>)}
                                    </div>
                                    <br/>
                                    <div className="row">
                                        <div className="col-sm-4 col-2">
                                        </div>
                                        <button className="btn btn-md btn-primary" onClick={()=> window.location="/updates"}>View More</button>
                                        </div>
                                    <br/>
                                </div>
                            </div>

                        <div className="col-sm-5">
                        <div className="element-wrapper">
                        <h6 className="element-header">
                          Statewise Breakup
                        </h6>
                        <div className="element-box-tp">
                          <div className="table-responsive text-right">
                            <table className="table table-lightborder">
                              <thead>
                              <tr>
                                <th className="text-left" id="state" onClick={orderData} >
                                    State  <i class={`fa fa-${countryFlag===0?"sort":countryFlag===1?"sort-up":"sort-down"}`} ></i>
                                </th>
                                <th id="total" onClick={orderData}>
                                    CNFMD <i class={`fa fa-${confirmFlag===0?"sort":confirmFlag===1?"sort-up":"sort-down"}`} ></i>
                                </th>    
                                <th id="active" onClick={orderData}>
                                    ACTV <i class={`fa fa-${activeFlag===0?"sort":activeFlag===1?"sort-up":"sort-down"}`} ></i>
                                </th>
                                <th id="recovered" onClick={orderData}>
                                    RCVD <i class={`fa fa-${recoveredFlag===0?"sort":recoveredFlag===1?"sort-up":"sort-down"}`} ></i>
                                </th>
                                <th id="deaths" onClick={orderData}>
                                    DCSD <i class={`fa fa-${deathFlag===0?"sort":deathFlag===1?"sort-up":"sort-down"}`} ></i>
                                </th>
                              </tr>
                              </thead>
                              <tbody>
                                  {states.map(state=><StateWiseData key={state.id} data={state}/>)}
                            </tbody>
                            </table>
                        </div>
                        </div>
                    </div>
                    </div>
                    
                    <div className="col-sm-4">
                                <div className="element-wrapper">
                                    <h6 className="element-header">
                                        Statewise Map View
                                    </h6>
                                    <div className="element-box pt-0">
                                    <div data-highcharts-chart="0" style={{overflow: "hidden"}}>
                                        <HighchartsReact
                                            constructorType={"mapChart"}
                                            highcharts={Highcharts}
                                            options={myMap}
                                            />
                                    </div>
                                    </div>
                                </div>
                            </div>
                                        


                          <div className="col-sm-3">
                            <div className="element-wrapper pb-2">
                              <h6 className="element-header">
                                Age Distribution
                              </h6>
                              <div className="element-box pt-0">
                                <div className="el-chart-w">
                                  <Bar data={barChartData}
                                  height="200px"
                                  options={optionBar} />
                                  <span> *Age data not available for {data.undefinedage} cases</span>
                                </div>
                              </div>
                            </div>
                            <div className="element-wrapper">
                            <h6 className="element-header">
                                Gender Distribution
                              </h6>
                            <div className="element-box pt-0">
                              <div className="el-chart-w">
                                    <Doughnut data={piedata} 
                                    height="225px"
                                    options={{ maintainAspectRatio: true, cutoutPercentage: 60, legend: { labels:{fontFamily: ["Inter", "Sans-serif"], boxWidth: 12}} }}/>
                              </div>
                            </div>
                          </div>
                            </div>
                    </div>
                    </React.Fragment>)}
                    </>
    )
}


