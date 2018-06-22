import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import SuitDialog from "./SuitDialog";
import ProgressDiv from "../common/Progress/ProgressDiv";
import Table from 'rc-table';
import {Button} from 'antd';
import 'rc-table/assets/index.css';
import Animate from 'rc-animate';
import 'rc-table/assets/animation.css';
import {Spin, Alert} from 'antd';

const AnimateBody = (props) =>
    <Animate transitionName="move" component="tbody" {...props} />;

export default class SuitTable extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            suitlist: [],
            operate: 0,
            suitid: 0,
            loading: true
        });
        this.getSuitList();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.refresh === true) {
            this.getSuitList();
        }
    }

    getSuitList() {
        var _this = this;
        fetch("/api/suit/", {
            method: "GET"
        }).then(function (req) {
            if (req.ok) {
                req.json().then(function (result) {
                    if (result.code == 200) {
                        _this.setState(
                            {
                                suitlist: result.data,
                                loading: false
                            }
                        )
                    }

                });
            }
        })
    }

    deleteSuit(id) {
        const _this = this;
        const url = "/api/suit/delete?suitid=" + id;
        fetch(url, {
            method: 'POST',
            header: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }).then(function (res) {
            if (res.ok) {
                res.json().then(function (json) {
                    if (json.code === 200) {
                        _this.getSuitList();
                    } else {
                        alert('删除失败');
                    }
                });
            } else {
                alert('接口调用失败！');
            }
        });
    }

    getSuit(id) {
        let _this = this;
        const url = "/api/suit/selectById?suitid=" + id;
        fetch(url).then(function (res) {
            if (res.ok) {
                res.json().then(function (json) {
                    if (json.code === 200) {
                        console.log(json.data);
                        _this.setState({
                            showSuit: true,
                            suit: json.data,
                            operate: 2
                        })
                    }
                })
            }
        });
    }

    initState() {
        this.setState({
            suitname: '',
            data: null
        })
    }

    saveSuit(suit) {
        var _this = this;
        let url;

        let params = new URLSearchParams();

        if (this.state.operate === 1) {
            url = "/api/suit/add";
            params.set("suitname", suit.suitname);
        }
        if (this.state.operate === 2) {
            url = "/api/suit/update";
            params.set("suitid", suit.suitid);
            params.set("suitname", suit.suitname);

        }

        fetch(url, {
            method: 'POST',
            header: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: params
        }).then(function (res) {
            if (res.ok) {
                res.json().then(function (json) {
                    if (json.code != 200) {
                        alert(json.msg);
                    } else {
                        _this.setState({
                            showSuit: false
                        }, function () {
                        });
                        _this.getSuitList();
                    }
                })
            }
        })

    }


    render() {

        let columns = [
            {title: 'SuitID', dataIndex: 'suitid', key: 'suitid', width: 50},
            {title: '名称', dataIndex: 'name', key: 'name'},
            {title: '构建ID', dataIndex: 'buildid', key: 'buildid'},
            {
                title: '运行状态', dataIndex: 'finished', key: 'finished', render: (text, record) => {
                return <span
                    className={record.finished == 0 ? 'glyphicon glyphicon-ok-sign' : 'glyphicon glyphicon-info-sign'}></span>
            }
            },
            {
                title: '运行结果', dataIndex: 'status', key: 'status', render: (text, record) => {
                return (<ProgressDiv type="danger" height="3px" width="50px" pro="70"/>);
            }
            },
            {title: '定时执行', dataIndex: 'plan', key: 'plan'},
            {
                title: '操作', dataIndex: '', key: 'd', render: (text, record) => {
                return <span><Link to={"/suitcase/" + record.suitid}><span
                    className="glyphicon glyphicon-registration-mark text-success">查看</span></Link>{' '}
                    <a onClick={() => {
                        this.deleteSuit(record.suitid);
                    }} style={{cursor: 'pointer'}} className="text-danger"><span
                        className='glyphicon glyphicon-remove-sign'>删除</span></a></span>;
            }
            }
        ];
        let data = [];
        this.state.suitlist.map(function (item) {
            let a = {
                suitid: item.suitid,
                name: item.suitname,
                buildid: item.lastbuildid,
                finished: item.status,
                key: item.suitid
            };
            data.push(a);
        });


        return (
            <div>
                <div style={{paddingTop: '3px'}}><Button
                    type="primary"
                    icon="plus-circle-o"
                    onClick={() => {
                        this.initState();
                        this.setState({
                            showSuit: true,
                            operate: 1
                        })
                    }}>Add</Button>
                    <Button type="primary" icon="reload"
                            onClick={() => {
                                this.setState({loading: true});
                                this.getSuitList();
                            }}>Update</Button></div>

                <Spin tip="Loading..." delay={1000} spinning={this.state.loading}>
                    <Table columns={columns} data={data} scroll={{x: true}}
                           footer={currentData => <div>Total: {currentData.length} items</div>}
                           onRowDoubleClick={(record, index) => {
                               this.setState({
                                   suitid: record.suitid,
                                   operate: 2,
                                   showSuit: true
                               });
                           }}
                           components={{
                               body: {wrapper: AnimateBody},
                           }}></Table>
                </Spin>

                <SuitDialog show={this.state.showSuit}
                            suitid={this.state.suitid}
                            operate={this.state.operate}
                            callback={() => {
                                this.setState({
                                    showSuit: false
                                });
                                this.getSuitList();
                            }}/>
            </div>
        );
    }
}