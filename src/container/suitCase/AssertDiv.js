import React, {Component} from 'react';
import Table from 'rc-table';
import 'rc-table/assets/index.css';
import Animate from 'rc-animate';
import 'rc-table/assets/animation.css';
import {Checkbox, Select, Input,Button} from 'antd';
import './kv.css';

const AnimateBody = (props) =>
    <Animate transitionName="move" component="tbody" {...props} />;

export default class AssertDiv extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            data: props.data
        });
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            data: nextProps.data
        })
    }

    addKV(currentData) {
        let data = this.state.data;
        let tmp = {
            id: currentData.length + 1,
            aType: 'code',
            variable: 'Status Code',
            negation: false,
            rule: 'equal',
            aValue: ''
        }

        data.push(tmp);
        this.setState({
            data: data
        });
    }

    setKV(id, aType, variable, negation, rule, aValue) {
        let data = this.state.data;
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === id) {
                data[i].aType = aType;
                if (aType === "code") {
                    variable = 'Status Code';
                }
                if (aType === 'spendTime')
                    variable = 'Spend Time';
                if (aType === 'responseBody')
                    variable = 'Response Body';
                data[i].variable = variable;
                data[i].negation = negation;
                data[i].rule = rule;
                data[i].aValue = aValue;
                break;
            }
        }
        this.setState({
            data: data
        });
        this.props.dataCallBack(data);
    }


    deleteKV(id) {
        let data = [];
        let _this = this;
        this.state.data.forEach(function (temp) {
            if (temp.id !== id) {
                data.push(temp);
            }
        });
        let data2 = [];
        for (let i = 0; i < data.length; i++) {
            let temp = {
                id: i + 1,
                aType: data[i].aType,
                variable: data[i].variable,
                negation: data[i].negation,
                rule: data[i].rule,
                aValue: data[i].aValue
            };
            data2.push(temp);
        }
        this.setState({
            data: data2
        }, function () {
            _this.props.dataCallBack(data2);
        });

    }

    render() {
        let _this = this;
        let columns = [
            {title: 'ID', dataIndex: 'id', key: 'id', width: '5%'},
            {
                title: '字段类型', dataIndex: 'aType', key: 'aType', width: '20%', render(text, record, index) {
                return (<div>
                        <Select defaultValue={record.aType} onChange={(e) => {
                            _this.setKV(index + 1, e, record.variable, record.negation, record.rule, record.aValue);
                        }}>
                            <Select.Option value="code">返回码</Select.Option>
                            <Select.Option value="spendTime">响应时长</Select.Option>
                            <Select.Option value="responseBody">返回体</Select.Option>
                            <Select.Option value="variable">自定义变量</Select.Option>
                        </Select>
                </div>);
            }
            },
            {
                title: '字段名称', dataIndex: 'variable', key: 'variable', width: '20%', render(text, record, index) {
                return (<div>
                    <Input type="text" defaultValue={record.variable} value={record.variable}
                           disabled={record.aType == 'variable' ? false : true}
                           onChange={(e) => {
                               _this.setKV(index + 1, record.aType, e.target.value, record.negation, record.rule, record.aValue);
                           }}
                    />
                </div>);
            }
            },
            {
                title: '取反', dataIndex: 'negation', key: 'negation', width: '5%', render(text, record, index) {
                return (
                    <Checkbox checked={record.negation}
                              onChange={(e) => {
                                  _this.setKV(index + 1, record.aType, record.variable, e.target.checked, record.rule, record.aValue);

                              }}
                    ></Checkbox>
                )
            }
            },
            {
                title: '校验规则', dataIndex: 'rule', key: 'rule', width: '10%', render(text, record, index) {
                return (
                    <Select
                        defaultValue={record.rule}
                        onChange={(e) => {
                            _this.setKV(index + 1, record.aType, record.variable, record.negation, e, record.aValue);
                        }}
                    >
                        <Select.Option value="equal">等于</Select.Option>
                        <Select.Option value="unequal">不等于</Select.Option>
                        <Select.Option value="greater">大于</Select.Option>
                        <Select.Option value="less">小于</Select.Option>
                        <Select.Option value="contain">包含</Select.Option>
                    </Select>);
            }
            },
            {
                title: '校验值', dataIndex: 'aValue', key: 'aValue', width: '20%', render(text, record, index) {
                return (
                    <Input
                        value={record.aValue}
                        onChange={(e) => {
                            _this.setKV(index + 1, record.aType, record.variable, record.negation, record.rule, e.target.value);
                        }}
                    >
                    </Input>
                )
            }
            },
            {
                title: '删除', dataIndex: 'op', key: 'op', render(text, record) {
                return (<div><Button type="dashed" size="small" icon="delete"
                                     onClick={_this.deleteKV.bind(_this, record.id)}
                ></Button></div>)
            }
            }
        ];
        let data = this.state.data;

        return (<div className="assertDiv kvdiv">
            <Table columns={columns} data={data}
                   rowKey={record => record.id}
                   title={currentData => <div>
                       <Button type="dashed" icon="plus-circle"
                               size="small"
                               onClick={this.addKV.bind(this, currentData)}></Button>
                   </div>}
                   components={{
                       body: {wrapper: AnimateBody},
                   }}
            />
        </div>);
    }
}