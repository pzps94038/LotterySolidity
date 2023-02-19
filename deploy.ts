const HDWalleProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface: face, bytecode: data } = require('./compile');
const provider = new HDWalleProvider(
  'region cactus pencil broom potato effort loud machine jacket annual town turn',
  'https://goerli.infura.io/v3/4f8732b887714942bb7981e66cea04e0'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const [from] = await web3.eth.getAccounts() as string[];
  
  const result = await new web3.eth.Contract(JSON.parse(face))
    .deploy({ data })
    .send({ gas: 1000000, from });
  // 看合約內容
  console.log(face);
  // 合約地址
  console.log(result.options.address);
};
deploy();