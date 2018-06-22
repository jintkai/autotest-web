import React, {Component} from 'react';
//import {FormGroup, ControlLabel, FormControl, Col, Checkbox, InputGroup} from 'react-bootstrap';
import {DatePicker, TimePicker, Icon, Button, Form, Input, Modal, message, Switch} from 'antd';

import moment from 'moment';


export default class SuitDialog extends Component {

    constructor(props) {
        super(props);
        this.state = ({
            show: props.show,
            suitid: props.suitid,
            suitname: {value: props.suitname},
            lastbuildid: props.lastbuildid,
            status: props.status,
            cycletime: {},
            email: false
        });
    }

    error = (msg) => {
        message.config({
            top: 80
        });
        message.warning(msg, 5);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            show: nextProps.show,
            operate: nextProps.operate
        });
        if (nextProps.operate === 2) {
            this.getSuit(nextProps.suitid);
        } else if (nextProps.operate === 1) {
            this.setState({
                suitname: {value: ""},
                lastbuildid: 0,
                status: 0,
                email: false
            });
        }

    }

    validateSuitName(suitname) {
        if (suitname === "") {
            return {
                validateStatus: 'error',
                errorMsg: '套件名称不允许为空!',
            };
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    }

    getSuit(id) {
        let _this = this;
        const url = "/api/suit/selectById?suitid=" + id;
        fetch(url).then(function (res) {
                if (res.ok) {
                    res.json().then(function (json) {
                        if (json.code === 200) {
                            _this.setState({
                                    suitid: id,
                                    suitname: {value: json.data.suitname},
                                    lastbuildid: json.data.lastbuildid,
                                    status: json.data.status,
                                    email: json.data.email,
                                    cycletime:{
                                        checked: json.data.cycletime !=null?true:false,
                                        value:json.data.cycletime
                                    }
                                }
                                ,
                                function () {
                                    console.log("email:", this.state.email);
                                }
                            );

                        }
                    })
                }
            }
        )
        ;
    }

    saveSuit() {
        var _this = this;
        let url;

        let params = new URLSearchParams();

        if (this.state.suitname.value === "") {
            this.error("套件名称不允许为空！");
            return;
        }
        if (this.state.operate === 1) {
            url = "/api/suit/add";
        }
        if (this.state.operate === 2) {
            url = "/api/suit/update";
            params.set("suitid", this.state.suitid);

        }

        params.set("suitname", this.state.suitname.value);
        params.set("suitname", this.state.suitname.value);
        params.set("email", this.state.email);
        if(this.state.cycletime.value!=null){
            params.set("cycletime",this.state.cycletime.value);

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
                        _this.error(json.msg);
                    } else {
                        _this.setState({
                            show: false
                        }, function () {
                        });
                        _this.props.callback();
                    }
                })
            }
        })

    }

    setTimer(checked) {

        this.setState({
            cycletime: {
                checked: checked,
                value: this.state.cycletime.value
            }
        })
    }

    setEmail(checked) {
        this.setState({
            email: checked
        });
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

        let suitIdForm = this.state.operate == 2 ? (
            <Form.Item
                label="ID"
                {...formItemLayout}
            >
                <Input value={this.state.suitid} disabled={true}/>
            </Form.Item>
        ) : "";

        let timerForm = this.state.cycletime.checked === true ? (
            <TimePicker showTime={true}
                        format="HH:mm:ss"
                        defaultValue={moment(this.state.cycletime.value != null? this.state.cycletime.value:'00:00:00',"HH:mm:ss")}
                        onChange={(value, dateString) => {
                            this.setState({cycletime: {checked: true, value: dateString}});
                        }}
                        validateStatus="error"
                        hasFeedback={true}
                        onOk={(value) => {
                            console.log("ok", value);
                        }}/>
        ) : "";

        return (
            <div className="suitdialog">
                <Modal
                    title={this.state.operate === 1 ? "增加套件" : "编辑套件"}
                    visible={this.state.show}
                    show={this.state.show}
                    onOk={() => {
                        let suit = {
                            suitid: this.state.suitid,
                            suitname: this.state.suitname.value
                        };
                        this.saveSuit(suit);
                    }}
                    onCancel={() => {
                        this.setState({
                            show: false
                        });
                        this.props.callback();

                    }}

                >
                    <Form>
                        {suitIdForm}
                        <Form.Item
                            {...formItemLayout}
                            required={true}
                            mix={1}
                            label="套件名称："
                            hasFeedback={true}
                            validateStatus={this.state.suitname.validateStatus}
                            help={this.state.suitname.errorMsg || ""}
                        >

                            <Input value={this.state.suitname.value}
                                   onChange={(e) => {
                                       this.setState({
                                           suitname: {
                                               value: e.target.value,
                                               ...this.validateSuitName(e.target.value)
                                           }
                                       })
                                       ;
                                   }}/>

                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="定时执行"
                        >
                            <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked={this.state.cycletime.checked}
                                    onChange={this.setTimer.bind(this)}/>
                            {timerForm}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="邮件通知">
                            <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked={this.state.email}
                                    onChange={this.setEmail.bind(this)}/>
                        </Form.Item>
                    </Form>
                </Modal>

            </div>
        );
    }
}