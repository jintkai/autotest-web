import React, {Component} from 'react';
import Table from 'rc-table';
import {FormControl, FormGroup, Checkbox} from 'react-bootstrap';
import './kv.css';
import {Button,AutoComplete} from 'antd';

export default class KVDiv extends Component {

    constructor(props) {
        super(props);
        this.state = ({
            data: props.data,
            show: props.show,
            type:props.type
        })
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            data: nextProps.data,
            show: nextProps.show
        })
    }

    addKV(currentData) {
        let data = this.state.data;
        let tmp = {
            id: currentData.length + 1,
            pkey: '',
            pvalue: ''
        }

        data.push(tmp);
        this.setState({
            data: data
        });
    }

    setKV(id, key, value, description) {
        let data = this.state.data;
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === id) {
                data[i].pkey = key;
                data[i].pvalue = value;
                data[i].description = description;
                break;
            }
        }
        this.setState({
            data: data
        });
    }

    deleteKV(id) {
        let data = [];

        this.state.data.forEach(function (temp) {
            if (temp.id !== id) {
                data.push(temp);
            }
        });
        let data2 = [];
        for (let i = 0; i < data.length; i++) {
            let temp = {
                id: i + 1,
                pvalue: data[i].pvalue,
                pkey: data[i].pkey
            };
            data2.push(temp);
        }
        this.setState({
            data: data2
        }, function () {
            this.dataCallBack();
        });

    }

    validationState(record) {
        let data = this.state.data;
        for (let i = 0; i < data.length; i++) {
            if (record.pkey == '' || record.pvalue == '') {
                return 'error';
            }
            if (data[i].pkey == record.pkey && data[i].id != record.id) {
                return 'error';
            }
        }
        return null;
    }

    dataCallBack() {
        this.props.dataCallBack(this.state.data);
    }

    render() {

        var _this = this;
        let columns = [
            {title: 'ID', dataIndex: 'id', key: 'id', width: '3%'},
            {
                title: 'Key', dataIndex: 'pkey', key: 'pkey', width: '30%', render(text, record, index) {
                return (
                    <FormGroup validationState={_this.validationState(record)} style={{width: '100%'}}>
                        <AutoComplete
                            filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                            dataSource={_this.state.type ==='header'?['Connection', 'Content-Type', 'Content-Encoding','Server']:[]}
                            placeholder="Key"
                            value={record.pkey}
                            onChange={(e) => {
                                _this.setKV(index + 1, e, record.pvalue, record.description);
                                _this.dataCallBack();

                            }}
                        />
                    </FormGroup>)
            }
            },
            {
                title: 'Value', dataIndex: 'pvalue', key: 'pvalue', width: '35%', render(text, record, index) {
                return (
                    <FormGroup validationState={_this.validationState(record)} style={{width: '100%'}}>

                        <FormControl type="text" value={record.pvalue} style={{width: '100%'}} placeholder="Value"

                                     onChange={(e) => {
                                         _this.setKV(index + 1, record.pkey, e.target.value, record.description);
                                         _this.dataCallBack();

                                     }}
                        />
                    </FormGroup>
                )
            }
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
                width: '30%',
                render(text, record, index) {
                    return (
                        <FormGroup>
                            <FormControl type="text" value={record.description} style={{width: '100%'}}
                                         onChange={(e) => {
                                             _this.setKV(index + 1, record.pkey, record.pvalue, e.target.value);
                                             _this.dataCallBack();
                                         }}
                                         placeholder="Description"/>
                        </FormGroup>)
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
        let data = [];
        data = this.state.data;
        let bodyDiv = "";
        if (this.state.show === true) {
            bodyDiv = (
                <div>
                    <Table columns={columns} data={data}
                           rowKey={record => record.id}
                           title={currentData =>
                               <div>
                                   <Button type="dashed" icon="plus-circle"
                                           size="small"
                                           onClick={this.addKV.bind(this, currentData)}></Button>
                               </div>}
                    />
                </div>
            );
        }

        return (<div className="kvdiv">
            {bodyDiv}
        </div>);


    }
}
