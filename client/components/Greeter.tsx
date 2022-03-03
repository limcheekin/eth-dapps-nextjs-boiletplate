import { Text, Grid, GridItem } from "@chakra-ui/react"
import { useState, useContext, useEffect } from "react"
import { globalContext } from '../store'
import GreeterContract from "../public/Greeter.json"
import { AbiItem } from 'web3-utils'
import { useButton, useInput } from '../hooks/ui'

// REF: https://dev.to/jacobedawson/send-react-web3-dapp-transactions-via-metamask-2b8n
export default function Greeter() {
  const { globalState, dispatch } = useContext(globalContext)
  const { account, web3 } = globalState
  const [greetingText, setGreetingText] = useState("")
  const [greetingOutput, setGreetingOutput] = useState("")
  const [greetingButtonLoading, greetingButton] = useButton(setGreeting, 'Set Greeting')
  const [greeting, greetingInput] = useInput(greetingButtonLoading as boolean)
  const [greetButtonLoading, greetButton] = useButton(handleGreet, 'Greet')
  const [greet, greetInput] = useInput(greetButtonLoading as boolean)
  const contractAddress = process.env.NEXT_PUBLIC_GREETER_CONTRACT_ADDRESS
  const abiItems: AbiItem[] = web3 && GreeterContract.abi as AbiItem[]
  const contract = web3 && contractAddress && new web3.eth.Contract(abiItems, contractAddress)
    
  function getGreeting() {
    console.log('getGreeting')
    contract.methods.greeting().call().then((result: any) => {
      setGreetingText(result)
    });
  }

  async function handleGreet() {
    console.log('handleGreet', greet)
    try {
      const result = await contract.methods.greet(greet).call()
      setGreetingOutput(result)
    } catch (error) {
      console.error(error)
    } 
  }

  async function setGreeting() {
    console.log('setGreeting')
    try {
      const result = await contract.methods.setGreeting(greeting).send({ from: account })
      console.log('result', result)
      getGreeting()
    } catch (error) {
      console.error('error in try...catch', error)
    } 
  }

  useEffect(() => {
    if (contract) {
      getGreeting()
    }
  })

  return (
    <div>
      { 
        account && (
        <Grid mt="5" templateColumns="repeat(2, 1fr)" templateRows="repeat(4, 1fr)" gap={3}>
          <GridItem><Text textAlign="right" fontWeight="bold">Greeting</Text></GridItem>
          <GridItem><Text>{greetingText}</Text></GridItem>
          <GridItem alignItems="end">{greetingButton}</GridItem>
          <GridItem>{greetingInput}</GridItem>
          <GridItem alignItems="end">{greetButton}</GridItem>
          <GridItem>{greetInput}</GridItem>
          <GridItem colSpan={2}>
            <Text fontWeight="bold" textAlign="center">{greetingOutput}</Text>
          </GridItem>
        </Grid>
        ) 
      }
    </div>
  )
}