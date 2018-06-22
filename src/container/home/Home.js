import React, {Component} from 'react';
import HomePanel from './HomePanel';
import {Well} from 'react-bootstrap';
import ReactEcharts from "echarts-for-react";

export default class Home extends Component {

    render() {
        var xAxisData = [];
        var data1 = [];
        var data2 = [];
        for (var i = 0; i < 100; i++) {
            xAxisData.push('类目' + i);
            data1.push((Math.sin(i / 5) * (i / 5 -10) + i / 6) * 5);
            data2.push((Math.cos(i / 5) * (i / 5 -10) + i / 6) * 5);
        }
        return (
            <div className="home">
                <div>
                    <div className="homeTop">
                        Dashboard
                    </div>

                    <div>
                        <HomePanel/>
                    </div>

                    <div>
                        <div className="panel">
                        </div>
                        <ReactEcharts
                            option={
                                {
                                    title: {
                                        text: '柱状图动画延迟'
                                    },
                                    legend: {
                                        data: ['bar', 'bar2'],
                                        align: 'left'
                                    },
                                    xAxis: {
                                        data: xAxisData,
                                        silent: false,
                                        splitLine: {
                                            show: false
                                        }
                                    },
                                    yAxis: {
                                    },
                                    series: [{
                                        name: 'bar',
                                        type: 'bar',
                                        data: data1,
                                        animationDelay: function (idx) {
                                            return idx * 10;
                                        }
                                    }, {
                                        name: 'bar2',
                                        type: 'bar',
                                        data: data2,
                                        animationDelay: function (idx) {
                                            return idx * 10 + 100;
                                        }
                                    }],
                                }
                            }
                            style={{height: '300px',width:'400px'}}
                            notMerge={true}
                            lazyUpdate={true}
                            theme={"theme_name"}
                        />

                        <ReactEcharts
                            option={
                                {
                                    title: {
                                        text: '柱状图动画延迟'
                                    },
                                    legend: {
                                        data: ['bar', 'bar2'],
                                        align: 'left'
                                    },
                                    xAxis: {
                                        data: xAxisData,
                                        silent: false,
                                        splitLine: {
                                            show: false
                                        }
                                    },
                                    yAxis: {
                                    },
                                    series: [{
                                        name: 'bar',
                                        type: 'bar',
                                        data: data1,
                                        animationDelay: function (idx) {
                                            return idx * 10;
                                        }
                                    }, {
                                        name: 'bar2',
                                        type: 'bar',
                                        data: data2,
                                        animationDelay: function (idx) {
                                            return idx * 10 + 100;
                                        }
                                    }],
                                }
                            }
                            style={{height: '300px',width:'400px'}}
                            notMerge={true}
                            lazyUpdate={true}
                            theme={"theme_name"}
                        />
                    </div>

                </div>
            </div>
        );
    }
}