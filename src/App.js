import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
var web3
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'Detecting web3...',
      account: false,
      network: false,
    };
  }
  componentDidMount(){
    window.addEventListener('load',this.detectWeb3.bind(this))
  }
  detectWeb3(){
    this.setState({status:"Detecting web3..."})
    //Adapted from https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md
    if (typeof web3 !== 'undefined' && typeof web3.currentProvider !== 'undefined') {
      web3 = new Web3(web3.currentProvider)
      this.setState({status:"web3 ready (provider: web3.currentProvider)"})
      this.web3Ready()
    } else if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
      web3 = new Web3(window.web3.currentProvider)
      this.setState({status:"web3 ready (provider: window.web3.currentProvider)"})
      this.web3Ready()
    } else {
      // set the provider you want from Web3.providers
      // web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
      this.setState({status:"web3 not detected"})
      setTimeout(()=>{
        this.detectWeb3()
      },500)
    }
  }
  web3Ready(){
    this.setState({network:"Loading Network..."})
    web3.eth.net.getId().then((network)=>{
      this.setState({network:network})
      this.setState({account:"Loading Account..."})
      web3.eth.getAccounts().then((accounts)=>{
        if(!accounts[0]){
          this.setState({account:"Failed to load accounts, unlock metamask?"})
        }else{
          this.setState({account:accounts[0]})
        }
        setTimeout(()=>{
          this.web3Ready()
        },3000)
      })
    })
  }
  render() {
    let network = ""
    if(this.state.network){
      network= (
        <div style={{padding:10}}>
          Network: {this.state.network}
        </div>
      )
    }
    let account = ""
    if(this.state.account){
      account= (
        <div style={{padding:10}}>
          Account: {this.state.account}
        </div>
      )
    }
    return (
      <div className="App" style={{padding:50}}>
        <p>Use <a href={"https://web3.wtf/?cache="+Date.now()}>web3.wtf</a> or <a href={"https://web3.wtf/test.html?cache="+Date.now()}>vanilla js version</a> to test web3 injection with this open source super simple create-react-app</p>
        {this.state.status}
        {network}
        {account}
      </div>
    );
  }
}

export default App
