import React, { Component } from 'react'
import { Modal, Button } from 'react-bootstrap'

export default class UserInfo extends Component {

    handleClose() {
        this.setState({
            show: false
        })
    }

    handleShow(author) {
        // console.log(author)
        this.props.getProf(author).then((user) => {
            this.setState({
                user: user
            })
        }).then(() => {
            this.setState({
                show: true
            })
        })
    }
    
    handleUnfollow() {
        this.props.unFollow(this.state.user.addr).then(() => {
            this.handleClose();
        }).catch(err => {
            console.log(err);
        })
    }

    constructor(props) {
        super(props);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleUnfollow = this.handleUnfollow.bind(this);
        this.state = {
            show: false,
            user: {}
        }
    }
    render() {
        return (
            <div>

                <Modal
                    show={this.state.show}
                    onHide={this.handleClose}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        {this.state.user.username}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Address: {this.state.user.addr}</p>
                        <p>Following: {this.state.user.no_following} Followers: {this.state.user.no_followers}</p>
                        <p>
                        {this.state.user.about}
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleClose}>Close</Button>
                        <Button variant="primary" onClick={this.handleUnfollow}>
                            Unfollow
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
