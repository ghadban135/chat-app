import React, { Component } from "react";
import io from "socket.io-client";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

class App extends Component {
  state = {
    isConnected: false,
    id: null,
    userList: [],
    message_from_server: "",
    inputResult: "",
    chat: [],
    showEmojis: false
  };
  socket = null;
  showEmojis = e => {
    this.setState(
      {
        showEmojis: true
      },
      () => document.addEventListener("click", this.closeMenu)
    );
  };

  closeMenu = e => {
    console.log(this.emojiPicker);
    if (this.emojiPicker !== null && !this.emojiPicker.contains(e.target)) {
      this.setState(
        {
          showEmojis: false
        },
        () => document.removeEventListener("click", this.closeMenu)
      );
    }
  };
  handleChange = e => {
    this.setState({ inputResult: e.target.value });
  };
  componentWillMount() {
    this.socket = io("https://codi-server.herokuapp.com");

    this.socket.on("connect", () => {
      this.setState({ isConnected: true });
    });

    this.socket.on("disconnect", () => {
      this.setState({ isConnected: false });
    });
    this.socket.on("youare", answer => {
      this.setState({ id: answer.id });
    });
    this.socket.on("peeps", data => {
      this.setState({ userList: data });
    });
    this.socket.on("new connection", NewUser => {
      console.log("new connection", NewUser);
      const users = [...this.state.userList, NewUser];
      this.setState({ userList: users });
    });
    this.socket.on("new disconnection", DisconnectUser => {
      console.log("new disconnection", DisconnectUser);
      const filteredUsers = this.state.userList.filter(function(item) {
        return item !== DisconnectUser;
      });
      this.setState({ userList: filteredUsers });
    });

    /** this will be useful way, way later **/
    this.socket.on("room", old_messages => {
      this.setState({ chat: old_messages });
      console.log(old_messages);
    });
  }

  componentWillUnmount() {
    this.socket.close();
    this.socket = null;
  }
  handleSubmit(event) {
    event.preventDefault();
  }
  addEmoji = e => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach(el => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    this.setState({
      inputResult: this.state.inputResult + emoji
    });
  };

  render() {
    return (
      <div className="App">
        <div style={{ color: "white" }}>
          status: {this.state.isConnected ? "connected" : "disconnected"}
        </div>
        <div style={{ color: "white" }}>id: {this.state.id}</div>
        {/* <button onClick={() => this.socket.emit("whoami")}>Who am I?</button> */}
        <br />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              marginLeft: "70px",
              width: "60%"
            }}
          >
            <div
              style={{
                border: "solid 0px",
                backgroundColor: "#75a7d1",
                width: "100%",
                borderRadius: "20px",
                paddingRight: "25px",
                color: "white",
                marginRight: "10px",
                display: "block",
                height: "400px",
                overflowY: "auto"
              }}
            >
              <table cellspacing="10" style={{ width: "100%" }}>
                {this.state.chat.map(user => (
                  <tr>
                    <td>{user.name}</td>

                    <td
                      style={{
                        border: "solid 0px",
                        backgroundColor: "green",
                        borderRadius: "10px",
                        width: "100%",
                        padding: "6px 5px"
                      }}
                    >
                      {user.text}
                    </td>
                  </tr>
                ))}
              </table>
            </div>
          </div>
          <div style={{ marginRight: "30px" }}>
            <div
              style={{
                border: "solid",
                color: "white",
                backgroundColor: "#75a7d1",
                padding: "10px",
                borderRadius: "20px",
                display: "block",
                height: "400px",
                overflowY: "scroll"
              }}
            >
              <div style={{ textAlign: "center" }}>Online User IDs:</div>
              <ol>
                {this.state.userList.map(user => (
                  <li>{user}</li>
                ))}
              </ol>
              <div style={{ textAlign: "center" }}>
                Online Users:{this.state.userList.length}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#75a7d1",
            width: "58%",
            marginLeft: "70px",
            borderRadius: "10px"
          }}
        >
          <form onSubmit={this.handleSubmit}>
            <input
              value={this.state.inputResult}
              onChange={this.handleChange}
              placeholder="Type your message ..."
              size="50"
              style={{ marginLeft: "100px" }}
            ></input>
            <button
              onClick={() => {
                this.socket.emit("message", {
                  id: this.state.id,
                  name: "Ghadban",
                  text: this.state.inputResult
                });

                this.setState({ inputResult: "" });
              }}
            >
              send
            </button>
          </form>
        </div>
        {this.state.showEmojis ? (
          <span
            style={{
              marginLeft: "415px",
              marginTop: "-460px",
              position: "absolute"
            }}
            ref={el => (this.emojiPicker = el)}
          >
            <Picker
              onSelect={this.addEmoji}
              emojiTooltip={true}
              title="weChat"
            />
          </span>
        ) : (
          <p
            style={{
              marginLeft: "600px",
              marginTop: "-25px",
              position: "absolute"
            }}
            onClick={this.showEmojis}
          >
            {String.fromCodePoint(0x1f60a)}
          </p>
        )}
        <br />
        <br />
        <br />
      </div>
    );
  }
}

export default App;
