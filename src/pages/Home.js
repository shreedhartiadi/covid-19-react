import React  from 'react'

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";

import {mapData,piedata,lineDataTotal,lineDataActive,lineDataDeaths
    ,lineDataRecovered,othersActive,othersDeaths,othersRecovered,othersTotal
    ,optionProperties,optionPropertiesData,optionPropertiesDataActive,optionPropertiesDataRecovered
    ,optionPropertiesDeaths,optionPropertiesActive,optionPropertiesRecovered,optionPropertiesTotal
    ,mapOptions,barChartData,axis ,optionBar} from "../data/data";

import Async from 'react-async';

import Loader  from '../component/Loader'
import Card  from '../component/Card'
import SimpleGraph  from '../component/SimpleGraph'
import StateWiseData  from '../component/StateWiseData'
import ServerDown  from './ServerDown'

import {Doughnut,Bar} from 'react-chartjs-2';

import {Helmet} from 'react-helmet'

highchartsMap(Highcharts);


// const Layout = lazy(() => import('../component/Layout'));
  const loadUsers = () =>
    fetch("https://curecovid19.in/readings/readings/get_summary")
    .then(res => (res.ok ? res : Promise.reject(res)))
    .then(res => res.json())

  
  export default function Home() {

      return (
          
          <Async promiseFn={loadUsers} >
                {({ data, err, isLoading }) => {
                    if (isLoading) return (<Loader/>)
                    if (err) return <ServerDown/>
                    if (data)
                    var  active = data.summary.total - data.summary.recovered - data.summary.deaths;
                  
                    data.statewise.forEach(element => {
                        mapData.forEach((field,i) => {
                            if(element.state.toLowerCase()=== field[0]){
                                mapData[i][1]=element.total;
                            }
                        });
                    });

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

                    const totalValue = [];
                    const daysValue = [];
                    const deathsValue = [];
                    const activeValue = [];
                    const recoveredValue = [];

                    const totalValue1 = [];
                    const daysValue1 = [];
                    const deathsValue1 = [];
                    const activeValue1 = [];
                    const recoveredValue1 = [];
                    const cumulative_confirmed = [];
                    data.dashboard_graphs.forEach(element => {
                        totalValue.push(element.daily_total);
                        daysValue.push(element.day);
                        deathsValue.push(element.daily_deaths);
                        activeValue.push(element.daily_active);
                        recoveredValue.push(element.daily_recovered);

                        totalValue1.push(element.total);
                        daysValue1.push(element.day.split(" ").slice(0, 2));
                        deathsValue1.push(element.deaths);
                        activeValue1.push(element.active);
                        recoveredValue1.push(element.recovered);
                    });

                    data.cumulative_confirmed.forEach(element =>{
                        cumulative_confirmed.push(element.count);
                    });

                    lineDataTotal.labels = lineDataDeaths.labels = lineDataRecovered.labels = lineDataActive.labels = daysValue1.slice(-30);
                    lineDataTotal.datasets[1].data = totalValue.slice(-30);
                    // lineDataTotal.datasets[2].data = totalValue1.slice(-30);
                    lineDataTotal.datasets[2].data = recoveredValue.slice(-30);
                    lineDataTotal.datasets[0].data = cumulative_confirmed.slice(-30);

                    const last_value = -20
                    const simpleTotal = Object.assign({}, lineDataTotal);
                    simpleTotal.datasets=othersTotal.datasets;
                    simpleTotal.datasets[0].data = totalValue.slice(last_value);
                    simpleTotal.labels = daysValue.slice(last_value);

                    const simpleDeaths = Object.assign({}, lineDataDeaths);
                    simpleDeaths.datasets=othersDeaths.datasets;
                    simpleDeaths.datasets[0].data = deathsValue.slice(last_value);
                    simpleDeaths.labels = daysValue.slice(last_value);

                    const simpleActive = Object.assign({}, lineDataActive);
                    simpleActive.datasets=othersActive.datasets;
                    simpleActive.datasets[0].data = activeValue.slice(last_value);
                    simpleActive.labels = daysValue.slice(last_value);

                    const simpleRecovered = Object.assign({}, lineDataRecovered);
                    simpleRecovered.datasets=othersRecovered.datasets;
                    simpleRecovered.datasets[0].data = recoveredValue.slice(last_value);
                    simpleRecovered.labels = daysValue.slice(last_value);
                    
                    const highscale = 0.04;
                    othersTotal.datasets[0].borderColor = "#e65252";
                    othersActive.datasets[0].borderColor = "#268df9";
                    othersRecovered.datasets[0].borderColor = "#24b314";
                    othersDeaths.datasets[0].borderColor = "#3e4b5b";
                    optionPropertiesTotal.scales.yAxes[0].ticks.max = Math.round(Math.max(...totalValue) + (Math.max(...totalValue)*highscale));
                    optionPropertiesTotal.scales.yAxes[0].ticks.min = -15;
                    optionProperties.scales.yAxes[1].ticks.max = Math.round(Math.max(...cumulative_confirmed) + (Math.max(...cumulative_confirmed)*highscale));
                    optionProperties.scales.yAxes[1].ticks.min = 0;
                    optionPropertiesDeaths.scales.yAxes[0].ticks.max = Math.round(Math.max(...totalValue) + (Math.max(...totalValue)*highscale));
                    optionPropertiesDeaths.scales.yAxes[0].ticks.min = -15;
                    optionPropertiesRecovered.scales.yAxes[0].ticks.min = -15;
                    optionPropertiesActive.scales.yAxes[0].ticks.min = -15;
                    optionPropertiesActive.scales.yAxes[0].ticks.max = Math.round(Math.max(...totalValue) + (Math.max(...totalValue)*highscale));
                    optionPropertiesRecovered.scales.yAxes[0].ticks.max = Math.round(Math.max(...totalValue) + (Math.max(...totalValue)*highscale));
                  
                    const metaContent = `Total Cases:${data.summary.total},Active Cases:${active},Recovered:${data.summary.recovered},Deaths:${data.summary.deaths}`
                    const num_days = data.num_days;
                    return ( 
                        <>
                          <Helmet>
                           <title>India Covid 19 Dashboard</title>
                            <meta name="description" content={metaContent}  data-react-helmet="true" />
                            <meta name="theme-color" content="#008f68"  data-react-helmet="true" />
                          </Helmet>
                        
                        {/* first one start */} 
                        <div className="row"><div className="col-sm-5"><div className="element-wrapper pb-1">
                            <h6 className="pb-4">
                              <span className="font-weight-bold"> Dashboard for COVID-19 India <br/>
                              <span className="font-weight-bold text-danger" style={{fontSize: "20px"}}> {num_days} </span> <span className="text-danger" style={{fontSize: "14px"}}>days since first Outbreak</span><br/>
                              </span>
                              <span className="small text-success"> Last Updated: {data.summary.last_updated_time}</span>
                            </h6>
                            <div className="element-content">
                            <div className="tablo-with-chart">
                                <div className="row">
                                <div className="col-sm-12 col-xxl-12">
                                    <div className="tablos">
                                    <div className="row mb-xl-4 mb-xxl-3">

                                        <Card name="CONFIRMED"
                                            styleName="text-danger" 
                                            data={data.summary.total}
                                            diff={data.total_diff}
                                            values={simpleTotal}
                                            option={optionPropertiesTotal}
                                            />
                                        <Card name="ACTIVE"
                                            styleName="text-primary" 
                                            data={active}
                                            diff={data.active_diff}
                                            values={simpleActive}
                                            option={optionPropertiesActive}
                                            />
                                        <Card name="RECOVERED"
                                            styleName="text-success" 
                                            data={data.summary.recovered}
                                            diff={data.recovered_diff}
                                            values={simpleRecovered}
                                            option={optionPropertiesRecovered}
                                            />
                                        <Card name="DECEASED"
                                            styleName="text-secondary" 
                                            data={data.summary.deaths}
                                            diff={data.deaths_diff}
                                            values={simpleDeaths}
                                            option={optionPropertiesDeaths}
                                            />
                                    </div>
                                  </div>
                                </div>
                                
                      </div> </div> </div></div>

                        <div className="element-wrapper pb-2">
                            <div className="element-box">
                              <SimpleGraph 
                                values={lineDataTotal}
                                option={optionProperties}
                                />
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
                                        options={mapOptions}
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
                                  <th className="text-left">
                                    State
                                  </th>
                                  <th>
                                    CNFMD
                                  </th>    
                                  <th>
                                    ACTV
                                  </th>
                                  <th>
                                    RCVD
                                  </th>
                                  <th>
                                    DCSD
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                  {data.statewise.map(state=><StateWiseData key={state.id} data={state}/>)}
                            </tbody>
                            </table>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className="col-sm-1">
                    </div>
                    

                    </div>
                    </>
        )}}
      </Async>
    )
}


