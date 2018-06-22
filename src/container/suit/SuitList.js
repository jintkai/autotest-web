import React, {Component} from 'react'
import {Table} from 'react-bootstrap'
import {Link, Router} from 'react-router'
import SuitTable from './SuitTable'

export default class SuitList extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            'suitlist': [],
            refresh: false
        });
        this.getSuitList();
        console.log("SuitList->constructor");
    }

    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps", nextProps.refresh);
        if (nextProps.refresh == true) {
            this.setState({
                refresh:true
            });
        }
    }

    getSuitList() {
        var _this = this;
        fetch("/api/suit/", {
            method: "GET"
        }).then(function (req) {
            if (req.ok) {
                req.json().then(function (result) {
                    if (result.code == 200) {
                        _this.setState(
                            {
                                suitlist: result.data
                            }
                        )
                    }

                });
            }
        })
    }

    render() {
        return (
            <div className="suitlist">
                <SuitTable refresh={this.state.refresh}/>
            </div>
        );
    }
}