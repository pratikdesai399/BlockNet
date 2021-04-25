import React, { useEffect, useState, useContext } from 'react'
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../context/Context';

const Profile = ({ getUser, changeUserDetails }) => {
    const [userInfo, setUserInfo] = useState({
        userid: '',
        username: '',
        about: '',
        posts: []
    })
    const [updatedInfo, setUpdatedInfo] = useState({
        email: '',
        password: '',
        about: ''
    })

    const history = useHistory();
    const { user, toggleProfile } = useContext(UserContext);

    useEffect(() => {
        getUser().then(user => {
            if(user) {
                setUserInfo({
                    userid: user.userid,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    about: user.about,
                    // followers: user.followers,
                    // following: user.following
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        changeUserDetails(updatedInfo).then(usr => {
            setUserInfo({
                userid: usr.userid,
                username: usr.username,
                email: usr.email,
                password: usr.password,
                about: usr.about
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

        </div>
    )
}

export default Profile
