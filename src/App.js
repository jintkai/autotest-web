import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
//import { Router, Route,Link,hashHistory } from 'react-router';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

const About = React.createClass({
    render() {
        return <h3>About</h3>
    }
})

const Inbox = React.createClass({
    render() {
        return (
            <div>
                <h2>Inbox</h2>
                {this.props.children || "Welcome to your Inbox"}
            </div>
        )
    }
})



class App extends Component {

  render() {
    return (
        <Router>
            <div>
                <ul>
                    <li><Link to="/home">首页</Link></li>
                    <li><Link to="/other">其他页</Link></li>
                </ul>
            </div>
        </Router>


    );
  }
}

export default App;
