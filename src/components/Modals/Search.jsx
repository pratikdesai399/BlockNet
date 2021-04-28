import React, { Component } from 'react'
import { Modal, Button } from 'react-bootstrap'

export default class Search extends Component {

    handleClose() {
        this.setState({
            show: false
        })
    }

    handleShow() {
        this.setState({
            show: true
        })
    }

    handleFollow() {
        this.props.follow(this.props.res.addr).then(() => {
            this.handleClose();
        }).catch(err => {
            console.log(err);
        })
    }
    
    handleUnfollow() {
        this.props.unFollow(this.props.res.addr).then(() => {
            this.handleClose();
        }).catch(err => {
            console.log(err);
        })
    }

    constructor(props) {
        super(props);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleFollow = this.handleFollow.bind(this);
        this.handleUnfollow = this.handleUnfollow.bind(this);
        this.state = {
            show: false
        }
    }
    render() {
        return (
            <div>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>{this.props.res.username}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        User Address: {this.props.res.addr}
                        Email: {this.props.res.email}
                        {
                            this.props.res.following &&
                            <p style={{color: 'blue'}}>Follows you</p>
                        } 
                        <small>About: {this.props.res.about}</small>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    {
                        this.props.res.follows ?
                        <Button variant="primary" onClick={this.handleUnfollow}>
                            Unfollow
                        </Button> :
                        <Button variant="primary" onClick={this.handleFollow}>
                            Follow
                        </Button>
                    }
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
