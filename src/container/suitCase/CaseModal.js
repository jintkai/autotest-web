import React, {Component} from 'react'
import KVDiv from './KVDiv';
import BodyDiv from './BodyDiv';
import CaseList from './CaseList';
import {Modal, Button, Form, Input, InputNumber, Select, Radio} from 'antd';
import {Badge, Tabs, Icon, Row, Col, message, Alert} from 'antd';
import AssertDiv from "./AssertDiv";
import ParamTable from "../suitParam/ParamTable";

let initProps;
export default class CaseModal extends Component {

    constructor(props) {
        super(props);
        console.log("CaseModal->constructor");
        this.state = ({
            show: props.show,
            operate: props.operate,
            suitid: props.suitid,
            header: [],
            // requestHeader: '',
            methodType: 1,
            casename: {value: ""},
            caseurl: {value: ""},
            requestBody: {type:1,body:[]},
            assertExp: [],
            assertExpStr: '',
            order: 0,
            caseid: 0,
            caseType: 'MAIN',
            mainCase: '',
            showList: false,
            mainCaseName: '',
            preParams:[],
            postParams:[]
        });
    }

    initState() {
        initProps = {
            suitid: 0,
            header: [],
            //requestHeader: '',
            methodType: 1,
            casename: {value: ""},
            caseurl: {value: ""},
            requestBody: {type:1,body:[]},
            assertExp: [],
            assertExpStr: '',
            order: 1,
            caseid: 0,
            caseType: 'MAIN',
            mainCase: '',
            showList: false,
            mainCaseName: ''
        }
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.operate === 2) {
            this.setState({
                suitcaseid: nextProps.suitcaseid,
                show: nextProps.show,
                operate: nextProps.operate,
                suitid: nextProps.suitid
            })
            this.getCase(nextProps.suitcaseid);
        } else if (nextProps.operate === 1) {
            this.initState();
            this.setState({
                ...initProps
            })
        }


