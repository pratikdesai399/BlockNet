import React, { Component } from 'react';
import Identicon from 'identicon.js';
import photo from '../photo.png'
import { withRouter } from 'react-router-dom';
import { 
  Navbar as BNavbar, Nav, NavDropdown,
  Form, InputGroup, Button
} from 'react-bootstrap';
import { UserContext } from '../context/Context';
import Search from './Modals/Search';

class navbar extends Component {
  static contextType = UserContext;

  componentDidUpdate(prevProps, prevState) {
    if(this.state.profileView !== this.context.user.profile) {
      this.state.profileView = this.context.user.profile;
    }
  }

  logout(e) {
    e.preventDefault();
    this.context.logout();
    localStorage.removeItem('user-auth');
    // this.props.state(null)
    this.props.history.push("/login");
  }

  // searchModalref({handleShow}) {
  //   this.showModal = handleShow;
  // }

  showModal() {
    this.refs.searchModal.handleShow();
  }

  handleSearch(e) {
    e.preventDefault();
    if(this.state.search) {
      this.props.getProf(this.state.search).then(user => {
        if(user) {
          this.setState({
            result: user
          })
          console.log(user)
          this.showModal();
        }
      }).catch(err => {
        console.log(err)
      });
      this.setState({
        search: ''
      })
    }
  }

  async openProfile(e) {
    e.preventDefault();
    if(this.state.profileView === false) {
      await this.context.toggleProfile(true)
      this.setState({
        profileView: this.context.user.profile
      })
      this.props.history.push("/profile");
    }
  }

  async openDashboard(e) {
    e.preventDefault();
    await this.context.toggleProfile(false)
    this.setState({
      profileView: this.context.user.profile
    })
    this.props.history.push("/dashboard");
  }

  constructor(props) {
    super(props);
    this.state = {
      profileView: false,
      search: '', 
      result: {}
    }
    this.logout = this.logout.bind(this);
    this.openProfile = this.openProfile.bind(this);
    this.openDashboard = this.openDashboard.bind(this);
    //this.searchModalref = this.searchModalref.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.showModal = this.showModal.bind(this);
  }


  render() {
    return (
      <div>
      <Search 
        res={this.state.result}
        ref="searchModal" 
      />
      <BNavbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <BNavbar.Brand href="/">
          <img src={photo} width="30" height="30" className="d-inline-block align-top" alt="" />
          BlockNet
        </BNavbar.Brand>
        <BNavbar.Toggle aria-controls="responsive-navbar-nav" />
        <BNavbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto ml-5">
            <Form onSubmit={this.handleSearch} inline>
              <Form.Label htmlFor="inlineFormInputGroupUsername2" srOnly>
                Username
              </Form.Label>
              <InputGroup className="mb-2 mr-sm-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>@</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control 
                    id="inlineFormInputGroupUsername2" 
                    placeholder="Username" 
                    value={this.state.search}
                    onChange={e => {
                      this.setState({
                        search: e.target.value
                      })
                    }}
                />
              </InputGroup>
              
              <Button type="submit" className="mb-2">
                Search!
              </Button>
            </Form>
          </Nav>
          <Nav>
            {
               this.state.profileView && (
                <Nav.Link href="#" onClick={this.openDashboard}>Dashboard</Nav.Link>
               )
             }
            <NavDropdown title="Profile" id="collasible-nav-dropdown" className="mr-3" alignRight flip>
              <NavDropdown.Item href="#" onClick={this.openProfile}>
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
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Followers and Following</NavDropdown.Item>
            </NavDropdown>
            {/* <Nav.Link href="#" onClick={this.openProfile}>
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
            </Nav.Link> */}
            <Nav.Link eventKey={2} href="#" onClick={this.logout}>
              Log Out
            </Nav.Link>
          </Nav>
        </BNavbar.Collapse>
      </BNavbar>
      </div>
    );
  }
}

export default withRouter(navbar);