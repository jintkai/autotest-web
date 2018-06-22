import React, {Component} from 'react';
import {Table,Button,Icon} from 'antd';

export default class SuitParam extends Component {
    constructor(props) {
        super(props);

        this.state = ({
            paramList: [],
            suitid: props.match.params.id
        });
        this.getSuitParams(props.match.params.id);

    }

    getSuitParams(id) {
        var _this = this;
        fetch("/api/variable/suitID?id=" + id, {
            method: "GET",
            header: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        }).then(function (res) {
            if (res.ok) {
                res.json().then(function (json) {
                    if (json.code == 200) {
                        _this.setState({
                            paramList: json.data
                        });
                    }
                })
            }
        });
    }

    render() {

        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        }, {
            title: '全局',
            dataIndex: 'global',
            key: 'global'
        }, {
            title: '用例ID',
            dataIndex: 'caseid',
            key: 'caseid'
        }, {
            title: '变量类型',
            dataIndex: 'paramType',
            key: 'paramType'
        }, {
            title: '变量名',
            dataIndex: 'paramName',
            key: 'paramName'
        },
            , {
                title: '取值方法',
                dataIndex: 'methodType',
                key: 'methodType'
            }
            , {
                title: '取值参数',
                dataIndex: 'methodParam',
                key: 'methodParam'
            }, {
                title: '操作',
                dataIndex: 'operation',
                render:(text,record)=>{
                    return (<div><Button icon="edit" size="small">修改</Button><Button type="danger" icon="close-circle" size="small">删除</Button></div>);
                }
            }
        ];

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

        let list = this.state.paramList.map(function (item) {
            return (
                <tr>
                    <td>{item.variableid}</td>
                    <td>{item.name}</td>
                    <td>{item.varExpress}</td>
                </tr>
            );
        })
        return (<div className="suitparam">
            <Table columns={columns} dataSource={dataSource}/>
        </div>);
    }
}