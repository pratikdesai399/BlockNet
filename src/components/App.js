import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import Web3 from 'web3';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json'
import Navbar from './Navbar'
import Main from './Main'
import Register from './Register'
import Login from './Login'
import Profile from './Profile'
import Video from './Video'
import { UserContext, UserProvider } from '../context/Context';
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })


class App extends Component {
  static contextType = UserContext;
  async componentWillMount(){
    try {
      window.ethereum.on('accountsChanged', acc => {
        window.location.reload();
      })
    } catch(err) {
      console.log(err);
    }
    await this.loadWeb3()
    await this.loadBlockchainData()
    await this.getContext();
    // await this.listusers()
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
      this.setState({ loading: true })
      const socialnetwork = new web3.eth.Contract(SocialNetwork.abi, networkData.address)
      
      this.setState({ socialnetwork })
      const imagesCount = await socialnetwork.methods.imageCount().call()
      const postCount = await socialnetwork.methods.postCount().call()
      const userCount = await socialnetwork.methods.userCount().call()
      const videosCount = await socialnetwork.methods.videoCount().call()
      this.setState({ imagesCount })
      this.setState({ postCount })
      this.setState({userCount})
      this.setState({ videosCount })
      
      // Load videos, sort by newest
      for (var i=videosCount; i>=1; i--) {
        const video = await socialnetwork.methods.videos(i).call()
        this.setState({
          videos: [...this.state.videos, video]
        })
      }
      
      //Set latest video with title to view as default 
      const latest = await socialnetwork.methods.videos(videosCount).call()
      this.setState({
        currentHash: latest.hash,
        currentTitle: latest.title
      })
      
      
      const followers = await this.getFollowers(this.state.account);
      this.setState({
        followers
      })
      const following = await this.getFollowing(this.state.account);
      this.setState({
        following
      })
      // Load images
      for (i = 1; i <= imagesCount; i++) {
        const image = await socialnetwork.methods.images(i).call()
        this.setState({
          images: [...this.state.images, image]
        })
      }
      for (i = 1; i <= postCount; i++) {
        const post = await socialnetwork.methods.posts(i).call()
        this.setState({
          posts: [...this.state.posts, post]
        })
      }

      // Sort images. Show highest tipped images first
      this.setState({
        images: this.state.images.sort((a,b) => b.tipAmount - a.tipAmount )
      })
      
      this.setState({
        posts: this.state.posts.sort((a,b) => b.tipAmount - a.tipAmount )
      })
      
      this.setState({
        images: this.state.images.filter(img => this.state.following.includes(img.author)),
        posts: this.state.posts.filter(post => this.state.following.includes(post.author))
        
      })
      
      
      this.setState({ loading: false})
    } else {
      window.alert('Social Networks contract not deployed to detected network.')
    }
  }

  async listusers(){
    var l = [];
    const arr = await this.state.socialnetwork.methods.getAllUsers().call();
    const c = await this.state.socialnetwork.methods.userCount().call();

    for(var i = 0; i <parseInt(c._hex); i++ ){
      var name = await this.state.socialnetwork.methods.getUserDetails(arr[i]).call();
      //console.log(name[0]);
      l.push(name[0]);
      // let {list} = this.state;
      // list.push(name[0]);
      
      
    }
    return l;
    
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

  uploadVideo = title => {
    console.log("Submitting file to IPFS...")

    //adding file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('IPFS result', result)
      if(error) {
        console.error(error)
        return
      }

      this.setState({ loading: true })
      this.state.socialnetwork.methods.uploadVideo(result[0].hash, title).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  changeVideo = (hash, title) => {
    this.setState({'currentHash': hash});
    this.setState({'currentTitle': title});
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
    const user = await this.state.socialnetwork.methods.getUser(this.state.account).call();
    return user;
  }

  async userCreds(userid) {
    const {username, password} = await this.state.socialnetwork.methods.getUserDetails(this.state.account).call();
    return ({
      username,
      password
    })
  }

  async getContext() {
    this.setState({ loading: true });
    const context = this.context;
    this.setState({
      user: context
    })
    console.log(context)
    this.setState({ loading: false });
  }
  
  async follows(user1, user2) { //user1 follows user2
    const followers = await this.getFollowers(user2);
    return followers.includes(user1)
  }

  async getFollowers(addr) {
    const followers = await this.state.socialnetwork.methods.getFollowers(addr).call();
    const fArray = [];
    for(var i = 0; i < followers.length; i++) {
      fArray.push(followers[i]);
    }
    return fArray;
  }

  async getFollowing(addr) {
    const following = await this.state.socialnetwork.methods.getFollowing(addr).call();
    const fArray = [];
    for(var i = 0; i < following.length; i++) {
      fArray.push(following[i]);
    }
    return fArray;
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
      about,
      following: this.state.following,
      followers: this.state.followers
    })
  }

  async getNoFollowers(addr) {
    const followers = await this.getFollowers(addr);
    return followers.length;
  }

  async getNoFollowing(addr) {
    const following = await this.getFollowing(addr);
    return following.length;
  }


  async getUserInfo(addr) {
    const { username, email, about } = await this.state.socialnetwork.methods.getUserDetails(addr).call();
    const follows = await this.follows(this.state.account, addr);
    const following = await this.follows(addr, this.state.account);
    const no_following = await this.getNoFollowing(addr);
    const no_followers = await this.getNoFollowers(addr);
    return ({
      username,
      email,
      about,
      addr,
      following,
      follows,
      no_following,
      no_followers
    })
  }

  async getSearchProfile(username) {
    const exists = await this.state.socialnetwork.methods.getUsername(username).call();
    if(exists) {
      const addr = await this.state.socialnetwork.methods.usernames(username).call();
      const user = await this.getUserInfo(addr);
      return user;
    }
    return false;
  }

  async changeUserDetails(newUser) {
    const { email, password, about } = newUser;
    let email_ver, pass_ver, about_ver;
    const user = await this.getUserDetails();
    email_ver = email === "" ? user.email : email;
    pass_ver = password === "" ? user.password : password;
    about_ver = about === "" ? user.about : about;
    this.state.socialnetwork.methods.setUserDetails(email_ver, pass_ver, about_ver).send({ from: this.state.account })
    .once('confirmation', res => {
      console.log(res)
    });
    const update = await this.getUserDetails();
    return (update);
  }

  async followUser(addr) {
    this.setState({ loading: true });
    this.state.socialnetwork.methods.follow(addr).send({ from: this.state.account })
    .once('confirmation', res => {
      window.location.reload()
    });
    this.setState({ loading: false });
  }
  
  async unFollowUser(addr) {
    this.setState({ loading: true });
    this.state.socialnetwork.methods.unFollow(addr).send({ from: this.state.account })
    .once('confimation', res => {
      window.location.reload()
    });
    this.setState({ loading: false });
  }

  constructor(props) {
    super(props);
    
    
    this.state = {
      account: '',
      socialnetwork: null,
      images: [],
      postCount: 0,
      posts: [],
      loading: true,
      user: {},
      following: [],
      followers: [],
      userCount: 0,
      videos: [],
      buffer: null,
      currentHash: null,
      currentTitle: null,
      list: []
    }
    

    this.uploadImage = this.uploadImage.bind(this)
    this.tipImageOwner = this.tipImageOwner.bind(this)
    this.captureFile = this.captureFile.bind(this)
    this.createPost = this.createPost.bind(this)
    this.tipPost = this.tipPost.bind(this)
    this.createUser = this.createUser.bind(this)
    this.loginUser = this.loginUser.bind(this)
    this.userCreds = this.userCreds.bind(this);
    this.getSearchProfile = this.getSearchProfile.bind(this);
    this.likeImage = this.likeImage.bind(this)
    this.disLikeImage = this.disLikeImage.bind(this)
    this.likePost = this.likePost.bind(this)
    this.disLikePost = this.disLikePost.bind(this)
    this.getUserDetails = this.getUserDetails.bind(this);
    this.changeUserDetails = this.changeUserDetails.bind(this);
    this.uploadVideo = this.uploadVideo.bind(this)
    this.changeVideo = this.changeVideo.bind(this)
    this.listusers = this.listusers.bind(this)
    this.followUser = this.followUser.bind(this)
    this.follows = this.follows.bind(this)
    this.unFollowUser = this.unFollowUser.bind(this)
    this.getNoFollowers = this.getNoFollowers.bind(this)
    this.getFollowers = this.getFollowers.bind(this)
    this.getNoFollowing = this.getNoFollowing.bind(this)
    this.getFollowing = this.getFollowing.bind(this)
    this.getUserInfo = this.getUserInfo.bind(this);
  }

  render() {
    return (
      <Router>
        <UserProvider>
        <div>
          <Switch>
            <Route exact path='/video'>
              { this.state.loading
                ? <Spinner animation="border" role="status" style={{position: 'absolute', left: '50%', top: '50%'}}>
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                : <> 
                    <Navbar 
                      account={this.state.account}
                      getProf={this.getSearchProfile}
                      userCreds={this.userCreds}
                      follow={this.followUser}
                      unFollow={this.unFollowUser}
                    />
                    <Video
                      videos={this.state.videos}
                      uploadVideo={this.uploadVideo}
                      captureFile={this.captureFile}
                      changeVideo={this.changeVideo}
                      currentHash={this.state.currentHash}
                      currentTitle={this.state.currentTitle}
                    />
                  </>
              }
            </Route>
            <Route path="/" exact render={() => {
              return(
                this.state.user.auth ?
                <Redirect to="/dashboard" /> :
                <Redirect to="/login" />
              )
            }} />
            <Route exact path="/dashboard">
              <Navbar 
                  account={this.state.account}
                  getProf={this.getSearchProfile}
                  userCreds={this.userCreds}
                  follow={this.followUser}
                  unFollow={this.unFollowUser}
              />
              { this.state.loading
                ? <Spinner animation="border" role="status" style={{position: 'absolute', left: '50%', top: '50%'}}>
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                : <>
                
                    <Main
                        images={this.state.images}
                        captureFile={this.captureFile}
                        uploadImage={this.uploadImage}
                        tipImageOwner={this.tipImageOwner}
                        likeImage={this.likeImage}
                        disLikeImage={this.disLikeImage}
                        list={this.listusers}

                        posts={this.state.posts}
                        createPost={this.createPost}
                        tipPost={this.tipPost}
                        likePost={this.likePost}
                        disLikePost={this.disLikePost}

                        getProf={this.getUserInfo}
                        unFollow={this.unFollowUser}
                    />
                  </>
              }
            </Route>
            <Route exact path="/login">
              {
                <Login
                      loginUser = {this.loginUser}
                      userCreds = {this.userCreds}
                />
              }
            </Route>
            <Route exact path="/register">
              {
                <Register 
                     createUser = {this.createUser}
                  />
              }
            </Route>
            <Route exact path="/profile">             
                <Navbar 
                  account={this.state.account}
                  getProf={this.getSearchProfile}
                  userCreds={this.userCreds}
                  follow={this.followUser}
                  unFollow={this.unFollowUser}
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
        </UserProvider>
      </Router>
    );
  }
}

export default App;