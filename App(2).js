import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css'

class App extends Component {

  state = {
    isConnected:false,
    id:null,
    users:[],
    text:'',
    messages:[]
  }
  socket = null

  componentWillMount(){
    console.log(process.env.REACT_APP_NOT_SECRET_CODE);

    this.socket = io('https://codi-server.herokuapp.com');

    this.socket.on('log', stuff => console.warn('LOG',stuff))

    this.socket.on('connect', () => {
      this.setState({isConnected:true})
    })

    this.socket.on('disconnect', () => {
      this.setState({isConnected:false})
    })

    this.socket.on('pong!',(additionalStuff)=>{
      console.log('server answered!', additionalStuff)
    })

    this.socket.on('youare',(answer)=>{
      this.setState({id:answer.id})
    })

    this.socket.on('room_message',message => {
      this.setState({messages:[...this.state.messages, message]})
      console.log(message)
    })

    this.socket.on('room', old_messages => console.log(old_messages))

    this.socket.on('peeps',(peeps)=>this.setState({users:peeps}))
    this.socket.on('new connection', id => this.setState({users:[...this.state.users,id]}))
    this.socket.on('next',(text)=>console.log(text))
    this.socket.on('new disconnection', id => this.setState({users:this.state.users.filter(_id=>_id!==id)}))
    this.socket.emit('whoami')
  }

 
  componentWillUnmount(){
    this.socket.close()
    this.socket = null
  }

  onInputChange = (evt) => {
    this.setState({text:evt.target.value})
  }

  onAnswerPress = () => {
    this.socket.emit('answer', this.state.text)
  }

  onTestChatPress = () => {
    const {text} = this.state
    this.socket.emit('message', text)
    this.setState({ text:'' })
  }

  onSendChatPress = () => {
    const { text, id } = this.state
    const name = 'samar2'
    const message = ({ text, id, name })
    this.socket.emit('message', message)
    this.setState({ text:'' })
  }

  render() {
    return (
      <div className="App">
        <div>status: {this.state.isConnected ? 'connected' : 'disconnected'}</div>
        <div>id: {this.state.id}</div>
       {/*  <button onClick={()=>this.socket.emit('ping!')}>ping</button>
        <button onClick={()=>this.socket.emit('whoami')}>Who am I?</button>
        <button onClick={()=>this.socket.emit('give me next')}>next</button>
        <button onClick={()=>this.socket.emit('addition')}>equation</button>
        <button onClick={()=>this.socket.emit('hint')}>hint</button>
        <button onClick={()=>this.socket.emit('hint:addition')}>hint:addition</button>
        <br/>
        <input onChange={this.onInputChange} value={this.state.text}/>
        <button onClick={this.onAnswerPress}>answer</button>
        <button onClick={this.onTestChatPress}>test chat</button>
        <button onClick={this.onSendChatPress}>send chat</button>
        <ul>
          { this.state.users.map(u=><li key={u}>{u}</li>)}
        </ul> */}
        <div class="container-fluid h-100">
			<div class="row justify-content-center h-100">
        	<div className="col-md-8 col-xl-6 chat">
					<div className="card">
						<div className="card-header msg_head">
							<div className="d-flex bd-highlight">
							{/* 	<div className="img_cont">
									<img src="https://devilsworkshop.org/files/2013/01/enlarged-facebook-profile-picture.jpg" className="rounded-circle user_img"/>
									<span className="online_icon"></span>
								</div> */}
								<div className="user_info">
									<span>Group Chat</span>
								
								</div>
							
							</div>
						
							</div>
						
						<div className="card-body msg_card_body">
        { this.state.messages.map(m=>
m.name==='samar2'?

							<div className="d-flex justify-content-start mb-4">
								<div className="user_info">
                <span>{m.name}</span>
										</div>
								<div className="msg_cotainer">
                {m.text}
									<span className="msg_time">{m.date}</span>
								</div>
							</div>:
							<div className="d-flex justify-content-end mb-4">
              
								<div className="msg_cotainer_send">
									{m.text}
									<span className="msg_time_send">{m.date}</span>
								</div>
								<div className="user_info">
                <span>{m.name}</span>
										</div>
							</div>

					
     
        )}
        </div>
						<div className="card-footer">
							<div className="input-group">
								<div className="input-group-append">
									<span className="input-group-text attach_btn"><i className="fas fa-paperclip"></i></span>
								</div>
								<textarea name="" className="form-control type_msg" placeholder="Type your message..." onChange={this.onInputChange} value={this.state.text}></textarea>
								<div className="input-group-append">
									<span className="input-group-text send_btn"><i className="fas fa-location-arrow"> <button onClick={this.onSendChatPress}>send chat</button></i></span>
								</div>
							</div>
						</div>
            </div>
					</div>
          </div>
          </div>

 </div>
    );
  }
}

export default App;
