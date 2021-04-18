import React, { useState } from 'react'
import { Form, InputGroup, Button, Alert } from 'react-bootstrap'
import { useHistory } from 'react-router-dom';

const Register = ({ createUser }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [about, setAbout] = useState("");
    const [error, setError] = useState(false);
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username, email, password, about)
        createUser(username, email, password, about).then(user => {
            if(user === true) {
                console.log("user created")
                history.push("/login");
            }
            else {
                console.log("User Exists");
                setError(true);
            }
        });
        setUsername("");
        setEmail("");
        setPassword("");
        setAbout("");
    }


    return (
        <div className="regform">
            <Alert variant="danger" show={error} onClose={() => setError(false)} dismissible>
                An user with the entered username already exists or the current ethereum account already has a registered account.
            </Alert>
            <Form onSubmit={handleSubmit}>  
                <Form.Group >
                    <Form.Label>
                        Username
                    </Form.Label>
                    <InputGroup className="mb-2">
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
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        required
                        type="email" 
                        value={email}
                        placeholder="Enter email" 
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
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
                <Form.Group>
                    <Form.Label>About</Form.Label>
                    <Form.Control 
                        onChange={e => setAbout(e.target.value)}
                        value={about}  
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="btn-lg btn-block mt-4">
                    Submit
                </Button>
                <div className="text-center mt-4">
                    <a href="/login">Login</a>
                </div>
            </Form>
        </div>
    )
}

export default Register;
