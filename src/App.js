import React from 'react';
import Axios from 'axios';
import './App.css';
import Chip from '@material-ui/core/Chip';
import {Progress} from 'reactstrap';
import api from './client_info.js';

let Files2 = null;
let data = new FormData();
class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      files_present :[],
      clicked : "",
      loaded : 0,
      message : "",
    }
  }
  componentDidMount(){
    Axios.get(`${api.node_url}/api/usr/post`).then((res)=>{
      this.setState({
        files_present : res.data.data
      })
      console.log(this.state.files_present);
    }).catch((e)=>{
      console.log(e.message);
    })
  }
  handleChange(event){
    this.setState({
      loaded : 0
    })
    Files2 = event.target.files;
    console.log(Files2);
    // console.log(this.state.Files);
    data = new FormData();
    if(Files2.length > 0){
     
      for(let i = 0 ; i < Files2.length ; ++i ){
        data.append('file' , Files2[i]);
      }
      
    }
  }
  handleClick(){
    Axios.post(`${api.node_url}/api/usr/post`, data, {
      headers:{
        Authorization : 'Bearer$' + this.state.clicked
      },
      onUploadProgress: ProgressEvent => {
        this.setState({
          loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
      })
    }})
    .then(res => {
      console.log(res);
      this.setState({
        message : res.data.message
      })
    })
    .catch(e =>{
      console.log(e.message);
    })
    this.setState({
      loaded : 0
    })
  }
  
  render(){
    const file = this.state.files_present.map((files)=>{
      return(
          <div className='mt-2 ml-3'>
            {this.state.clicked === files ?<Chip label={files} onClick={()=>{this.setState({clicked : ""})}} clickable color='primary'></Chip>:<Chip label={files} onClick={()=>{this.setState({clicked : files})}} clickable></Chip>}
          </div>
      );
    })
    return (
      <div className="App">
        <div className='container details'>
          <h2><b>Choose folder to upload file into :</b></h2>
          <div className='row'>{file}</div><br/>
          <div className = 'row'>
            <div className = 'col-12 col-sm-5'>

              <h2><b>Select files to transfer:</b></h2>
              <input type="file" className="form-control" multiple onChange={(event)=>this.handleChange(event)}/><br/>
            </div>
          </div>
            <button className = 'btn2' onClick = {this.handleClick.bind(this)}><b>Transfer</b></button><br></br>
            <br></br><Progress max="100" color="success" value={this.state.loaded} >{Math.round(this.state.loaded,2) }%</Progress>
            <h3 className = 'result'>{this.state.message}</h3>
        </div>
    
      </div>
    );
  }
}

export default App;
