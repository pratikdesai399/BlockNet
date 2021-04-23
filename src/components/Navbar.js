import React, { Component } from 'react';
import Identicon from 'identicon.js';
import photo from '../photo.png'
import { withRouter } from 'react-router-dom';
import {Nav,Navbar} from 'react-bootstrap';

class navbar extends Component {

  logout(e) {
    e.preventDefault();
    this.props.state(null)
    this.props.history.push("/login");
  }
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  render() {
    return (
      <Navbar bg="dark" expand="lg" variant="dark">
  <Navbar.Brand href="#"><img src={photo} width="30" height="30" className="d-inline-block align-top" alt="" />SOCIAL NETWORK</Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto justify-content-center">
      <Nav.Link href="#">
        {this.props.account}
        { this.props.account
              ? <img
                className='ml-2'
                width='30'
                height='30'
                src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
              />
              : <span></span>
            }
      </Nav.Link>
      </Nav>
      <Nav className="mr-auto justify-content-end">
      <Nav.Link href="#" onClick={this.logout}>Log Out</Nav.Link>
    </Nav>
  </Navbar.Collapse>
</Navbar>
    );
  }
}

export default withRouter(navbar);