import { Button, Text, Input, Grid, GridItem } from "@chakra-ui/react"
import { useState, useContext, useEffect } from "react"
import { globalContext } from '../store'
import abi from "../public/Greeter.json"
import { AbiItem } from 'web3-utils'
import BeatLoader from 'react-spinners/BeatLoader'

const contractAddress = '0x4619AaCba38101bf438C2A2Ddd583AAe2A035c54'
const abiItems: AbiItem[] = JSON.parse(JSON.stringify(abi))

// REF: https://dev.to/jacobedawson/send-react-web3-dapp-transactions-via-metamask-2b8n
export default function Greeter() {
  const { globalState, dispatch } = useContext(globalContext)
  const { account, web3 } = globalState
  const [greetingText, setGreetingText] = useState("")
  // REF: https://stackoverflow.com/questions/55757761/handle-an-input-with-react-hooks
  const [greeting, greetingInput] = useInput()
  const [name, nameInput] = useInput()
  const [greetingOutput, setGreetingOutput] = useState("")
  const [greetButtonLoading, setGreetButtonLoading] = useState(false)
  const [greetingButtonLoading, setGreetingButtonLoading] = useState(false)

  function useInput() {
    const [value, setValue] = useState("")
    const input = <Input value={value} onChange={e => setValue(e.target.value)} />
    return [value, input]
  }

  function getValue() {
    console.log('GetValue')
    const contract = new web3.eth.Contract(abiItems, contractAddress)
    contract.methods.greeting().call().then((result: any) => {
      setGreetingText(result)
    });
  }

  function handleGreet() {
    console.log('handleGreet', name)
    try {
      setGreetButtonLoading(true)
      const contract = new web3.eth.Contract(abiItems, contractAddress)
      contract.methods.greet(name).call().then((result: any) => {
        setGreetingOutput(result)
        setGreetButtonLoading(false)
      }).catch((error: any) => {
        console.error('error in then...catch', error)
        setGreetButtonLoading(false)
      })
    } catch (error) {
      console.error(error)
      setGreetButtonLoading(false)
    } 
  }

  function setGreeting() {
    console.log('setGreeting')
    try {
      setGreetingButtonLoading(true)
      const contract = new web3.eth.Contract(abiItems, contractAddress)
      contract.methods.setGreeting(greeting).send({ from: account }).then((result: any) => {
        console.log('setGreeting', result)
        getValue()
        setGreetingButtonLoading(false)
      }).catch((error: any) => {
        console.error('error in then...catch', error)
        setGreetingButtonLoading(false)
      })
    } catch (error) {
      console.error('error in try...catch', error)
      setGreetingButtonLoading(false)
    } 
  }

  useEffect(() => {
    if (web3) {
      getValue()
    }
  })

  return (
    <div>
      {account ? (
        <Grid mt="5" templateColumns="repeat(2, 1fr)" templateRows="repeat(4, 1fr)" gap={3}>
          <GridItem><Text textAlign="right" fontWeight="bold">Current Value</Text></GridItem>
          <GridItem><Text>{greetingText}</Text></GridItem>
          <GridItem align="end">
            <Button isFullWidth isLoading={greetingButtonLoading}
            spinner={<BeatLoader size={8} color="grey" />} 
            onClick={setGreeting}>Set Greeting</Button>
          </GridItem>
          <GridItem>{greetingInput}</GridItem>
          <GridItem align="end">
            <Button isFullWidth isLoading={greetButtonLoading}
            spinner={<BeatLoader size={8} color="grey" />} 
            onClick={handleGreet}>Greet</Button>
          </GridItem>
          <GridItem>{nameInput}</GridItem>
          <GridItem colSpan={2}>
            <Text fontWeight="bold" textAlign="center">{greetingOutput}</Text>
          </GridItem>
        </Grid>
      ) : ""}
    </div>
  )
}