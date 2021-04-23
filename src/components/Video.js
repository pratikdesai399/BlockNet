  
import React, { Component } from 'react';
import { Button} from 'react-bootstrap';

class Video extends Component {

  render() {
    return (
      <div className="container-fluid text-monospace">
          <br></br>
          &nbsp;
          <br></br>
          <div className="row">
              
            
          <div className="col-md-3  overflow-auto text-center" style={{ maxHeight: '768px', minWidth: '175px' }}>
          <div className="content mr-auto ml-auto">
           
           
           <Button size="lg" variant="outline-primary"><a href='/dashboard'>GO BACK TO DASHBOARD</a></Button>
         </div><br></br>
            <h5><b>UPLOAD REEL</b></h5>
            <form onSubmit={(event) => {
              event.preventDefault()
              const title = this.videoTitle.value
              this.props.uploadVideo(title)
            }} >
              &nbsp;
              <input type='file' accept=".mp4, .mkv .ogg .wmv" onChange={this.props.captureFile} style={{ width: '250px' }} />
                <div className="form-group mr-sm-2"><br />
                  <input
                    id="videoTitle"
                    type="text"
                    ref={(input) => { this.videoTitle = input }}
                    className="form-control-sm"
                    placeholder="Title for the Reel"
                    required />
                </div>
              <button type="submit" className="btn btn-success btn-block btn-sm">ADD</button>
              &nbsp;
            </form>
            
          </div>
          <div className="col-md-7">
              <div className="embed-responsive embed-responsive-16by9" style={{ maxHeight: '768px'}}>
                <video
                  src={`https://ipfs.infura.io/ipfs/${this.props.currentHash}`}
                  controls
                >
                </video>
              </div>
            <h3><b><i>{this.props.currentTitle}</i></b></h3>
          </div>
          
          <div className='col-md-2'>
          { this.props.videos.map((video, key) => {
              return(
                <div className="card mb-4 text-center bg-black mx-auto" style={{ width: '175px'}} key={key} >
                  <div className="card-title bg-dark">
                    <small className="text-white"><b>{video.title}</b></small>
                  </div>
                  <div>
                    <p onClick={() => this.props.changeVideo(video.hash, video.title)}>
                      <video
                        src={`https://ipfs.infura.io/ipfs/${video.hash}`}
                        style={{ width: '150px' }}
                      />
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Video;