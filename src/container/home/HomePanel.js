import React, {Component} from 'react';
import {Grid, Row, Col, Well} from 'react-bootstrap';
import InfoPanel from './InfoPanel';
import "./home.css";

export default class HomePanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newSuit: 0,
            totalSuit: 0,
            newCase: 0,
            totalCase: 0
        };
        this.getStatstics();
    }


    getStatstics() {
        let _this = this;
        fetch("/api/statistics/").then(function (response) {
            if (response.ok) {
                response.json().then(function (result) {
                    _this.setState({
                        newCase: result.data.newCase,
                        totalCase:result.data.totalCase,
                        newSuit:result.data.newSuit,
                        totalSuit:result.data.totalSuit
                    });
                })
            }

        });
    }

    render() {
        let option = {
            dataA: this.state.newSuit,
            dataB: this.state.totalSuit,
            showA: 'New Suit',
            showB: 'Total Suit',
            show: 'A',
            ico: "glyphicon glyphicon-send",
            backColor: '#A87BCF',
            fontColor: '#FFF'
        };

        return (
            <div className="homepanel">
                <Col xs={3} ms={3}>
                    <InfoPanel option={option}/>
                </Col>
                <Col xs={3} ms={3}>
                    <InfoPanel option={
                        {
                            dataA: this.state.newCase,
                            dataB: this.state.totalCase,
                            showA: 'New Case',
                            showB: 'Total Suit',
                            show: 'A',
                            ico: "glyphicon glyphicon-tags",
                            backColor: '#FFF',
                            fontColor: '#A87BCF'
                        }
                    }/>
                </Col>
                <Col xs={3} ms={3}>
                    <InfoPanel option={
                        {
                            dataA: '10',
                            dataB: '91',
                            showA: 'New Case',
                            showB: 'Total Suit',
                            show: 'A',
                            ico: "glyphicon glyphicon-cloud",
                            backColor: '#58D094',
                            fontColor: '#FFF'
                        }
                    }/>
                </Col>
                <Col xs={3} ms={3}>
                    <InfoPanel option={
                        {
                            dataA: '10',
                            dataB: '91',
                            showA: 'Add Case',
                            showB: 'Total Suit',
                            show: 'A',
                            ico: "glyphicon glyphicon-time",
                            backColor: '#FFF',
                            fontColor: '#58D094'
                        }
                    }/>
                </Col>

            </div>
        );
    }
}