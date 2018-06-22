import React, {Component} from 'react';
import SuitList from "./SuitList";
import SuitTable from "./SuitTable";
import {Button} from 'react-bootstrap';
import {Alert,Spin} from 'antd';
class Suit extends Component {

    constructor(props) {
        super(props);
        this.state = ({
            showSuit: false,
            refresh: false
        });
    }



    render() {
        return (
            <div className="component-suit">
                <div className="homeTop">Suit</div>
                <SuitTable />
            </div>
        );
    }

}

export default Suit;