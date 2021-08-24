import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'

export async function detectInjectedProvider()  {
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
  console.log('accounts', accounts)
  return { account: accounts[0], provider, web3 }
}

