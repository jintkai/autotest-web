import React, {Component} from 'react'
import {Button} from 'react-bootstrap'
import CaseList from './CaseList'
import SuitInfo from '../suit/SuitInfo'
import SuitCaseTable from "./SuitCaseTable";
import CaseModal from "./CaseModal";
import CaseLogDialog from "../caselog/CaseLogDialog";
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";

class SuitCase extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            showCase: false,
            operate: 0,
            suitid: props.match.params.id,
            refresh: false,
            showlog: false,
            buildid: 0,
            debug: false,
            suitcaseid: 0
        });
    }

    initParams(buildid) {

        this.setState({
            buildid: buildid
        }, function () {
        });

    }


    handleShowCase(operate) {
        this.setState({
            showCase: true,
            operate: operate
        })
    }

    runMainSuit() {
        let params = new URLSearchParams();
        params.set("id", this.state.suitid);
        params.set("debug", this.state.debug);

        fetch("/api/suitcase/runMainSuit", {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        })
    }

    render() {
        return (
            <div className="suitcase">
                <SuitInfo suitid={this.state.suitid} onInitParams={this.initParams.bind(this)}/>
                <div>
                    <a onClick={this.handleShowCase.bind(this, 1)} style={{cursor: 'pointer'}}><span
                        className="glyphicon glyphicon-plus-sign btn-lg text-success">添加用例</span></a>
                    <a style={{cursor: 'pointer'}}><span
                        className="glyphicon glyphicon-registration-mark text-danger btn-lg"
                        onClick={this.runMainSuit.bind(this)}>运行套件</span></a>
                    <a className="caseLog1" href="#"><span
                        className="glyphicon glyphicon-cd text-success btn-lg">查看日志</span></a>
                    <Link to={"/suitparam/" + this.state.suitid}><span
                        className="glyphicon glyphicon-globe text-danger btn-lg">自定义变量</span></Link>
                    <lable>
                        <input type="checkbox" className="has-warning" onChange={() => {
                            this.setState(
                                {
                                    debug: !this.state.debug
                                }
                            );

                        }}/><span
                        className="glyphicon glyphicon-question-sign">Debug模式</span>
                    </lable>
                </div>

                <SuitCaseTable refresh={this.state.refresh} suitid={this.state.suitid} callBack={(suitcaseid) => {
                    this.setState({
                        operate: 2,
                        suitcaseid: suitcaseid,
                        showCase: true
                    });
                }}
                               showLog={(id) => {
                                   this.setState({
                                       showlog: true,
                                       suitcaseid: id
                                   });
                               }}

                />
                <CaseModal show={this.state.showCase} operate={this.state.operate} suitid={this.state.suitid}
                           suitcaseid={this.state.suitcaseid}
                           callBack={() => {
                               this.setState({
                                   refresh: true
                               });
                           }}
                           closeCase={() => {
                               this.setState({
                                   showCase: false
                               });
                           }}
                />
                <CaseLogDialog show={this.state.showlog} suitcaseid={this.state.suitcaseid}
                               buildid={this.state.buildid}
                               closeLog={() => {
                                   this.setState({
                                       showlog: false
                                   });
                               }}/>
            </div>
        );
    }
}

export default SuitCase;