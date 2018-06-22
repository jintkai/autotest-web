import React, {Component} from 'react';
import {Button, Badge, Table, Grid, Row, Col, Panel} from 'react-bootstrap';
import ReactJson from 'react-json-view'

export default class LogPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {state: 0, open: true, message: props.message};
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            title: nextProps.title,
            message: nextProps.message,
            status: nextProps.status,
            type: nextProps.type
        });
    }


    render() {
        let bodyList, bodyTable;
        if (this.state.type === 'string') {
            bodyTable = (<div>{this.state.message}</div>)
        }

        if (this.state.type === 'header') {
            if (this.state.message != "") {
                console.log("this.state.message", this.state.message);
                let jsonArray = JSON.parse(this.state.message == null ? "[]" : this.state.message);
                bodyList = jsonArray.map(function (item) {
                    return (<tr key={item.id}>
                        <td>{item.pkey}</td>
                        <td>{item.pvalue}</td>
                        <td>{item.description}</td>
                    </tr>);
                });
                bodyTable = (
                    <Table striped bordered condensed hover>
                        <thead>
                        <tr>
                            <th>名称</th>
                            <th>内容</th>
                            <th>描述</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bodyList}
                        </tbody>
                    </Table>);
            }
        }

        if (this.state.type === "assert") {
            if (this.state.message != null && this.state.message != "") {
                let jsonBody = JSON.parse(this.state.message);
                bodyList = jsonBody.map(function (item) {

                    let ruleStr;
                    switch (item.rule) {
                        case "equal":
                            ruleStr = "等于";
                            break;
                        case "unequal":
                            ruleStr = "不等于";
                            break;
                        case "less":
                            ruleStr = "小于";
                            break;
                        case "greater":
                            ruleStr = "大于";
                            break;
                        case "contain":
                            ruleStr = "包含";
                            break;
                        default:
                            ruleStr = "未知";
                    }
                    return (<tr key={item.id} className={item.result.success === 0 ? "text-danger" : "text-success"}>
                        <td><span className={item.result.success === 0 ? "glyphicon glyphicon-flash" : ""}></span></td>
                        <td>{item.variable}</td>
                        <td>{item.negation === false ? "否" : "是"}</td>
                        <td>{ruleStr}</td>
                        <td>{item.value}</td>
                        <td>{item.result.message}</td>
                    </tr>)
                });
                bodyTable = (
                    <Table striped bordered condensed hover>
                        <thead>
                        <tr>
                            <th style={{width: "5px"}}>#</th>
                            <th>变量名称</th>
                            <th>取反</th>
                            <th>校验规则</th>
                            <th>校验值</th>
                            <th>实际值</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bodyList}
                        </tbody>
                    </Table>);
            }

        }

        if (this.state.type === 'body') {
            if (this.state.message != "") {
                let jsonBody = JSON.parse(this.state.message);
                console.log("jsonBody", jsonBody);
                if (jsonBody != null && jsonBody.type === 1) {
                    let jsonArray = jsonBody.body;
                    bodyList = jsonArray.map(function (item) {
                        return (<tr key={item.id}>
                            <td>{item.pkey}</td>
                            <td>{item.pvalue}</td>
                            <td>{item.description}</td>
                        </tr>);
                    });

                    bodyTable = (
                        <Table striped bordered condensed hover>
                            <thead>
                            <tr>
                                <th>参数名</th>
                                <th>参数值</th>
                                <th>描述</th>
                            </tr>
                            </thead>
                            <tbody>
                            {bodyList}
                            </tbody>
                        </Table>);
                }
                if (jsonBody != null && jsonBody.type === 2) {
                    bodyTable = (<div>
                        <ReactJson src={jsonBody.body} name={false} displayObjectSize={false}
                                   displayDataTypes={false}/>
                    </div>);
                }
            }
        }


        return (<div>
                <Panel bsStyle={this.state.status === true ? "success" : "danger"}
                       style={{'margin-bottom': '5px'}}
                       expanded={this.state.open}>
                    <Panel.Heading onClick={() => {
                        this.setState({
                            open: !this.state.open
                        });
                    }}>
                        <Panel.Title componentClass="h6" style={{'font-size': '10px'}}>{this.state.title}<Badge
                            bsStyle="success"></Badge><span
                            style={{float: 'right'}}
                            className={this.state.open ? 'glyphicon glyphicon-menu-up' : 'glyphicon glyphicon-menu-down'}>{this.state.open ? '收缩' : '展开'}</span></Panel.Title>
                    </Panel.Heading>
                    <Panel.Collapse>
                        <Panel.Body style={{'font-size': '8px'}}>
                            {bodyTable}
                        </Panel.Body>
                    </Panel.Collapse>
                </Panel>
            </div>
        )
    };
}
