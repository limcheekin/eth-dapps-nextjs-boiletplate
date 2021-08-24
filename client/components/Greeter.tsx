import { Button, Text, Input, Grid, GridItem } from "@chakra-ui/react"
import { useState, useContext, useEffect } from "react"
import { globalContext } from '../store'
import abi from "../abi/Greeter.json"
import { AbiItem } from 'web3-utils'

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

  function useInput() {
    const [value, setValue] = useState("")
    const input = <Input value={value} onChange={e => setValue(e.target.value)} />
    return [value, input]
  }

  function getValue() {
    console.log('GetValue')
    const contract = new web3.eth.Contract(abiItems, contractAddress)
    contract.methods.greeting().call().then(function (result: any) {
      setGreetingText(result)
    });
  }

  function handleGreet() {
    console.log('handleGreet', name)
    const contract = new web3.eth.Contract(abiItems, contractAddress)
    contract.methods.greet(name).call().then(function (result: any) {
      setGreetingOutput(result)
    });
  }

  function setValue() {
    console.log('SetValue')
    const contract = new web3.eth.Contract(abiItems, contractAddress)
    contract.methods.setGreeting(greeting).send({ from: account }).then(function (result: any) {
      console.log('SetValue', result)
      getValue()
    });
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
          <GridItem align="end"><Button isFullWidth onClick={setValue}>Set Value</Button></GridItem>
          <GridItem>{greetingInput}</GridItem>
          <GridItem align="end"><Button isFullWidth onClick={handleGreet}>Greet</Button></GridItem>
          <GridItem>{nameInput}</GridItem>
          <GridItem colSpan={2}>
            <Text fontWeight="bold" textAlign="center">{greetingOutput}</Text>
          </GridItem>
        </Grid>
      ) : ""}
    </div>
  )
}