        this.setState({
            show: nextProps.show,
            operate: nextProps.operate,
            suitid: nextProps.suitid,
        });
    }

    getCase(id) {
        var _this = this;
        fetch("/api/suitcase/getByid", {
            method: 'POST',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: "id=" + id
        }).then(function (res) {
            if (res.ok) {
                res.json().then(function (result) {
                    if (result.code == 200) {
                        _this.setState({
                            id: result.data.id,
                            caseid: result.data.caseid,
                            suitid: result.data.suitid,
                            casename: {value: result.data.casename},
                            caseurl: {value: result.data.requesturl},
                            order: result.data.requestorder,
                            methodType: result.data.requesttype,
                            requestBody: result.data.requestbody == "" ? {} : JSON.parse(result.data.requestbody),
                            assertExpStr: result.data.assertexp,
                            caseType: result.data.caseType,
                            mainCase: result.data.mainCaseid != null ? result.data.mainCaseid : ""
                        });

                        if (_this.state.mainCase != "MAIN") {
                            _this.getMainCase(_this.state.mainCase);
                        }
                        if (result.data.requestheader === "") {
                            _this.setState({header: []});
                        } else {
                            let jsonObject = JSON.parse(result.data.requestheader);
                            _this.setState({
                                header: jsonObject
                            });
                        }
                        if (result.data.assertexp === "") {
                            _this.setState({assertExp: []});
                        } else {
                            let jsonObject = JSON.parse(result.data.assertexp);
                            _this.setState({
                                assertExp: jsonObject
                            });
                        }


                    }
                })
            }
        })
    }

    getMainCase(id) {
        var _this = this;
        fetch("/api/suitcase/getByid", {
            method: 'POST',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: "id=" + id
        }).then(function (res) {
            if (res.ok) {
                res.json().then(function (result) {
                    if (result.code == 200) {
                        _this.setState({
                            mainCaseName: result.data.casename,
                            mainCase: result.data.mainCaseid != null ? result.data.mainCaseid : ""
                        });
                    }
                })
            }
        })
    }

    saveCase() {
        var _this = this;
        let top = 80;
        let cancel = false;
        if (this.state.caseurl.validateStatus == null || this.state.caseurl.validateStatus == "success" || this.state.caseurl.validateStatus == "") {
            if (this.state.caseurl.value == "") {
                this.error("请求地址不允许为空！", top);
                top = top + 50;
                cancel = true
            }
        } else {
            this.error(this.state.caseurl.errorMsg, top);
            top = top + 50;
            cancel = true
        }

        if (this.state.casename.value == "") {
            this.error("用例名称不允许为空！", top);
            top = top + 50;
            cancel = true
        }
        if (this.state.caseType != "MAIN" && this.state.mainCase === "") {
            this.error("请选择主请求！", top);
            top = top + 50;
            cancel = true
        }
        if (cancel) {
            return;
        }


        var searchParams = new URLSearchParams()
        searchParams.set('suitid', this.state.suitid);
        searchParams.set('casename', this.state.casename.value);
        searchParams.set('requesturl', this.state.caseurl.value);
        searchParams.set('requesttype', this.state.methodType);
        searchParams.set('requestheader', JSON.stringify(this.state.header));
        searchParams.set('requestbody', JSON.stringify(this.state.requestBody));
        searchParams.set('assertexp', this.state.assertExpStr);
        searchParams.set('requestorder', this.state.order);
        searchParams.set("caseid", this.state.caseid);
        searchParams.set("caseType", this.state.caseType);
        if (this.state.caseType != "MAIN") {
            alert(this.state.mainCase);
            if (this.state.mainCase === "") {
                console.log("主请求不能为空！");
                return;
            }
            searchParams.set("mainCase", this.state.mainCase);

        }
        else
            searchParams.set("mainCase", "");


        var url;
        if (this.state.operate == 1) {
            url = "/api/suitcase/insert";
        } else {
            url = "/api/suitcase/update";
            searchParams.set("id", this.state.id);
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: searchParams
        }).then(function (res) {
            if (res.ok) {
                res.json().then(function (result) {
                    if (result.code == 200) {
                        _this.props.callBack();
                        _this.props.closeCase();
                        _this.setState({
                            show: false
                        });
                    } else {
                        alert("更新失败!")
                    }

                })
            } else {
                alert("请求失败!")
            }
        })
    }


    handleHide() {
        this.setState({
            show: false
        }, function () {
            this.props.closeCase();
        });
    }

    validateSuitName(v) {
        if (v === "") {
            return {
                validateStatus: "error",
                errorMsg: "用例名称不允许为空!"
            }
        } else {
            return {
                validateStatus: "success",
                errorMsg: null
            }
        }
    }

    validateCaseUrl(v) {
        let temp = v.toLowerCase();
        if (v === "") {
            return {
                validateStatus: "error",
                errorMsg: "请求地址不能为空!"
            }
        } else if (temp.indexOf("http://") != 0 && temp.indexOf("https://") != 0) {
            return {
                validateStatus: "error",
                errorMsg: "请求地址必须以http://或https://开头！"
            }
        } else {
            return {
                validateStatus: "success",
                errorMsg: null
            }
        }
    }

    error = (msg, top) => {
        message.config({
            top: top
        });
        message.warning(msg, 5);
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 4},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 20},
                sm: {span: 20},
            },
        };

        let mainForm;
        if (this.state.caseType != "MAIN") {
            mainForm = (<Form.Item
                {...formItemLayout}
                label="主请求"
                required={true}
                validateStatus={this.state.mainCaseName === "" ? "error" : "success"}
                hasFeedback={true}
            >
                <Input placeholder="请选择主请求体..." disabled={true} style={{width: '80%'}} value={this.state.mainCaseName}/>
                <Button icon="retweet" style={{width: '20%'}} onClick={() => {
                    this.setState({
                        showList: true
                    });
                }}>选择</Button>
            </Form.Item>);
        } else {
            mainForm = "";
        }

        let jsonDiv=(
            <BodyDiv style={{width: '100%'}} data={this.state.requestBody}
                     dataCallBack={(kvBody, jsonBody, type) => {
                         let temp;
                         if (type === 1) {
                             temp = {type: type, body: (kvBody)};
                         } else {
                             temp = {type: type, body: JSON.parse(jsonBody)};
                         }
                         this.setState({
                             requestBody: temp
                         });
                     }}/>
        );
        return (<div className='caseModal'>
            <Modal
                title={this.state.operate === 1 ? '增加用例' : '修改用例'}
                visible={this.state.show}
                onOk={this.saveCase.bind(this)}
                width={'55%'}
                onCancel={this.handleHide.bind(this)}>
                <Form>
                    <Form.Item
                        {...formItemLayout}
                        label="用例名称"
                        required={true}
                        hasFeedback={true}
                        validateStatus={this.state.casename.validateStatus}
                        help={this.state.casename.errorMsg}
                    >
                        <Input value={this.state.casename.value} onChange={(e) => {
                            this.setState({
                                casename: {
                                    value: e.target.value,
                                    ...this.validateSuitName(e.target.value)
                                }
                            });
                        }}/>
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label={"请求类型"}
                    >
                        <Radio.Group defaultValue={this.state.caseType} value={this.state.caseType} onChange={(e) => {
                            this.setState({caseType: e.target.value});
                        }}>
                            <Radio.Button value={"PREFIX"}>前置请求</Radio.Button>
                            <Radio.Button value={"MAIN"}>主请求</Radio.Button>
                            <Radio.Button value={"POSTFIX"}>后置请求</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    {mainForm}
                    <Form.Item
                        {...formItemLayout}
                        validateStatus={this.state.caseurl.validateStatus}
                        required={true}
                        help={this.state.caseurl.errorMsg}
                        label="地址">
                        <Input.Group compact>
                            <Select style={{width: '20%'}} defaultValue={this.state.methodType} onChange={(value) => {
                                this.setState({methodType: value});
                            }}>
                                <Select.Option value={1}>GET</Select.Option>
                                <Select.Option value={2}>POST</Select.Option>
                                <Select.Option value={3}>PUT</Select.Option>
                                <Select.Option value={4}>DELETE</Select.Option>
                            </Select>
                            <Input style={{width: '80%'}} value={this.state.caseurl.value}
                                   onChange={(e) => {
                                       this.setState({
                                           caseurl: {
                                               value: e.target.value,
                                               ...this.validateCaseUrl(e.target.value === null ? "" : e.target.value)
                                           }
                                       })
                                   }}/>
                        </Input.Group>

                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label="顺序">
                        <InputNumber defaultValue={1} mix={0} value={this.state.order} onChange={(e) => {
                            this.setState({order: e});
                        }}/>
                    </Form.Item>
                    <Row>
                        <Col span={24}>
                            <Tabs id="casedetail" defaultActiveKey={"1"}>
                                <Tabs.TabPane
                                tab={<Badge count={this.state.preParams.length} offset={[-4,10]} style={{backgroundColor: '#52c41a'}}>
                                    <span>前置变量</span>
                                </Badge>} key={4}>
                                    <ParamTable
                                        data={this.state.preParams}
                                        callBack={(data)=>{
                                            console.log(data);
                                        this.setState({
                                            preParams:data
                                        });
                                    }}/>
                                </Tabs.TabPane>
                                <Tabs.TabPane
                                    tab={<Badge count={this.state.header.length} offset={[-4, 10]}
                                                style={{backgroundColor: '#52c41a'}}><span><Icon
                                        type="info-circle"/>请求头</span></Badge>} key={1}>
                                    <KVDiv type="header" show={true} data={this.state.header} dataCallBack={(data) => {
                                        this.setState({
                                            header: data
                                        });
                                    }}/>
                                </Tabs.TabPane>
                                <Tabs.TabPane tab={<Badge
                                    count={this.state.requestBody.type === 2 ? 'json' :this.state.requestBody.body === ""?'0':this.state.requestBody.body.length}
                                    offset={[-4, 10]}
                                    style={{backgroundColor: '#52c41a'}}><span><Icon
                                    type="check-circle"/>请求体</span></Badge>}
                                              key={2}>
                                    {jsonDiv}
                                </Tabs.TabPane>
                                <Tabs.TabPane
                                    tab={<Badge count={this.state.postParams.length} offset={[-4,10]} style={{backgroundColor: '#52c41a'}}>
                                        <span>后置变量</span>
                                    </Badge>} key={5}>
                                    <ParamTable
                                        data={this.state.postParams}
                                        callBack={(data)=>{
                                            this.setState({
                                                postParams:data
                                            });
                                        }}/>
                                </Tabs.TabPane>
                                <Tabs.TabPane tab={<Badge count={this.state.assertExp.length}
                                offset={[-4,10]}
                                style={{backgroundColor:'#52c41a'}}><span><Icon type="question-circle"/>断言</span></Badge>} key={3}>
                                    <AssertDiv style={{width: '50%'}} data={this.state.assertExp}
                                               dataCallBack={(data) => {
                                                   console.log("assertDiv",data);
                                                   this.setState({
                                                       assertExp: data,
                                                       assertExpStr: JSON.stringify(data)
                                                   });
                                               }}
                                    />
                                </Tabs.TabPane>
                            </Tabs>
                        </Col>
                    </Row>
                </Form>
            </Modal>


            <CaseList show={this.state.showList} caseid={this.state.suitcaseid} suitid={this.state.suitid}
                      callBackMainCase={(id, name) => {
                          if (id == null) {
                              this.setState({
                                  showList: false
                              });
                          } else
                              this.setState({
                                  mainCase: id,
                                  mainCaseName: name,
                                  showList: false
                              });
                      }}/>
        </div>)
            ;
    }
}