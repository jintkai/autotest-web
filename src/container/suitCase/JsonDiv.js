import React, {Component} from 'react';
import {FormControl, Button, Form, Col} from 'react-bootstrap';
import ReactJson from 'react-json-view'

export default class JsonDiv extends Component {

    constructor(props) {
        super(props);
        this.state = ({
            show: props.show,
            src: props.data,
            jsonsrc: {}
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            show: nextProps.show,
            src: nextProps.data,
        });
    }

    render() {
        let _this = this;
        if (this.state.show === true) {
            return (
                <div className="jsonDiv">
                    <Form>
                        <FormControl componentClass="textarea" value={this.state.src} style={{width: "100%"}}
                                     onChange={(e) => {
                                         this.setState({
                                             src: e.target.value
                                         }, function () {
                                             _this.props.dataCallBack(this.state.src);
                                         });
                                         try {
                                             this.setState({
                                                 jsonsrc: JSON.parse(e.target.value)
                                             });
                                         } catch (e) {

                                             this.setState({
                                                 jsonsrc: {}
                                             })
                                         }
                                     }}
                        />
                    </Form>
                    <ReactJson src={this.state.jsonsrc} name={false} displayObjectSize={false}
                               displayDataTypes={false}/>
                </div>);
        }
        else {
            return <div></div>;
        }


    }
}