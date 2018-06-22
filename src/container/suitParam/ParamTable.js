import React, {Component} from 'react';
import Table from 'rc-table';
import 'rc-table/assets/index.css';
import Animate from 'rc-animate';
import 'rc-table/assets/animation.css';
import {Button, Icon, Input, Select, Form} from 'antd';

const AnimateBody = (props) =>
    <Animate transitionName="move" component="tbody" {...props} />;

export default class ParamTable extends Component {

    constructor(props) {
        super(props);
        let dataSource = [
            {
                id: 1,
                global: '是',
                caseid: '',
                paramType: '',
                paramName: 'leader',
                methodType: '随机值',
                methodParam: '1,10'
            },
            {id: 2, global: '否', caseid: '12', paramType: '前置', paramName: 'islad', methodType: '返回体', methodParam: ''},
            {
                id: 3,
                global: '是',
                caseid: '',
                paramType: '后置',
                paramName: 'test01',
                methodType: '字符串截取',
                methodParam: '${islad},1,2'
            },
        ];
        this.state = ({type: props.type, dataSource: dataSource});
    }

    addData() {
        let data = this.state.dataSource;
        data.push({
            id: data.length + 1,
            global: false,
            caseid: this.state.caseid,
            paramType: 'prefix',
            paramName: '',
            methodType: 'mString',
            methodParam: ''
        });

        this.setState({
            dataSource: data
        });
    }

    setData(index, global, caseid, paramType, name, methodType, methodParam) {
        let data = this.state.dataSource;
        let pattern;
        let verify;
        if (methodType === 'mRandom') {
            pattern = new RegExp('\\b\\d+,\\d+\\b', 'g'); //单词边界必须是数字
        }
        let result = methodParam.match(pattern);
        if (result == null || result.length != 1) {
            console.log("输入不合法！");
            verify = "error";
        }

        data[index - 1] = {
            id: index,
            global: global,
            caseid: caseid,
            paramType: paramType,
            paramName: name,
            methodType: methodType,
            methodParam: methodParam,
            verify: verify
        };
        this.setState({
            dataSource: data
        }, function () {
            this.props.callBack(this.state.dataSource);
        })
    }

    deleteData(index) {
        let data = [];
        for (let i = 0; i < this.state.dataSource.length; i++) {
            if (i != index) {
                let temp = this.state.dataSource[i];
                temp.id = data.length + 1;
                data.push(temp);
            }
        }
        this.setState({
            dataSource: data
        }, function () {
            this.props.callBack(this.state.dataSource);
        });
    }

    render() {
        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        }, {
            title: '变量名',
            dataIndex: 'paramName',
            key: 'paramName',
            render: (text, record) => {
                return (<Input value={text} onChange={(e) => {
                    this.setData(record.id, false, '1', 'prefix', e.target.value, record.methodType, record.methodParam)
                }
                }/>);
            }
        },
            , {
                title: '取值方法',
                dataIndex: 'methodType',
                key: 'methodType',
                render: (text, record) => {
                    return <Select
                        value={record.methodType}
                        onChange={(e) => {
                            console.log("text", text);
                            this.setData(record.id, false, '1', 'prefix', record.paramName, e, record.methodParam)
                        }
                        }>
                        <Select.Option value="mString">字符串</Select.Option>
                        <Select.Option value="mRandom">随机值</Select.Option>
                        <Select.Option value="mBody">返回体</Select.Option>
                        <Select.Option value="mSub">数据截取</Select.Option>
                        <Select.Option value="mCustom">自定义</Select.Option>
                    </Select>;
                }
            }
            , {
                title: '取值参数',
                dataIndex: 'methodParam',
                key: 'methodParam',
                render: (text, record) => {
                    return (
                        <Input value={text}
                                onChange={(e) => {
                                    this.setData(record.id, false, '1', 'prefix', record.paramName, record.methodType, e.target.value);
                                }
                                }/>
                        )
                }
            }, {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) => {
                    return (<div>
                        <Button icon="arrow-up" size="small"
                                disabled={record.id == 1 ? true : false}
                                onClick={() => {
                                    let currentRow = this.state.dataSource[record.id - 1];//3 record.id=3
                                    let upRow = this.state.dataSource[record.id - 2];//2
                                    let dataSource = this.state.dataSource;
                                    dataSource[record.id - 1] = upRow; //第3行值=第2行
                                    dataSource[record.id - 1].id = record.id; //id要换-
                                    dataSource[record.id - 2] = currentRow;
                                    dataSource[record.id - 2].id = record.id - 1;
                                    this.setState({
                                        dataSource: dataSource
                                    });

                                }}></Button>
                        <Button icon="arrow-down" size="small"
                                disabled={record.id == this.state.dataSource.length ? true : false}
                                onClick={() => {
                                    let currentRow = this.state.dataSource[record.id - 1];//2
                                    let downRow = this.state.dataSource[record.id];//3
                                    let dataSource = this.state.dataSource;
                                    dataSource[record.id - 1] = downRow; //2
                                    dataSource[record.id - 1].id = record.id; //id要换-
                                    dataSource[record.id] = currentRow;
                                    dataSource[record.id].id = record.id + 1;
                                    this.setState({
                                        dataSource: dataSource
                                    });

                                }}></Button>
                        <Button type="danger" icon="close-circle" size="small"
                                onClick={() => {
                                    this.deleteData(record.id - 1);
                                }}
                        ></Button>
                    </div>);
                }
            }
        ];


        return (<div className="paramtable">
            <Table columns={columns} data={this.state.dataSource}
                   rowKey={record => record.id}
                   footer={currentData => <div>
                       <Button type="dashed" icon="plus-circle"
                               size="small"
                               onClick={() => {
                                   this.addData();
                               }
                               }
                       ></Button>
                   </div>}
                   components={{
                       body: {wrapper: AnimateBody},
                   }}
            />
        </div>);
    }
}