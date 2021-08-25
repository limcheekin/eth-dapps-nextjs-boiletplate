import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'
import { Dispatch } from 'react'
import { ActionType } from '../store/types'


export async function handleInjectedProvider(dispatch: Dispatch<ActionType>)  {
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
  // REF: https://docs.metamask.io/guide/getting-started.html#connecting-to-metamask
  const accounts = await provider.request({ method: 'eth_requestAccounts' });
  // const accounts = await web3.eth.getAccounts()
  console.log('accounts', accounts, 'isMetaMask', provider.isMetaMask)
  dispatch({ type: 'SET_ACCOUNT', payload: accounts[0] })
  dispatch({ type: 'SET_PROVIDER', payload: provider })
  dispatch({ type: 'SET_WEB3', payload: web3 })
  return { account: accounts[0], web3 }
}

