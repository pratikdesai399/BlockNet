import React, { Component } from 'react';
import Identicon from 'identicon.js';
import photo from '../photo.png'
import { withRouter } from 'react-router-dom';
<<<<<<< HEAD
import { Navbar as BNavbar, Nav, NavDropdown } from 'react-bootstrap';
=======
import {Nav,Navbar} from 'react-bootstrap';
>>>>>>> 31ac1901c28f3ab139766d03c4692257dcc44588

class navbar extends Component {


  logout(e) {
    e.preventDefault();
    localStorage.removeItem('user-auth');
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
      <div>
      <BNavbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <BNavbar.Brand href="/">
          <img src={photo} width="30" height="30" className="d-inline-block align-top" alt="" />
          BlockNet
        </BNavbar.Brand>
        <BNavbar.Toggle aria-controls="responsive-navbar-nav" />
        <BNavbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            {
               this.state.profileView && (
                <Nav.Link href="#" onClick={this.openDashboard}>Dashboard</Nav.Link>
               )
             }
            <Nav.Link href="#" onClick={this.openProfile}>
            <small className="text-secondary">
                 <small id="account">{this.props.account}</small>
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
            </Nav.Link>
            <Nav.Link eventKey={2} href="#" onClick={this.logout}>
              Log Out
            </Nav.Link>
          </Nav>
        </BNavbar.Collapse>
      </BNavbar>
      </div>
//       <Navbar bg="dark" expand="lg" variant="dark">
//   <Navbar.Brand href="#"><img src={photo} width="30" height="30" className="d-inline-block align-top" alt="" />SOCIAL NETWORK</Navbar.Brand>
//   <Navbar.Toggle aria-controls="basic-navbar-nav" />
//   <Navbar.Collapse id="basic-navbar-nav">
//     <Nav className="mr-auto justify-content-center">
//       <Nav.Link href="#">
//         {this.props.account}
//         { this.props.account
//               ? <img
//                 className='ml-2'
//                 width='30'
//                 height='30'
//                 src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
//               />
//               : <span></span>
//             }
//       </Nav.Link>
//       </Nav>
//       <Nav className="mr-auto justify-content-end">
//       <Nav.Link href="#" onClick={this.logout}>Log Out</Nav.Link>
//     </Nav>
//   </Navbar.Collapse>
// </Navbar>
    );
  }
}

export default withRouter(navbar);