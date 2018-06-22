import React, {Component} from 'react';
import {Grid, Row, Col, Well} from 'react-bootstrap';

export default class InfoPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {option: props.option};
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            option: nextProps.option
        });
    }

    onMouserOver() {
        let tempColor;
        let option = this.state.option;
        tempColor = option.backColor;
        option.backColor = option.fontColor;
        option.fontColor = tempColor;
        if (option.show === 'A') {
            option.show = 'B';
        } else {
            option.show = 'A';
        }
        this.setState({
            option: option
        });
    }

    render() {
        return (
            <div className="infoPanel"
                 style={{background: this.state.option.backColor, color: this.state.option.fontColor}}
                 onMouseEnter={
                     this.onMouserOver.bind(this)
                 }
                 onMouseLeave={
                     this.onMouserOver.bind(this)
                 }>
                <div>
                    <div className="left">
                        <span className={this.state.option.ico}></span>
                        <span style={{paddingLeft: '10px'}}>|</span>
                    </div>
                    <div className="right">
                        <h5>{this.state.option.show === 'A' ? this.state.option.dataA : this.state.option.dataB}</h5>
                        <h6>{this.state.option.show === 'A' ? this.state.option.showA : this.state.option.showB}</h6>
                    </div>
                </div>
            </div>);
    }
}