import { useEthers } from "@usedapp/core"
import { Button, Text, Input, Grid, GridItem } from "@chakra-ui/react"

export default function Greeter() {
    const { library } = useEthers()

    return (
        <div>
          {library ? (
          <Grid mt="5" templateColumns="repeat(2, 1fr)" templateRows="repeat(4, 1fr)" gap={3}>
            <GridItem><Text textAlign="right" fontWeight="bold">Current Value</Text></GridItem>
            <GridItem><Text>12345</Text></GridItem>
            <GridItem align="end"><Button>Set Value</Button></GridItem>
            <GridItem><Input id="value" /></GridItem>
            <GridItem align="end"><Button>Greet</Button></GridItem>
            <GridItem><Input id="greet" /></GridItem>
            <GridItem colSpan={2}>
              <Text fontWeight="bold" textAlign="center">{ /* greeting */ }</Text>
            </GridItem>
          </Grid>
          ) : ""}
        </div>
    )
}