import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap';


const Profile = ({ getUser, changeUserDetails }) => {
    const [userInfo, setUserInfo] = useState({
        userid: null,
        username: null,
        about: null,
        posts: []
    })
    const [updatedInfo, setUpdatedInfo] = useState({
        email: null,
        password: null,
        about: null
    })

    useEffect(() => {
        const getUserData = () => {
            getUser().then(user => {
                setUserInfo({
                    userid: user.userid,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    about: user.about
                });
            }).catch(err => {
                console.log(err);
            });
        }

        getUserData();
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        changeUserDetails(updatedInfo).then(() => {
            window.location.reload();
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <div className="profileForm">
            <div style="textAlign: center">
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
                                if(!e.target.value) {
                                    setUpdatedInfo({
                                        password: userInfo.password
                                    })
                                }
                                else {
                                    setUpdatedInfo({
                                        password: e.target.value
                                    })}
                                }
                            }   
                            minLength="8"
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Group>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        type="email" 
                        value={updatedInfo.email}
                        placeholder={userInfo.email}
                        onChange={e => {
                            if(!e.target.value) {
                                setUpdatedInfo({
                                    email: userInfo.email
                                })
                            }
                            else {
                                setUpdatedInfo({
                                    email: e.target.value
                                })}
                            }
                        }
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>About</Form.Label>
                    <Form.Control 
                        onChange={e => {
                            if(!e.target.value) {
                                setUpdatedInfo({
                                    about: userInfo.about
                                })
                            }
                            else {
                                setUpdatedInfo({ about: e.target.value })
                            }
                        }}
                        value={userInfo.about}  
                    />
                </Form.Group>
                <Button variant="Info" type="submit" className="btn-lg btn-block mt-4">
                    Update User Info.
                </Button>
            </Form>
        </div>
    )
}

export default Profile
