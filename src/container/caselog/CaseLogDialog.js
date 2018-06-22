import React, {Component} from 'react';
import {Button, Modal, Alert, Panel} from 'react-bootstrap';
import {Collapse} from 'antd'
import LogPanel from './LogPanel';
import TypeLogDiv from './TypeLogDiv';

export default class CaseLogDialog extends Component {
    constructor(props) {
        super(props);
        this.state = (
            {
                show: this.props.show,
                buildid: 0,
                suitcaseid: props.suitcaseid, resultStatue: false,
                resultMessage: "",
                urlStatus: true,
                requestUrl: "",
                bodyStatus: true,
                requestBody: "",
                headerStatus: true,
                requestHeader: "",
                httpStatus: true,
                responseHeader: "",
                responseBody: "",
                assertlog: "",
                assertStatus: true,
                caseType: 'MAIN',
                responseCode: 200,
                responseTime: 0,
                status: 1,
                preResults: [],
                postResults: [],
                updatetime:0
            });
        this.initState();
    }

    initState() {
        this.setState({
            resultStatue: true,
            resultMessage: "",
            urlStatus: true,
            requestUrl: "",
            bodyStatus: true,
            requestBody: "",
            headerStatus: true,
            requestHeader: "",
            httpStatus: true,
            assertStatus: true,
            responseHeader: "",
            responseBody: "",
            assertlog: "",
            assertExp: "",
            status: 1,
            caseType: "MAIN",
            updatetime:0
        })
    }

    componentWillReceiveProps(nextProps) {
        var _this = this;
        this.initState();
        this.setState({
            show: nextProps.show,
            suitcaseid: nextProps.suitcaseid,
            buildid: nextProps.buildid
        }, function () {
            _this.getCaseLog();
        });
    }

    handleHide() {
        var _this = this;
        this.setState({
            show: false
        }, function () {
            _this.props.closeLog();
        })
    }

    initLog() {
        var assertLog = this.state.assertlog;

        var assertLogObject = JSON.parse(assertLog);
        if (assertLogObject != null) {
            for (var i = 0; i < assertLogObject.length; i++) {
                if (assertLogObject[i].success == 0) {
                    switch (assertLogObject[i].assertType) {
                        case "url":
                            this.setState({
                                urlStatus: false,
                                requestUrl: assertLogObject[i].message
                            });
                            break;
                        case "header":
                            this.setState({
                                headerStatus: false,
                                requestHeader: assertLogObject[i].message
                            });
                            break;
                        case "body":
                            this.setState({
                                bodyStatus: false,
                                requestBody: assertLogObject[i].message
                            });
                            break;
                        case "http":
                            this.setState({
                                httpStatus: false,
                                resultMessage: assertLogObject[i].message
                            });
                            break;
                        case "assert":
                            this.setState({
                                assertStatus: false,
                                resultMessage: assertLogObject[i].message

                            });

                    }
                }
            }
        }
    }

    getCaseLog() {
        var _this = this;
        var params = new URLSearchParams();
        params.set("suitcaseid", this.state.suitcaseid);
        params.set("buildid", this.state.buildid);
        fetch("/api/suit/result/getSuitResult", {
            method: 'POST',
            header: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: params
        }).then(function (res) {
            if (res.ok) {
                res.json().then(function (json) {
                    if (json.code == 200) {

                        try {
                            let headerObject = JSON.parse(json.data.requestHeader)
                            let headerStr = '';
                            headerObject.map(function (item) {
                                let temp = item.pkey + ":" + item.pvalue + ";";
                                headerStr = headerStr + temp;
                            });
                            _this.setState({
                                requestHeader: headerStr
                            });
                        } catch (e) {
                            _this.setState({
                                requestHeader: json.data.requestHeader
                            });
                        }


                        _this.setState({
                            status: json.data.status,
                            buildid: json.data.buildid,
                            requestBody: json.data.requestBody,
                            requestUrl: json.data.requestUrl,
                            responseHeader: json.data.responseheader,
                            responseBody: json.data.responsebody,
                            assertlog: json.data.assertlog,
                            responseCode: json.data.responsecode,
                            responseTime: json.data.responsetime,
                            assertExp: json.data.assertExp,
                            caseType: json.data.casetype,
                            updatetime:json.data.updatetime
                        }, function () {
                            _this.initLog();
                            _this.getTypeResult(this.state.suitcaseid, this.state.buildid);
                        })
                    } else {
                        console.log(json.msg);
                    }
                });
            }
        });

    }

