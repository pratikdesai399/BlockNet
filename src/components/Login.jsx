import React, { useState, useContext } from 'react'
import { Form, InputGroup, Button, Alert } from 'react-bootstrap'
import { useHistory } from 'react-router-dom';
import { UserContext } from '../context/Context'

const Login = ({ loginUser, userCreds, state }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({
        err: false,
        type: 0
    });
    const history = useHistory();
    const { login } = useContext(UserContext);

    const handleSubmit = (e) => {
        e.preventDefault();

        loginUser(username, password).then(user => {
            if(user === "0x0000000000000000000000000000000000000000") {
                console.log(user)
                setError({
                    err: true,
                    type: 1
                })
            }
            else {
                console.log("User Exists");
                userCreds(user).then(creds => {
                    if(username !== creds.username || password !== creds.password) {
                        console.log(creds.username, creds.password === '')
                        setError({
                            err: true,
                            type: 2
                        })
                    }
                    else {
                        //state(creds)
                        console.log(creds);
                        login(user);
                        history.push("/dashboard");
                    }
                })
            }
        });
        setUsername("");
        setPassword("");
    }


    return (
        <div className="loginform">
            
            <Alert variant="danger" show={error.err && error.type === 1} onClose={() => setError({ err: false, type: 0 })} dismissible>
                The current ethereum account does not have a registered user account. 
            </Alert>
            <Alert variant="danger" show={error.err && error.type === 2} onClose={() => setError({ err: false, type: 0 })} dismissible>
                The entered details are not correct, please check your details again.
            </Alert>
            <Form onSubmit={handleSubmit}>  
                <Form.Group >
                    <Form.Label>
                        Username
                    </Form.Label>
                    <InputGroup className="mb-4">
                        <InputGroup.Prepend>
                            <InputGroup.Text>@</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control 
                            required 
                            placeholder="Username" 
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </InputGroup>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        required
                        type="password" 
                        value={password}
                        placeholder="Password"
                        onChange={e => setPassword(e.target.value)} 
                        minLength="8"
                    />
                </Form.Group>
            
                <Button variant="primary" type="submit" className="btn-lg btn-block mt-4">
                    Log In
                </Button>
                <div className="text-center mt-4">
                    <a href="/register">Signup</a>
                </div>
            </Form>
        </div>
    )
}

export default Login;
