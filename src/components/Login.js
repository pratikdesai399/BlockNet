import React, { useState } from 'react'
import { Form, InputGroup, Button } from 'react-bootstrap'

const Login = ({ createUser }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [about, setAbout] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username, email, password, about)
        const user = createUser(username, email, password, about).then(res => res);
        if(user === true) {
            console.log("user created")
        }
        else {
            console.log("error")
        }
        setUsername("");
        setEmail("");
        setPassword("");
        setAbout("");
    }


    return (
        <div>
            <Form onSubmit={handleSubmit}>  
                <Form.Group >
                    <Form.Label srOnly>
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
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default Login
