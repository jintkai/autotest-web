/**
 * Created by jon on 2017/4/15.
 */
import React,{Component} from 'react';
import {Alert,Modal,Button} from 'react-bootstrap';

class AlertDialog extends Component{

    constructor(props){
        super(props);
        this.state={"alertShow":this.props.alertShow};
    }
    state ={
        alertShow:this.props.alertShow
    }
    close(){
        this.setState({alertShow:false});
        this.props.callbackParent();
    }
    componentWillReceiveProps(nextProps){
        console.log("componentWillReceiveProps:"+nextProps.alertShow);
        this.setState({alertShow:this.props.alertShow});
    }

    render(){
        return (
        <Modal show={this.state.alertShow} onHide={this.close.bind(this)}  >
            <Modal.Header closeButton>
                <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Alert bsStyle="warning">
                <strong>{this.props.message}</strong>
                <h6>{this.props.detail}</h6>
            </Alert>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.close.bind(this)} bsStyle="warning">Close</Button>
            </Modal.Footer>
        </Modal>
        );
    }
}

export default AlertDialog;