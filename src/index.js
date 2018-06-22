import React, {Component} from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
//import {Button, ButtonGroup} from 'react-bootstrap';

import ReactDOM from 'react-dom';
import Suit from './container/suit/Suit'
import SuitCase from './container/suitCase/SuitCase'
import About from './container/about/About'
import Home from './container/home/Home';
import './index.css';
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import {Affix,Button} from "antd";
import 'antd/dist/antd.css';
import "antd/lib/style/themes/default.less"
import './index.less'
import SuitParam from "./container/suitParam/SuitParam";
ReactDOM.render(
    <div>
        <Router>
            <div>
                <div className="content">
                    <div className="header">
                        <Navbar fixedTop inverse fluid>
                            <Navbar.Header>
                                <Navbar.Brand>
                                    <a href="/home">React-Bootstrap</a>
                                </Navbar.Brand>
                            </Navbar.Header>
                            <Nav>
                                <NavItem eventKey={1} href="#">
                                    Link
                                </NavItem>
                            </Nav>
                        </Navbar>
                    </div>
                    <div className="body">
                        <div className="left-div">
                            <Link className="menu" to="/home"><span className="glyphicon glyphicon-home"></span>Dashboard</Link>
                            <Link className="menu" to="/suit"><span className="glyphicon glyphicon-film"></span>Suit</Link>
                            <Link className="menu" to="/about"><span className="glyphicon glyphicon-modal-window"></span>Demo1</Link>
                            <Link className="menu" to="/about"><span className="glyphicon glyphicon-modal-window"></span>Demo2</Link>
                            <Link className="menu" to="/about"><span className="glyphicon glyphicon-cog"></span>Setting</Link>
                            <Link className="menu" to="/params/79"><span className="glyphicon glyphicon-modal-window"></span>Params</Link>
                        </div>
                        <div className="right-div">
                            <Switch>
                                <Route path="/home" component={Home}/>
                                <Route isExact path="/suit" component={Suit}/>
                                <Route path="/about" component={About}/>
                                <Route path="/suitcase/:id" component={SuitCase}/>
                                <Route path="/params/:id" component={SuitParam} />
                            </Switch>
                        </div>
                    </div>
                </div>

            </div>
        </Router>
    </div>
    ,
    document.getElementById('root')
);