    getTypeResult(caseid, buildid) {
        let _this = this;
        let params = new URLSearchParams();
        params.set("suitcaseid", this.state.suitcaseid);
        params.set("buildid", this.state.buildid);
        fetch("/api/suit/result/getByType", {
            method: 'POST',
            header: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: params
        }).then(function (res) {
            if (res.ok) {
                res.json().then(function (json) {
                    if (json.code == 200) {
                        _this.setState({
                            preResults: json.data.preResults,
                            postResults: json.data.postResults
                        })
                    } else {
                        console.log(json.msg);
                    }
                });
            }
        });
    }

    formatDate(number) {
        let now = new Date(number);
        var year = now.getFullYear(),
            month = now.getMonth() + 1,
            date = now.getDate(),
            hour = now.getHours(),
            minute = now.getMinutes(),
            second = now.getSeconds();

        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    }

    render() {

        let preDiv = "";
        let postDiv = "";
        if (this.state.caseType === "MAIN") {
            preDiv = (<TypeLogDiv title='前置请求' data={this.state.preResults}/>);
            postDiv = (<TypeLogDiv title='后置请求' data={this.state.postResults}/>);
        } else {

        }

        return (<div className="caselogdialog">
            <Modal show={this.state.show} onHide={this.handleHide.bind(this)} bsSize="large">
                <Modal.Header closeButton>
                    <Modal.Title
                        className={this.state.status == 1 ? "text-success glyphicon-ok-sign glyphicon" : "text-danger glyphicon glyphicon-remove-sign"}>
                        {this.state.status == 1 ? "执行成功" : "执行失败"}({this.state.suitcaseid + "_" + this.state.buildid})
                        <span className="glyphicon glyphicon-time" style={{fontSize:'10px'}}>{this.state.updatetime ==0 ?"":this.formatDate(this.state.updatetime)}</span>
                    </Modal.Title>
                    <h6>
                        <span className="glyphicon glyphicon-ok-circle">前置请求&nbsp;</span>
                        <span
                            className={"glyphicon " + (this.state.urlStatus === false || this.state.bodyStatus === false || this.state.headerStatus === false ? "text-danger glyphicon-remove-circle" : "glyphicon-ok-circle")}>CASE解析&nbsp;</span>
                        <span
                            className={"glyphicon " + (this.state.httpStatus === false ? "text-danger glyphicon-remove-circle" : "glyphicon-ok-circle")}>HTTP调用&nbsp;</span>
                        <span className={"glyphicon glyphicon-ok-circle"}>断言解析&nbsp;</span>
                        <span
                            className={"glyphicon " + (this.state.assertStatus === false ? "text-danger glyphicon-remove-circle " : "glyphicon-ok-circle")}>断言判断&nbsp;</span>
                        <span className="glyphicon glyphicon-ok-circle">后置请求&nbsp;</span>
                        <span style={{float: 'right', 'paddingRight': '40px'}} className="text-success">time:<span
                            className={this.state.responseTime >= 500 ? 'text-danger' : 'text-success'}>{' ' + this.state.responseTime}</span>ms</span>
                        <span style={{float: 'right', 'paddingRight': '40px'}} className="text-success">status:<span
                            className={this.state.responseCode >= 400 ? 'text-danger' : 'text-success'}>{' ' + this.state.responseCode}</span></span>
                    </h6>
                </Modal.Header>
                <Modal.Body>
                    <h6 className="text-danger">{this.state.resultMessage}</h6>
                    {preDiv}

                    <LogPanel title="1.请求地址" type="string" message={this.state.requestUrl}
                              status={this.state.urlStatus}/>
                    <LogPanel title="2.请求头" type="header" message={this.state.requestHeader}
                              status={this.state.headerStatus}/>
                    <LogPanel title="3.请求体" type="body" message={this.state.requestBody}
                              status={this.state.bodyStatus}/>
                    <LogPanel title="4.返回头" type="string" message={""}
                              status={true}/>
                    <LogPanel title="5.返回体" type="string" message={this.state.responseBody}
                              status={true}/>
                    <LogPanel title="6.断言" type="assert" message={this.state.assertExp}
                              status={this.state.assertStatus}/>

                    {postDiv}
                </Modal.Body>
            </Modal>
        </div>);
    }
}