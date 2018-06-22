import React, {Component} from 'react'
import {Badge, Panel, Grid, Col} from 'react-bootstrap'

export default class SuitInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            "suitid": this.props.suitid,
            "suitName": "",
            "lastbuildid": 0,
            "status": 0,
            "timestamp": 0
        };
        this.getSuitInfo(this.state.suitid);
        this.timer = setInterval(() => {
            this.getSuitInfo(this.state.suitid);
        }, 5000);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    getSuitInfo(suitid) {
        var _this = this;
        var url = new Request("/api/suit/selectById?suitid=" + suitid, {method: 'Get'});
        fetch(url).then(function (response) {
            if (response.status != 200) {
                return;
            } else {
                response.json().then(function (data) {
                    if (data.code != 200) {
                        alert("获取信息失败!");
                        return;
                    }
                    let da = new Date(data.data.timestamp);
                    let daformat = da.getFullYear()+"-"+(da.getMonth()+1)+"-"+da.getDate()+" "+da.getHours()+":"+da.getMinutes()+":"+da.getSeconds();
                    _this.setState({
                        'suitName': data.data.suitname,
                        'lastbuildid': data.data.lastbuildid,
                        "status": data.data.status,
                        timestamp:daformat
                    });
                })
            }
        })
    }

    render() {
        return (

            <div className="suitinfo">
                <Panel bsStyle={this.state.status == 0 ? "info" : "warning"}
                       expanded={this.state.open}>
                    <Panel.Heading onClick={() => {
                        this.setState({
                            open: !this.state.open
                        });
                    }}>
                        <Panel.Title componentClass="h3">套件概要<Badge bsStyle="success">10/1/11</Badge><span style={{float:'right'}} className={this.state.open?'glyphicon glyphicon-menu-up':'glyphicon glyphicon-menu-down'}>{this.state.open?'收缩':'展开'}</span></Panel.Title>
                    </Panel.Heading>
                    <Panel.Collapse>
                        <Panel.Body>
                            <div>
                                <Grid>
                                    <Col xs={4} md={4}>名称：{this.state.suitName}</Col>
                                    <Col xs={4} md={4}>构建ID：{this.state.lastbuildid}</Col>
                                </Grid>
                                <Grid>
                                    <Col xs={4} md={4}>执行时间：{this.state.timestamp}</Col>
                                    <Col xs={4} md={4}>状态：{this.state.status == 0 ? "已完成" : "执行中"}</Col>
                                </Grid>
                            </div>
                            <div className="progress">
                                <div className="progress-bar progress-bar-striped active progress-bar-success"
                                     role="progressbar"
                                     aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style={{width: "95%"}}>
                                    <span className="sr-only">45% Complete</span>
                                </div>
                            </div>
                        </Panel.Body>
                    </Panel.Collapse>
                </Panel>
            </div>
        );
    }
}
