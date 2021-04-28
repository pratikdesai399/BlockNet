import React, { useEffect, useState, useContext, useRef } from 'react'
import { Form, InputGroup, Button, Col, Badge } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../context/Context';
import FollowDetails from './Modals/FollowDetails'

const Profile = ({ getUser, changeUserDetails }) => {
    const [userInfo, setUserInfo] = useState({
        userid: '',
        username: '',
        email: '',
        password: '',
        about: '',
        following: [],
        followers: []
    })
    const [updatedInfo, setUpdatedInfo] = useState({
        email: '',
        password: '',
        about: ''
    })

    const history = useHistory();
    const { user, toggleProfile } = useContext(UserContext);
    const followDetailsRef = useRef();

    useEffect(() => {
        getUser().then(user => {
            if(user) {
                setUserInfo({
                    userid: user.userid,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    about: user.about,
                    followers: user.followers,
                    following: user.following
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }, [])

    const openFollowers = (e) => {
        e.preventDefault();
        followDetailsRef.current.handleShow(userInfo.followers, true);
    }
    const openFollowing = (e) => {
        e.preventDefault();
        followDetailsRef.current.handleShow(userInfo.following, false);
    }
    

    const handleSubmit = (e) => {
        e.preventDefault();
        changeUserDetails(updatedInfo).then(usr => {
            setUserInfo({
                userid: usr.userid,
                username: usr.username,
                email: usr.email,
                password: usr.password,
                about: usr.about,
                followers: usr.followers,
                following: usr.following
            });
            toggleProfile(false).then(() => {
                console.log(user.profile)
                history.push("/dashboard");
            })
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <div className="profileForm mt-5 container-fluid">
            <FollowDetails 
                ref={followDetailsRef}
            />
            <div>
                <h3>User Id</h3>
                <h4>{userInfo.userid}</h4>
            </div>
            <Form onSubmit={handleSubmit}>
                <Form.Row>  
                    <Form.Group as={Col}>
                        <Form.Label>
                            Username
                        </Form.Label>
                        <InputGroup className="mb-2">
                            <InputGroup.Prepend>
                                <InputGroup.Text>@</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control 
                                required 
                                placeholder={userInfo.username} 
                                value={userInfo.username}
                                disabled
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            value={updatedInfo.password}
                            placeholder="Update Password (min. 8 characters)"
                            onChange={e => {
                                setUpdatedInfo({
                                    email: updatedInfo.email,
                                    password: e.target.value,
                                    about: updatedInfo.about
                                })}
                            }   
                            minLength="8"
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Group>
                    <Form.Label>Email address</Form.Label>
                    <InputGroup className="mb-2">    
                        <InputGroup.Prepend>
                            <InputGroup.Text>{userInfo.email}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control 
                            type="email" 
                            value={updatedInfo.email}
                            placeholder={userInfo.email}
                            onChange={e => {
                                setUpdatedInfo({
                                    email: e.target.value,
                                    password: updatedInfo.password,
                                    about: updatedInfo.about
                                })}
                            }
                        />
                    </InputGroup>
                </Form.Group>
                <Form.Group>
                    <Form.Label>About</Form.Label>
                    <Form.Control 
                        onChange={e => {
                            setUpdatedInfo({ 
                                email: updatedInfo.email,
                                password: updatedInfo.password,
                                about: e.target.value 
                            })
                        }}
                        value={updatedInfo.about}
                        placeholder={userInfo.about}  
                    />
                </Form.Group>
                <Button variant="info" type="submit" className="btn-lg btn-block mt-4">
                    Update User Info.
                </Button>
            </Form>

            <div className="followMenu">
                <Button variant="info" style={{display: 'inline-block'}} onClick={openFollowers}>
                    Followers <Badge variant="light">{userInfo.followers.length}</Badge>
                    <span className="sr-only">unread messages</span>
                </Button>
                <Button variant="info" style={{display: 'inline-block'}} onClick={openFollowing}>
                    Following <Badge variant="light">{userInfo.following.length}</Badge>
                    <span className="sr-only">unread messages</span>
                </Button>
            </div>
        </div>
    )
}

export default Profile
