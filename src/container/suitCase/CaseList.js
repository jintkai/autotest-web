import React, {Component} from 'react';
import {Modal, Table} from 'antd';
import './suitcase.css';

export default class CaseList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cases: [],
            suitcaseid: 0,
            suitid: props.suitid,
            show: props.show
        };
        //this.getCaseList(this.props.suitid);
    }

    componentWillReceiveProps(nextProps) {
        console.log("nextProps.show", nextProps.show);
        if (nextProps.show == true) {
            this.getCaseList(nextProps.suitid);
            this.setState({
                show: nextProps.show
            });
        }
    }

    getCaseList(suitid) {
        var _this = this;
        var req = "/api/suitcase/getMainCase/?suitID=" + this.props.suitid;
        var urlReq = new Request(req, {method: 'GET'})
        fetch(urlReq).then(function (response) {
            if (response.status != 200) {
                return;
            }
            response.json().then(function (result) {
                if (result.code != 200) {
                    return;
                }
                _this.setState({"cases": result.data});
            });
        });
    }


    handleShowCase() {

    }

    selectCase(id, casename) {
        console.log(id, casename);
        this.setState({
            show: false
        });
        this.props.callBackMainCase(id, casename);
    }


    render() {
        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            width:50
        }, {
            title: '用例名称',
            dataIndex: 'casename',
        }, {
            title: '请求地址',
            dataIndex: 'url',
        }];

        let data = []
        this.state.cases.map(function (item) {
            let temp = {id: item.id, casename: item.casename, url: item.requesturl};
            data.push(temp);
        });

        let _this = this;
        return (
            <div className="caselist">
                <Modal
                    width={'60%'}
                    visible={this.state.show}
                    footer={false}
                    onCancel={() => {
                        this.setState({
                            show: false
                        });
                        _this.props.callBackMainCase(null, null);
                    }}>
                    <Table
                        onRow={(record) => {
                            return {
                                onDoubleClick: () => {
                                    _this.selectCase(record.id, record.casename);
                                }
                            }
                        }}
                        columns={columns} dataSource={data} size="default"
                    />
                </Modal>
            </div>
        );
    }


}