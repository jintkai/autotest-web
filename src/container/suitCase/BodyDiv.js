import React, {Component} from 'react';
import {Form, FormGroup, FormControl, Radio} from 'react-bootstrap';
import JsonDiv from './JsonDiv'
import KVDiv from "./KVDiv";

export default class BodyDiv extends Component {
    constructor(props) {
        super(props);
        console.log("props.data",props.data.type,props.data.body);
        if (props.data.type === 1) {
            this.state = ({
                type: props.data.type,
                kvBody: props.data.body,
                jsonBody: ""
            });
        } else if (props.data.type === 2) {
            this.state = ({
                type: props.data.type,
                kvBody: [],
                jsonBody: JSON.stringify(props.data.body)
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log("Body.div", nextProps.data);
        let temp = nextProps.data;
        if (temp.type === 1) {
            this.setState({
                type: temp.type,
                kvBody: temp.body,
                jsonBody: ""
            });
        }

        if (temp.type === 2) {
            this.setState({
                type: temp.type,
                kvBody: [],
                jsonBody: JSON.stringify(temp.body)
            })
        }
    }

    render() {

        return (<div className='bodydiv'>
            <Form>
                <FormGroup>
                    <Radio name="radioGroup" value={1} checked={this.state.type === 1 ? true : false} onChange={() => {
                        this.setState({type: 1});
                    }} inline>
                        form-data
                    </Radio>{' '}
                    <Radio name="radioGroup" value={2} checked={this.state.type === 2 ? true : false} onChange={() => {
                        this.setState({type: 2});
                    }} inline>
                        json-data
                    </Radio>{' '}
                    <Radio name="radioGroup" value={3} checked={this.state.type === 3 ? true : false} onChange={() => {
                        this.setState({type: 3});
                    }} inline>
                        form-urlencoded
                    </Radio>

                </FormGroup>
            </Form>

            <KVDiv type="body" show={this.state.type === 1 ? true : false} data={this.state.kvBody} dataCallBack={(data) => {
                this.setState({
                    kvBody: data
                }, function () {
                    this.props.dataCallBack(this.state.kvBody, this.state.jsonBody, this.state.type);
                });
            }}/>

            <JsonDiv width={"100%"} show={this.state.type === 2 ? true : false} data={this.state.jsonBody}
                     dataCallBack={(data) => {
                         this.setState({
                             jsonBody: data
                         }, function () {
                             this.props.dataCallBack(this.state.kvBody, this.state.jsonBody, this.state.type);
                         });
                     }}/>


        </div>);
    }
}