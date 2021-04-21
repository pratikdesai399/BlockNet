import React, { Component } from 'react';
import Identicon from 'identicon.js';
import photo from '../photo.png'
import { withRouter } from 'react-router-dom';

class Navbar extends Component {


  logout(e) {
    e.preventDefault();
    this.props.state(null)
    this.props.history.push("/login");
  }

  openProfile(e) {
    e.preventDefault();
    if(this.state.profileView === false) {
      this.setState({
        profileView: true
      })
      this.props.history.push("/profile");
    }
  }

  openDashboard(e) {
    e.preventDefault();
    this.setState({
      profileView: false
    })
    this.props.history.push("/dashboard");
  }

  constructor(props) {
    super(props);
    this.state = {
      profileView: false
    }
    this.logout = this.logout.bind(this);
    this.openProfile = this.openProfile.bind(this);
    this.openDashboard = this.openDashboard.bind(this);
  }


  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={photo} width="30" height="30" className="d-inline-block align-top" alt="" />
         BlockNet
        </a>
        <ul className="navbar-nav px-3">
          {
            this.state.profileView && (
            <li>
              <a href="#" onClick={this.openDashboard}>Dashboard</a>
            </li>
            )
          }
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="account" onClick={this.openProfile}>{this.props.account}</small>
            </small>
            { this.props.account
              ? <img
                className='ml-2'
                width='30'
                height='30'
                src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
              />
              : <span></span>
            }
          </li>
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <a href="#" onClick={this.logout}>Log Out</a>
          </li>
        </ul>
      </nav>
    );
  }
}

export default withRouter(Navbar);