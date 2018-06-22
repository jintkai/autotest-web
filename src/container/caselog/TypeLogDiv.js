import React, {Component} from 'react';
import {Collapse, Table,Icon} from 'antd';

export default class TypeLogDiv extends Component {

    constructor(props) {
        super(props);

        this.state = {data: [],title:props.title};
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data==""?[]:nextProps.data
        });
    }

    render() {

        const customPanelStyle = {
            background: '#D6EBCD',
            borderRadius: 4,
            marginBottom: 24,
            border: 0,
            overflow: 'hidden',
        };

        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: '用例名称',
            dataIndex: 'casename',
            key: 'casename',
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (text, record, index) => {
                return ( text === 1?(<Icon type="check-circle" className="text-success" />):(<Icon type="close-circle" className="text-danger" />));
            }

        }];
        let tabledata = [];
        tabledata = this.state.data.map(function (item) {
            return {
                id: item.suitcaseid,
                casename: item.casename,
                status: item.status
            };
        });

        return (<div>
            <Collapse bordered={true}>
                <Collapse.Panel header={this.state.title} key="1" style={customPanelStyle}>
                    <Table size="small" dataSource={tabledata} columns={columns}
                           onRow={(record) => {
                               return {
                                   onDoubleClick: () => {
                                       console.log(record.id, record.casename);
                                   }
                               }
                           }}
                    />
                </Collapse.Panel>
            </Collapse>
        </div>);
    }
}