import React, {Component} from 'react';
import {Button, ButtonGroup} from 'react-bootstrap';
import Table from 'rc-table';
import 'rc-table/assets/index.css';

export default class SuitCaseTable extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            caselist: [],
            suitid: props.suitid
        });
        this.getCaseList(this.state.suitid);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            suitid: nextProps.suitid
        });
        if (nextProps.refresh === true) {
            this.getCaseList(this.state.suitid)
        }
    }

    getCaseList(id) {
        var _this = this;
        var req = "/api/suitcase/?suitID=" + id;
        var urlReq = new Request(req, {method: 'GET'})
        fetch(urlReq).then(function (response) {
            if (response.status != 200) {
                return;
            }
            response.json().then(function (result) {
                if (result.code != 200) {
                    alert("查询结果错误！");
                    return;
                }
                let allCase = result.data;
                let mainCase = [];
                allCase.map(function (item) {
                    if (item.caseType == 'MAIN') {
                        mainCase.push(item);
                    }
                });
                mainCase.map(function (item) {
                    item.children = [];
                    for (let i = 0; i < allCase.length; i++) {
                        if (allCase[i].mainCase != null && allCase[i].mainCase == item.id) {
                            let temp = {
                                id: allCase[i].id,
                                type: allCase[i].caseType,
                                casename: allCase[i].casename,
                                method: allCase[i].requesttype,
                                url: allCase[i].requesturl,
                                header: allCase[i].requestheader,
                                body: allCase[i].requestbody,
                                assert: allCase[i].assertexp,
                                order: allCase[i].requestorder
                            };
                            item.children.push(temp);
                        }
                        if (i == allCase.length - 1) {
                            if (item.children.length == 0) {
                                item.children = null;
                            }
                        }
                    }
                })
                _this.setState({"caselist": mainCase});
            });
        });
    }

    /*
    getSubCaseList(mainCaseID) {
        var _this = this;
        var req = "/api/suitcase/getSubCase/?caseid=" + mainCaseID;
        var urlReq = new Request(req, {method: 'GET'});
        var subdata = [];
        subdata = fetch(urlReq).then(function (response) {
            if (response.status != 200) {
                return;
            }
            response.json().then(function (result) {
                if (result.code != 200) {
                    alert("查询结果错误！");
                    return result.data;
                }
                console.log(result.data);
                return result.data;
            });
        });
        return subdata;
    }
    */
    deleteCase(id) {
        var _this = this;
        var req = "/api/suitcase/delete";
        var urlReq = new Request(req, {method: 'POST'});
        fetch(urlReq, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "id=" + id
        }).then(function (res) {
            if (res.ok) {
                res.json().then(function (result) {
                    if (result.code == 200) {
                        _this.getCaseList(_this.state.suitid);
                    }
                })

            }
        });
    }

    runCase(id) {
        var _this = this;
        this.setState({
            showLog: true,
            buildid: 0,
            suitcaseid: id
        });
        let queryParam = new URLSearchParams();
        queryParam.set("id", id)
        queryParam.set("buildid", 0)
        fetch("/api/suitcase/runGroup", {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: queryParam
        });

        _this.props.showLog(id);
    }

    render() {

        let _this = this;
        let columns = [
            {title: 'ID', dataIndex: 'id', key: 'id', width: 30, fixed: 'left'},
            {
                title: 'TYPE', dataIndex: 'type', key: 'type', width: 60, render: (text, record) => {
                switch (record.type) {
                    case "MAIN":
                        return (<span>主请求</span>);
                        break;
                    case "PREFIX":
                        return (<span className="text-danger glyphicon glyphicon-menu-up">前置</span>);
                    case "POSTFIX":
                        return (<span className="text-danger glyphicon glyphicon-menu-down">后置</span>);
                }
            }
            },
            {title: '用例名称', dataIndex: 'casename', key: 'casename', width: 200},
            {
                title: '方法', dataIndex: 'method', key: 'method', width: 50, render: (text, record) => {
                switch (record.method) {
                    case "2":
                        return ( <span className="text-info">POST</span>);
                        break;
                    case "3":
                        return ( <span className="text-primary">PUT</span>);
                    case "4":
                        return ( <span className="text-danger">DELETE</span>);
                        break;
                    default:
                        return ( <span className="text-success">GET</span>);
                }
            }
            },
            {title: '请求地址', dataIndex: 'url', key: 'url'},
            // {
            //     title: '请求头', dataIndex: 'header', key: 'header', render: (text, record) => {
            //     if (record.header === '' || record.header == null) {
            //         return <span>{record.header}</span>
            //     }
            //     let headerObject = JSON.parse(record.header);
            //     let headerStr = '';
            //     headerObject.map(function (item) {
            //         let temp = item.pkey + ":" + item.pvalue + ";";
            //         headerStr = headerStr + temp;
            //     });
            //     return <span>
            //         {headerStr}
            //     </span>
            // }
            // },
            // {title: '请求体', dataIndex: 'body', key: 'body'},
            // {title: '断言', dataIndex: 'assert', key: 'assert'},
            {title: '顺序', dataIndex: 'order', key: 'order'},
            {
                title: '操作', dataIndex: '', key: 'd', width: 50, fixed: 'right', render: (text, record) => {
                return <div><Button bsStyle="link" bsSize="xsmall" style={{outline: "none"}}><span
                    className="glyphicon glyphicon-registration-mark text-success"
                    onClick={_this.runCase.bind(_this, record.id)}>运行</span></Button>
                    <Button bsStyle="link" bsSize="xsmall" onClick={_this.deleteCase.bind(_this, record.id)}
                            className="text-danger" style={{outline: "none"}}><span
                        className='glyphicon glyphicon-remove-sign'>删除</span></Button>
                    <Button bsStyle="link" bsSize="xsmall" style={{outline: "none"}}
                            onClick={() => {
                                _this.props.showLog(record.id);
                            }
                            }><span
                        className="glyphicon glyphicon-cd text-success"
                    >日志</span></Button>
                </div>;
            }
            }
        ];

        let data = [];

        this.state.caselist.map(function (item) {
            let temp = {
                id: item.id,
                type: item.caseType,
                casename: item.casename,
                method: item.requesttype,
                url: item.requesturl,
                header: item.requestheader,
                body: item.requestbody,
                assert: item.assertexp,
                order: item.requestorder,
                children: item.children
            };
            data.push(temp);
        });

        return (<div className="suitcaseTable">
            <Table columns={columns} footer={currentData => <div>Total: {currentData.length} items</div>}
                   data={data} scroll={{x: '150%', y: 600}}
                   rowKey={record => record.id}
                   expandIconAsCell={true}
                   onRowDoubleClick={(record, index) => {
                       this.props.callBack(record.id);
                   }}
            />
        </div>);
    }
}