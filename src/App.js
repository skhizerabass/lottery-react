import logo from "./logo.svg";
import "./App.css";
import web3 from "./services/web3";
import lottery from "./services/contracts/lottery";
import { useEffect, useState } from "react";

function App() {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    initContract();
  }, []);

  const initContract = async () => {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    setPlayers(players);
    setManager(manager);
    setBalance(balance);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value,'ether'),
    });
    setMessage('Entering Transaction Success');
  };

  const pickWinner = async() =>{
    const accounts = await web3.eth.getAccounts();
    setMessage('Waiting on transaction success....');
    await lottery.methods.pickWinner().send({
      from: accounts[0]
      });
      setMessage('A winner has been picked!');

  }
  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}</p>
      <p>Total number of players playing {players.length}</p>
      <p>Total Balance {web3.utils.fromWei(balance, "ether")} ether</p>

      <hr />

      <form>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <br/>
          <input
            onChange={(event) => {
              setValue(event.target.value);
            }}
            name="testing"
            defaultValue={value}
            placeholder="type here"
            type={'text'}
          />
          <br />
          <br />

          <button onClick={onSubmit}>Enter</button>
        </div>
      </form>
      <hr/>

      <h4>Ready to pick a winner?</h4>
      <button onClick={pickWinner}>Pick a Winner!</button>
      <hr/>
      <h2>{message}</h2>

    </div>
  );
}

export default App;
