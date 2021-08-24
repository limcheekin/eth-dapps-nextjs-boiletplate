import abi from "../abi/Greeter.json"
import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'

const contractAddress = '0x4619AaCba38101bf438C2A2Ddd583AAe2A035c54'
const contractInterface = abi

export async function useInjectedProvider()  {
  const injectedProvider: any = await detectEthereumProvider()
  let provider: any

  if (injectedProvider) {
    console.log(`Injected web3 detected.`)
    provider = injectedProvider
  } else {
    console.log(`No web3 instance injected, using Local web3.`)
    provider = new Web3.providers.HttpProvider('http://localhost:7545')
  }  
  const web3 = new Web3(provider)
  const accounts = await web3.eth.getAccounts()
  return { account: accounts[0], provider, web3 }
}

