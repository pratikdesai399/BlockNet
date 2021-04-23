import React, { Component } from 'react';
import Identicon from 'identicon.js';
import { Button,Container,Row,Col,ListGroup} from 'react-bootstrap';
// import SideNav, {MenuIcon} from 'react-simple-sidenav';

class Main extends Component {

  render() {
    return (
      
      <Container fluid>
        
        <Row>

        <Col>
        <div className="content mr-auto ml-auto">
           
            <br></br>
            <Button size="lg" variant="outline-primary"><a href='/video'>GO TO REELS PAGE</a></Button>
          </div>
        
                    <ListGroup variant="flush">
                      <br></br>
                      <ListGroup.Item as="li" active>User List</ListGroup.Item>
                      <ListGroup.Item>Cras justo odio</ListGroup.Item>
                      <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                      <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                      <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                      <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                      
                    </ListGroup>
                
                  </Col>
            <Col xs={5}>
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>



              


              
              

              <p>&nbsp;</p>
                
              { this.props.images.map((image, key) => {
                return(
                  <div className="card mb-4" key={key} >
                    <div className="card-header">
                      <img
                        alt="img"
                        className='mr-2'
                        width='30'
                        height='30'
                        src={`data:image/png;base64,${new Identicon(image.author, 30).toString()}`}
                      />
                      <small className="text-muted">{image.author}</small>
                    </div>
                    <ul id="imageList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p className="text-center"><img alt="" src={`https://ipfs.infura.io/ipfs/${image.hash}`} style={{ maxWidth: '420px'}}/></p>
                        <p>{image.description}</p>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                          TIPS: {window.web3.utils.fromWei(image.tipAmount.toString(), 'Ether')} ETH
                        </small>
                        <Button
                          className="btn btn-sm float-right pt-0"
                          name={image.id}
                          onClick={(event) => {
                            let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
                            console.log(event.target.name, tipAmount)
                            this.props.tipImageOwner(event.target.name, tipAmount)
                          }}
                        >
                          TIP 0.1 ETH
                        </Button>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                          Likes: {window.web3.utils.fromWei(image.likes.toString(), 'Ether')}
                        </small>
                        <Button variant="primary"
                          className="btn btn-sm float-right pt-0"
                          name={image.id}
                          onClick={(event) => {
                            let likeCount = window.web3.utils.toWei('0.1', 'Ether')
                            console.log(event.target.name, likeCount)
                            this.props.likeImage(event.target.name,likeCount)
                          }}
                        >
                          Like</Button>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                          Dislikes: {window.web3.utils.fromWei(image.dislikes.toString(), 'Ether')}
                        </small>
                        <Button
                          className="btn btn-sm float-right pt-0"
                          name={image.id}
                          onClick={(event) => {
                            let disLikeCount = window.web3.utils.toWei('0.1', 'Ether')
                            console.log(event.target.name, disLikeCount)
                            this.props.disLikeImage(event.target.name,disLikeCount)
                          }}
                        >
                          Dislike
                        </Button>
                      </li>
                    </ul>
                  </div>
                  
                )
              })}





{ this.props.posts.map((post, key) => {
                return(
                  <div className="card mb-4" key={key} >
                    <div className="card-header">
                      <img
                        alt=""
                        className='mr-2'
                        width='30'
                        height='30'
                        src={`data:image/png;base64,${new Identicon(post.author, 30).toString()}`}
                      />
                      <small className="text-muted">{post.author}</small>
                    </div>
                    <ul id="postList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p>{post.content}</p>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                          TIPS: {window.web3.utils.fromWei(post.tipAmount.toString(), 'Ether')} ETH
                        </small>
                        <Button
                          className="btn btn-sm float-right pt-0"
                          name={post.id}
                          onClick={(event) => {
                            let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
                            console.log(event.target.name, tipAmount)
                            this.props.tipPost(event.target.name, tipAmount)
                          }}
                        >
                          TIP 0.1 ETH
                        </Button>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                          Likes: {window.web3.utils.fromWei(post.likes.toString(), 'Ether')}
                        </small>
                        <Button
                          className="btn btn-sm float-right pt-0"
                          name={post.id}
                          onClick={(event) => {
                            let postLikeCount = window.web3.utils.toWei('0.1', 'Ether')
                            console.log(event.target.name, postLikeCount)
                            this.props.likePost(event.target.name, postLikeCount)
                          }}
                        >
                          Like
                        </Button>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                          Dislikes: {window.web3.utils.fromWei(post.dislikes.toString(), 'Ether')}
                        </small>
                        <Button
                          className="btn btn-sm float-right pt-0"
                          name={post.id}
                          onClick={(event) => {
                            let postDislikeCount = window.web3.utils.toWei('0.1', 'Ether')
                            console.log(event.target.name, postDislikeCount)
                            this.props.disLikePost(event.target.name, postDislikeCount)
                          }}
                        >
                          Dislike
                        </Button>
                      </li>
                    </ul>
                  </div>
                )
              })}

            </div>
          </Col>
          <Col>
          <div className="content mr-auto ml-auto">
           
            <br></br>
            {/* <Button size="lg" variant="outline-primary">Upload Post</Button> */}
            <h2>UPLOAD YOUR IMAGE HERE</h2>
              <form onSubmit={(event) => {
                event.preventDefault()
                const description = this.imageDescription.value
                this.props.uploadImage(description)
              }} >
                <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} />
                  <div className="form-group mr-sm-2">
                    <br></br>
                      <input
                        id="imageDescription"
                        type="text"
                        ref={(input) => { this.imageDescription = input }}
                        className="form-control"
                        placeholder="Image description..."
                        required />
                  </div>
                <button type="submit" className="btn btn-success btn-block btn-lg">POST</button>
              </form>
          </div>

          <div className='content mr-auto ml-auto'>
          <h2>WRITE YOUR POST HERE</h2>
              <form onSubmit={(event) => {
    event.preventDefault()
    const content = this.postContent.value
    this.props.createPost(content)
  }}>
  <div className="form-group mr-sm-2">
    <input
      id="postContent"
      type="text"
      ref={(input) => { this.postContent = input }}
      className="form-control"
      placeholder="What's on your mind?"
      required />
  </div>
  <button type="submit" className="btn btn-primary btn-block">Share</button>
</form>

          </div>


          
            
          </Col>
          </Row>

        
        </Container>
      
    );
  }
}

export default Main;