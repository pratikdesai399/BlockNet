import React, { Component } from 'react'
import { Modal, Button } from 'react-bootstrap'

export default class FollowDetails extends Component {

    handleClose() {
        this.setState({
            show: false
        })
    }

    handleShow(list, followers) {
        this.setState({
            followers,
            users: list
        })
            
        this.setState({
            show: true
        })
    }

    constructor(props) {
        super(props);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            show: false,
            followers: false,
            users: []
        }
    }
    render() {
        return (
            <div>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>
                        {
                            this.state.followers 
                            ? <>Followers</>
                            : <>Following</>
                        }
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            this.state.users.length === 0 
                            ? <p>No {this.state.followers ? <span>Followers</span> : <span>Following</span>}</p>
                            : this.state.users.map((useraddr, index) => <p key={index}>{useraddr}</p>)
                        }
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="info" onClick={this.handleClose}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
