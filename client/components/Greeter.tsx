import { Button, Text, Input, Grid, GridItem } from "@chakra-ui/react"
import { useState, useContext } from "react"
import { globalContext } from '../store'
import abi from "../abi/Greeter.json"

const contractAddress = '0x4619AaCba38101bf438C2A2Ddd583AAe2A035c54'

// REF: https://dev.to/jacobedawson/send-react-web3-dapp-transactions-via-metamask-2b8n
export default function Greeter() {
  const { globalState, dispatch } = useContext(globalContext)
  const { account, web3 } = globalState
  const greeting = 1234
  // REF: https://stackoverflow.com/questions/55757761/handle-an-input-with-react-hooks
  const [name, nameInput] = useInput();
  const [greetingOutput, setGreetingOutput] = useState("");

  function useInput() {
    const [value, setValue] = useState("")
    const input = <Input value={value} onChange={e => setValue(e.target.value)} />
    return [value, input]
  }

  function handleGreet() {
    console.log('name', name)
    //greet(name.toString())
    setGreetingOutput(name.toString())
  }

  return (
    <div>
      {account ? (
        <Grid mt="5" templateColumns="repeat(2, 1fr)" templateRows="repeat(4, 1fr)" gap={3}>
          <GridItem><Text textAlign="right" fontWeight="bold">Current Value</Text></GridItem>
          <GridItem><Text>{greeting}</Text></GridItem>
          <GridItem align="end"><Button>Set Value</Button></GridItem>
          <GridItem><Input id="value" /></GridItem>
          <GridItem align="end"><Button onClick={handleGreet}>Greet</Button></GridItem>
          <GridItem>{nameInput}</GridItem>
          <GridItem colSpan={2}>
            <Text fontWeight="bold" textAlign="center">{greetingOutput}</Text>
          </GridItem>
        </Grid>
      ) : ""}
    </div>
  )
}