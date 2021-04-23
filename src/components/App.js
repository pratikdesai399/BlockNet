import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json'
import Navbar from './Navbar'
import Main from './Main'
import Register from './Register'
import Login from './Login'
import Profile from './Profile'
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })


class App extends Component {

  async componentWillMount(){
    try {
      window.ethereum.on('accountsChanged', acc => {
        this.loadWeb3()
      })
    } catch(err) {
      console.log(err);
    }
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  // Load web3.js 
  // Gets ethereum provider to get a connection with blockchain 
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData(){
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = SocialNetwork.networks[networkId]
    if(networkData) {
      const socialnetwork = new web3.eth.Contract(SocialNetwork.abi, networkData.address)

      this.setState({ socialnetwork })
      const imagesCount = await socialnetwork.methods.imageCount().call()
      const postCount = await socialnetwork.methods.postCount().call()
      this.setState({ imagesCount })
      this.setState({ postCount })
      // Load images
      for (var i = 1; i <= imagesCount; i++) {
        const image = await socialnetwork.methods.images(i).call()
        this.setState({
          images: [...this.state.images, image]
        })
      }
      for (var i = 1; i <= postCount; i++) {
        const post = await socialnetwork.methods.posts(i).call()
        this.setState({
          posts: [...this.state.posts, post]
        })
      }

      // Sort images. Show highest tipped images first
      this.setState({
        images: this.state.images.sort((a,b) => b.tipAmount - a.tipAmount )
      })
      this.setState({ loading: false})

      
    } else {
      window.alert('Social Networks contract not deployed to detected network.')
    }
    

  }


  captureFile = event => {

    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  uploadImage = description => {
    console.log("Uploading to IPFS...")

    //Adding to IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('IPFS : ', result)
      if(error) {
        console.error(error)
        return
      }

      this.setState({ loading: true })
      this.state.socialnetwork.methods.uploadImage(result[0].hash, description).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
        window.location.reload()
      })
    })
    
  }

  createPost(content) {
    this.setState({ loading: true });
      this.state.socialnetwork.methods.createPost(content).send({ from: this.state.account }).on('confirmation', (reciept) => {
      this.setState({ loading: false })
      window.location.reload()
    })
    this.setState({loading: false})
  };

  tipPost(id, tipAmount) {
    this.setState({ loading: true })
    this.state.socialnetwork.methods.tipPost(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
      window.location.reload()
    })
    this.setState({loading:false})
  }

  tipImageOwner(id, tipAmount){
    //console.log("TIP")
    this.setState({loading: true})
    this.state.socialnetwork.methods.tipImageOwner(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
      window.location.reload()
    })
    this.setState({loading:false})
  }

  likeImage(id, like_count){
    this.setState({ loading: true })
    this.state.socialnetwork.methods.likeImage(id).send({ from: this.state.account, value: like_count }).on('confirmation', (reciept) => {
      this.setState({ loading: false })
      window.location.reload()
    })
    this.setState({loading: false})
  }  

  disLikeImage(id, dislike_count){
    this.setState({ loading: true })
    this.state.socialnetwork.methods.disLikeImage(id).send({ from: this.state.account, value: dislike_count }).on('confirmation', (reciept) => {
      this.setState({ loading: false })
      window.location.reload()
    })
    this.setState({loading: false})
  }

  likePost(id, like_count){
    this.setState({ loading: true })
    this.state.socialnetwork.methods.likePost(id).send({ from: this.state.account, value: like_count }).on('confirmation', (reciept) => {
      this.setState({ loading: false })
      window.location.reload()
    })
    this.setState({loading: false})
  }

  disLikePost(id, dislike_count){
    this.setState({ loading: true })
    this.state.socialnetwork.methods.disLikePost(id).send({ from: this.state.account, value: dislike_count }).on('confirmation', (reciept) => {
      this.setState({ loading: false })
      window.location.reload()
    })
    this.setState({loading: false})
  }

  async createUser(username, email, password, about) {
    this.setState({loading: true}); 
    const unique = await this.state.socialnetwork.methods.getUsername(username).call();
    console.log(unique);
    if(unique === true) {
      return false;
    }
    const user = await this.state.socialnetwork.methods.getUser(this.state.account).call();
    if(user === "0x0000000000000000000000000000000000000000") {
      this.state.socialnetwork.methods.createUser(username, email , password, about).send({ from: this.state.account })
      .once('reciept', (receipt) => {
        this.setState({ loading: false })
      });
      this.setState({ loading: false });
      const unique1 = await this.state.socialnetwork.methods.getUsername(username).call();
      console.log(unique1);
      return true;
    }
    else {
      //user already exists
      console.log(this.state.account)
      return false;
    }
  }

  async loginUser(username, password) {
    this.setState({loading:true});
    const user = await this.state.socialnetwork.methods.getUser(this.state.account).call();
    this.setState({loading: false});
    return user;
  }

  async userCreds(userid) {
    const {username, email, password, about} = await this.state.socialnetwork.methods.getUserDetails(this.state.account).call();
    return ({
      username,
      password
    })
  }

  switchUser(newval) {
    this.setState({
      user: newval
    });
    if(!newval) {
      localStorage.removeItem("user-auth");
    }
    else {
      localStorage.setItem("user-auth", newval);
    }
  }

  async getUserDetails() {
    this.setState({loading: true});
    const { username, email, password, about } = await this.state.socialnetwork.methods.getUserDetails(this.state.account).call();
    this.setState({loading: false});
    return ({
      userid: this.state.account,
      username,
      email,
      password,
      about
    })
  }

  async changeUserDetails(newUser) {
    const { email, password, about } = newUser;
    let email_ver, pass_ver, about_ver;
    const user = await this.getUserDetails();
    email_ver = email === "" ? user.email : email;
    pass_ver = password === "" ? user.password : password;
    about_ver = about === "" ? user.about : about;
    this.setState({ loading: true });
    this.state.socialnetwork.methods.setUserDetails(email_ver, pass_ver, about_ver).send({ from: this.state.account })
    .once('confirmation', res => {
      this.setState({ loading: false })
    });
    const update = await this.getUserDetails();
    this.setState({ loading: false });
    return (update);
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      socialnetwork: null,
      images: [],
      postCount: 0,
      posts: [],
      loading: true,
      user: null
    }

    this.uploadImage = this.uploadImage.bind(this)
    this.tipImageOwner = this.tipImageOwner.bind(this)
    this.captureFile = this.captureFile.bind(this)
    this.createPost = this.createPost.bind(this)
    this.tipPost = this.tipPost.bind(this)
    this.createUser = this.createUser.bind(this)
    this.loginUser = this.loginUser.bind(this)
    this.userCreds = this.userCreds.bind(this);
    this.switchUser = this.switchUser.bind(this);
    this.likeImage = this.likeImage.bind(this)
    this.disLikeImage = this.disLikeImage.bind(this)
    this.likePost = this.likePost.bind(this)
    this.disLikePost = this.disLikePost.bind(this)
    this.getUserDetails = this.getUserDetails.bind(this);
    this.changeUserDetails = this.changeUserDetails.bind(this);
  }

  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route path="/" exact render={() => {
              console.log(this.state.user);
              return(
                localStorage.getItem("user-auth") ?
                <Redirect to="/dashboard" /> :
                <Redirect to="/login" />
              )
            }} />
            <Route exact path="/dashboard">
              <Navbar 
                  account={this.state.account}
                  state = {this.switchUser}
              />
              { this.state.loading
                ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
                : <Main
                      images={this.state.images}
                      captureFile={this.captureFile}
                      uploadImage={this.uploadImage}
                      tipImageOwner={this.tipImageOwner}
                      likeImage={this.likeImage}
                      disLikeImage={this.disLikeImage}

                      posts={this.state.posts}
                      createPost={this.createPost}
                      tipPost={this.tipPost}
                      likePost={this.likePost}
                      disLikePost={this.disLikePost}
                  />
              }
            </Route>
            <Route exact path="/login">
              <Login
                    loginUser = {this.loginUser}
                    userCreds = {this.userCreds}
                    state = {this.switchUser}
              />
            </Route>
            <Route exact path="/register">
              <Register 
                createUser = {this.createUser}
              />
            </Route>
            <Route exact path="/profile">
              <Navbar 
                  account={this.state.account}
                  state = {this.switchUser}
              />
              <Profile 
                    getUser = {this.getUserDetails}
                    changeUserDetails = {this.changeUserDetails}
              />
            </Route>
            <Route path="*">
              <div>404 Not Found</div>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;