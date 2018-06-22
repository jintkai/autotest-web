import React, {Component} from 'react'
import {Modal, Button, FormGroup, ControlLabel, Col, FormControl, Form, Radio} from 'react-bootstrap'

class SuitCaseModal extends Component {

    constructor(props) {
        super(props);
        console.log("props Begin" + this.props.show);
        this.state = (
            {
                show: this.props.show,
                suitid: this.props.suitid,
                casename: "",
                caseurl: "",
                methodType: "",
                requestHeader: "",
                requestBody: "",
                assertExp: "",
                methodType: 0,
                order: 0,
                id: 0,
                caseid: 0
            });

    }

    handleHide() {
        this.setState({show: false});
        this.props.onDialogCommit();
    }

    componentWillReceiveProps(nextProps) {
        //this.initParam();
        this.setState({
            show: nextProps.show,
            operate: nextProps.operate
        })
        if (nextProps.operate == 0) {
            this.searchCase(nextProps.caseid);
        }
    }

    searchCase(id) {
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
                        console.log(result);
                        _this.setState({
                            id: result.data.id,
                            caseid: result.data.caseid,
                            suitid: result.data.suitid,
                            casename: result.data.casename,
                            caseurl: result.data.requesturl,
                            order: result.data.requestorder,
                            methodType: result.data.requesttype,
                            requestHeader: result.data.requestheader,
                            requestBody: result.data.requestbody,
                            assertExp: result.data.assertexp
                        })
                    }
                })
            }
        })
    }

    initParam(){
        this.setState({
            casename: "",
            caseurl: "",
            order: 0,
            methodType: 0,
            requestHeader: "",
            requestBody: "",
            assertExp: ""
        })
    }
    saveCase() {
        var _this = this;
        if (this.state.caseurl == "" || this.state.casename == "") {
            alert("请填写完整信息!");
            return;
        }

        var searchParams = new URLSearchParams()
        searchParams.set('suitid', this.state.suitid);
        searchParams.set('casename', this.state.casename);
        searchParams.set('requesturl', this.state.caseurl);
        searchParams.set('requesttype', this.state.methodType);
        searchParams.set('requestheader', this.state.requestHeader);
        searchParams.set('requestbody', this.state.requestBody);
        searchParams.set('assertexp', this.state.assertExp);
        searchParams.set('requestOrder', this.state.order);
        searchParams.set("caseid", this.state.caseid)

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
                        _this.handleHide();
                    } else {
                        alert("更新失败!")
                        console.log(result);
                    }

                })
            } else {
                alert("请求失败!")
            }
        })
    }


    getValidationState(e) {
        if (e == "") {
            return "error";
        }
        return "success";
    }

    getOrderValidatitonState(e) {
        var reg = /^[0-9]*$/;
        if (!reg.test(e)) {
            return "error";
        } else {
            return "success";
        }
    }

    render() {
        return (
            <div className="casemodal">
                <Modal show={this.state.show} onHide={this.handleHide.bind(this)}>
                    <Modal.Header closeButton={true}>
                        <Modal.Title>{this.state.operate == 0 ? '编辑' : this.state.operate == 1 ? '增加' : '查看'}用例</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>

                            <FormGroup
                                controlId="formBasicText"
                                validationState={this.getValidationState(this.state.casename)}
                            >
                                <Col sm={2} componentClass={ControlLabel}>
                                    用例名称
                                </Col>
                                <Col sm={10}>
                                    <FormControl type='text' value={this.state.casename} placeholder='用例名称'
                                                 onChange={(e) => {
                                                     this.setState({
                                                         casename: e.target.value
                                                     })
                                                 }}/>
                                </Col>
                            </FormGroup>

                            <FormGroup controlId="caseurl"
                                       validationState={this.getValidationState(this.state.caseurl)}
                            >
                                <Col sm={2} componentClass={ControlLabel}>
                                    请求地址
                                </Col>
                                <Col sm={10}>
                                    <FormControl type='text' value={this.state.caseurl}
                                                 placeholder='http://127.0.0.1:8080'
                                                 onChange={(e) => {
                                                     this.setState({
                                                         caseurl: e.target.value
                                                     })
                                                 }}/>
                                </Col>
                            </FormGroup>

                            <FormGroup>
                                <Col sm={2} componentClass={ControlLabel}>方法类型</Col>
                                <Col sm={10}>
                                    <select value={this.state.methodType} onChange={(e) => {
                                        this.setState({
                                            methodType: e.target.value
                                        });
                                    }} className="form-control">
                                        <option value="0">GET</option>
                                        <option value="1">POST</option>
                                        <option value="2">PUT</option>
                                        <option value="3">DELETE</option>
                                    </select>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col sm={2} componentClass={ControlLabel}>请求头</Col>
                                <Col sm={10}>
                                    <FormControl componentClass="textarea" placeholder="textarea"
                                                 value={this.state.requestHeader}
                                                 onChange={(e) => {
                                                     this.setState({
                                                         requestHeader: e.target.value
                                                     })
                                                 }}/>
                                </Col>
                            </FormGroup>

                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={2}>请求体</Col>
                                <Col sm={10}>
                                    <FormControl componentClass="textarea" value={this.state.requestBody}
                                                 onChange={(e) => {
                                                     this.setState({
                                                         requestBody: e.target.value
                                                     })
                                                 }}/>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={2}>断言</Col>
                                <Col sm={10}>
                                    <FormControl componentClass="textarea" value={this.state.assertExp}
                                                 onChange={(e) => {
                                                     this.setState({
                                                         assertExp: e.target.value
                                                     })
                                                 }}
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup validationState={this.getOrderValidatitonState(this.state.order)}>
                                <Col componentClass={ControlLabel} sm={2}>顺序</Col>
                                <Col sm={2}>
                                    <FormControl type="text" value={this.state.order} onChange={(e) => {
                                        this.setState({
                                            order: e.target.value
                                        })
                                    }}/>
                                </Col>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="btn btn-danger" onClick={this.saveCase.bind(this)}><span
                            className="glyphicon glyphicon-floppy-saved"></span>保存</Button>
                        <Button className="btn btn-primary" onClick={this.handleHide.bind(this)}>取消</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default SuitCaseModal;