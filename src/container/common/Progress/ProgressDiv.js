import React,{Component} from 'react';
import {ProgressBar} from 'react-bootstrap';

export default class ProgressDiv extends Component{

    constructor(props){
        super(props);
        this.state={
            height:props.height,
            width:props.width,
            pro:props.pro,
            type:props.type
        };
    }
    render(){
        return (<div className="ProgressDiv">
            <ProgressBar bsStyle={this.state.type} style={{height:this.state.height,width:this.state.width,marginBottom:"0px"}} now={this.state.pro}/>
        </div>);
    }
}