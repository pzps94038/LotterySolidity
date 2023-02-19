import { describe, beforeEach } from 'mocha';
const { interface: face, bytecode: data } = require('../compile');
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider()); // choose new-work
let lottery: any;
let account: string[];
beforeEach(async()=> {
  account = await web3.eth.getAccounts() as string[];
  const [from] = account;
  lottery = await new web3.eth.Contract(JSON.parse(face))
    .deploy({ data })
    .send({ from, gas: 1000000 });
});

describe('Lottery', ()=> {
  it('deploys a contract', ()=> {
    assert.ok(lottery.options.address);
  });

  it('enter player', async()=> {
    const [from] = account;
    const value = web3.utils.toWei('2', 'ether');
    await lottery.methods.enter().send({ from, value });
    const players = await lottery.methods.getPlayers().call();
    assert.equal(from, players[0]);
    assert.equal(1, players.length);
  });

  it('enter mutiple player', async()=> {
    const value = web3.utils.toWei('2', 'ether');
    const enters = [] as Promise<void>[];;
    for(const from of account) {
      enters.push(lottery.methods.enter().send({ from, value }));
    }
    await Promise.all(enters);
    const players = await lottery.methods.getPlayers().call();
    assert.equal(account.length, players.length);
  });

  it('require a min amount of wei to enter', async()=> {
    let isEnter = false;
    try{
      const [from] = account;
      const value = web3.utils.toWei('0.1', 'wei');
      await lottery.methods.enter().send({ from, value });
      isEnter = true;
      assert(!isEnter);
    } catch(err) {
      assert(!isEnter);
    }
  });

  it('require ManagerOnly', async()=> {
    let isEnter = false;
    try{
      const [from] = account;
      await lottery.methods.pickWinner().send({ from });
      assert(!isEnter);
    } catch(err) {
      assert(!isEnter);
    }
  });

  it('sends money to the winner and reset the player array', async()=> {
    const [from] = account;
    const value = web3.utils.toWei('2', 'ether');
    await lottery.methods.enter().send({ from, value });
    const initialBalance = await web3.eth.getBalance(from);
    await lottery.methods.pickWinner().send({ from });
    const finalBalance = await web3.eth.getBalance(from);
    const difference =  finalBalance - initialBalance;
    const players = await lottery.methods.getPlayers().call();
    assert.equal(0, players.length);
    assert(difference >  web3.utils.toWei('1.8', 'ether'));
  })
})