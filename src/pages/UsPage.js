import React ,{useState,useEffect} from 'react'

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";
import usAll from "../data/usaWithT";

import {mapOptions, lineDataTotal, optionProperties} from "../data/data";

import USACard  from '../component/USACard'
import StateWiseData  from '../component/StateWiseData'
import SimpleGraph from "../component/SimpleGraph"
import MapState from '../component/MapState'

import {Helmet} from 'react-helmet'
import Loader  from '../component/Loader'

import sortBy from "lodash/orderBy";
import cloneDeep from 'lodash/cloneDeep';


highchartsMap(Highcharts);

const urls=["https://curecovid19.in/readings/us_stats/get_us_current",
            "https://curecovid19.in/readings/us_stats/get_us_daily",
            "https://curecovid19.in/readings/us_stats/get_us_statewise_current",
            "https://curecovid19.in/readings/us_stats/get_us_statewise_daily"
            ]

export default function UsPage() {

    const [current, setCurrent] = useState({}); 
    const [daily, setDaily] = useState([]); 
    const [currentState, setCurrentState] = useState([]); 
    const [dailyState, setDailyState] = useState([]); 
    const [dailyConfirm, setDailyConfirm] = useState([]); 
    const [dailyActive, setDailyActive] = useState([]); 
    const [dailyRecovered, setDailyRecovered] = useState([]); 
    const [dailyDeaths, setDailyDeaths] = useState([]); 
    const [dailyDates, setDailyDates] = useState([]); 
    const [max, setMax] = useState([]); 
    const [myMap, setMyMap] = useState([]); 
    const [fetched, setFetched] = useState(false);
    const [stateGraph, setStateGraph] = useState(false);
    const [graph,setGraph] = useState([]);
    const [state,setState] = useState("");

    const [countryFlag,setCountryFlag] = useState(0);
    const [confirmFlag,setConfirmFlag] = useState(0);
    const [activeFlag,setActiveFlag] = useState(0);
    const [recoveredFlag,setRecoveredFlag] = useState(0);
    const [deathFlag,setDeathFlag] = useState(0);
    const [point,setPoint] = useState({name:""})


    useEffect(() => {
        if (fetched === false) {
          getAllData();
        }
      }, [fetched]);

    useEffect(() => {
        lineDataTotal.datasets[0].data= daily.map((val) => val.confirmed);
        lineDataTotal.datasets[0].data.reverse();
        lineDataTotal.datasets[0].data = lineDataTotal.datasets[0].data.slice(-30);
    }, [daily]);

    useEffect(() => {
        setMax(Math.max(...dailyConfirm));
        lineDataTotal.datasets[1].data = dailyConfirm.slice(-30);
    }, [dailyConfirm]);

    useEffect(() => {
        lineDataTotal.datasets[2].data = dailyRecovered.slice(-30);
    }, [dailyRecovered]);

    useEffect(() => {
        lineDataTotal.datasets[3].data = dailyDeaths.slice(-30);
    }, [dailyDeaths]);

    useEffect(() => {
        lineDataTotal.labels = dailyDates.slice(-30);
    }, [dailyDates])


    const getAllData = async () => {
        var promises = urls.map(url => fetch(url).then(res => res.json()));
        await Promise.all(promises).then(results => {
            setCurrent(results[0].us_current)
            setDaily(results[1].us_daily)
            setCurrentState(sortBy(results[2].us_statewise_current,"confirmed",'desc'))
            setDailyState(results[3].us_statewise_daily)
            
            const sliceValue= -40;
            setDailyActive((results[1].us_daily).map(a => a.delta_active).reverse().slice(sliceValue));
            setDailyConfirm((results[1].us_daily).map(a => a.delta_confirmed).reverse().slice(sliceValue));
            setDailyRecovered((results[1].us_daily).map(a => a.delta_recovered).reverse().slice(sliceValue));
            setDailyDeaths((results[1].us_daily).map(a => a.delta_deaths).reverse().slice(sliceValue));
            setDailyDates((results[1].us_daily).map(a => a.date).reverse().slice(sliceValue));

            const map = cloneDeep(mapOptions);
            map.series[0].mapData = usAll;
            const usaData = [];

            
            usaData.push({name:("Saint Thomas")})
            usaData.push({name:("Saint John")})
            usaData.push({name:("Saint Croix")})
            usaData.push({name:("Saipan")})
            usaData.push({name:("Eastern")})
            usaData.push({name:("Western")})
            usaData.push({name:("Rota")})

            results[2].us_statewise_current.forEach(element => {
                usaData.push({name:(element.state),
                            value:element.confirmed,
                            active:element.active,
                            recovered:element.recovered,
                            deaths:element.deaths})
            });
            
          //  console.log(usaData);
            map.series[0].data = usaData;
            map.series[0].joinBy =  ['name', 'name']
            map.tooltip =  {
                formatter: function(){
                    setPoint(this.point)
                    return false;
                },
            }
            setMyMap(map);            
          //  console.log(lineDataTotal);

            setPoint({name:usaData[usaData.length-1].name,
                    value:usaData[usaData.length-1].value,
                    active:usaData[usaData.length-1].active,
                    deaths:usaData[usaData.length-1].deaths,
                    recovered:usaData[usaData.length-1].recovered})

            setFetched(true);

        });
    }

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
            case "confirmed":
                setConfirmFlag(setFlag(confirmFlag,id));
            break;
            case "deaths":
                setDeathFlag(setFlag(deathFlag,id));
            break;
            default:
                setRecoveredFlag(setFlag(recoveredFlag,id)); 
        }
    }

    function setFlag(flag,data){
        if(flag===0 || flag==2){
            setCurrentState(sortBy(currentState,data,'desc'))
            return 1;
        }else{
            setCurrentState(sortBy(currentState,data,'asc'))
            return 2;
        }
    }

    function onData(e){
        
        // const newData = (dailyState.filter(a => a.state===e.target.id)).reverse()
        // const stateLineGraph = cloneDeep(lineDataTotal);
        // // console.log(newData);
        
        // stateLineGraph.datasets[0].data= newData.map((val) => val.confirmed);
        // stateLineGraph.datasets[0].data = stateLineGraph.datasets[0].data.slice(-30);

        
        // stateLineGraph.datasets[1].data = (newData.map((val) => val.confirmed)).slice(-30);;
        // stateLineGraph.datasets[2].data = (newData.map((val) => val.deaths)).slice(-30);
        // stateLineGraph.datasets[3].data = (newData.map((val) => val.recovered)).slice(-30);

        
        // stateLineGraph.labels = (newData.map((val) => val.date)).slice(-30);;

        // setGraph(stateLineGraph);
        // setState(e.target.id)
        // setStateGraph(true)
        
        //console.log(newData)

    }


                    return ( 
                        <>
                        {!fetched && ( <Loader/> )}
                        {fetched && (  
                        <React.Fragment>
                        <Helmet>
                        <title>US Covid 19 Dashboard</title>
                            {/* <meta name="description" content={metaContent}  data-react-helmet="true" /> */}
                            <meta name="theme-color" content="#008f68"  data-react-helmet="true" />
                        </Helmet>
                        
                        <div className="row">
                        <div className="col-sm-5">
                        <div className="element-wrapper pb-1">
                            <h6 className="pb-4">
                            <span className="font-weight-bold"> Dashboard for COVID-19 USA <br/>
                              {/* <span className="font-weight-bold text-danger" style={{fontSize: "20px"}}>65 </span> <span className="text-danger" style={{fontSize: "14px"}}>days since first Outbreak</span><br/> */}
                            </span>
                              {/* <span className="small text-success"> Last Updated: {data.summary.last_updated_time}</span> */}
                            </h6>
                            <div className="element-content">
                            <div className="tablo-with-chart">
                                <div className="row">
                                <div className="col-sm-12 col-xxl-12">
                                    <div className="tablos">
                                    <div className="row mb-xl-4 mb-xxl-3">
                                        <USACard name="CONFIRMED"
                                            styleName="text-danger" 
                                            data={current.confirmed}
                                            lastData={daily[0].confirmed}
                                            daily={dailyConfirm}
                                            dates={dailyDates}
                                            color={"red"}
                                            max={max}
                                            />
                                        <USACard name="ACTIVE"
                                            styleName="text-primary" 
                                            data={current.active}
                                            lastData={daily[0].active}
                                            daily={dailyActive}
                                            dates={dailyDates}
                                            color={"#0275d8"}
                                            max={max}
                                            />
                                        <USACard name="RECOVERED"
                                            styleName="text-success" 
                                            data={current.recovered}
                                            lastData={daily[0].recovered}
                                            daily={dailyRecovered}
                                            dates={dailyDates}
                                            color={"#5cb85c"}
                                            max={max}
                                            />
                                        <USACard name="DECEASED"
                                            styleName="text-secondary" 
                                            data={current.deaths}
                                            lastData={daily[0].deaths}
                                            daily={dailyDeaths}
                                            dates={dailyDates}
                                            color={"#292b2c"}
                                            max={max}
                                            />
                                    </div>
                                </div>
                                </div>
                                </div>
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
                                    Province Map View
                                </h6>
                                
                                <MapState data={point} indiaFlag={false}/>

                                <div className="element-box pt-0 mt-0">
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
                        
                        {/* <div className="row"> */}
                        <div className="col-sm-5">
                            <div className="element-wrapper">
                                <h6 className="element-header">
                                    Province Breakup
                                </h6>
                                <div className="element-box-tp">
                                <div className="table-responsive text-right">
                                    <table className="table table-lightborder">
                                    <thead style={{cursor: "pointer"}}>
                                        <tr>
                                        <th className="text-left" id="state" onClick={orderData} >
                                            Province  <i className={`fa fa-${countryFlag===0?"sort":countryFlag===1?"sort-up":"sort-down"}`} ></i>
                                        </th>
                                        <th id="confirmed" onClick={orderData}>
                                            CNFMD <i className={`fa fa-${confirmFlag===0?"sort":confirmFlag===1?"sort-up":"sort-down"}`} ></i>
                                        </th>    
                                        <th id="active" onClick={orderData}>
                                            ACTV <i className={`fa fa-${activeFlag===0?"sort":activeFlag===1?"sort-up":"sort-down"}`} ></i>
                                        </th>
                                        <th id="recovered" onClick={orderData}>
                                            RCVD <i className={`fa fa-${recoveredFlag===0?"sort":recoveredFlag===1?"sort-up":"sort-down"}`} ></i>
                                        </th>
                                        <th id="deaths" onClick={orderData}>
                                            DCSD <i className={`fa fa-${deathFlag===0?"sort":deathFlag===1?"sort-up":"sort-down"}`} ></i>
                                        </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentState.map((state,i)=><StateWiseData key={i} data={state} indiaFlag={false} onData={onData}/>)}
                                    </tbody>
                                    </table>
                                </div>
                                </div>
                            </div>
                        </div>
                        { stateGraph && (
                        <div className="col-sm-5">
                            <div className="element-wrapper">
                                <h6 className="element-header">
                                    {state}
                                </h6>
                                <div className="element-box-tp">
                                <SimpleGraph values={graph} option={optionProperties} />
                                </div>
                        </div>
                        </div>
                        )}
                        {/* </div> */}
                    </div>

                    </React.Fragment>)}
                    </>
        )
}


