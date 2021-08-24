import { Button, Box, Text } from "@chakra-ui/react";
import { formatEther } from "@ethersproject/units";
import Identicon from "./Identicon";
import { useInjectedProvider } from "../hooks";
import { useContext, useState } from 'react';
import { globalContext } from '../store'

type Props = {
  handleOpenModal: any;
};

export default function ConnectButton({ handleOpenModal }: Props) {
  const { globalState, dispatch } = useContext(globalContext)
  const [ etherBalance, setEtherBalance] = useState(0);

  async function handleConnectWallet()  {
    const { account, provider, web3 } = await useInjectedProvider();
    setEtherBalance(parseFloat(formatEther(
      await web3.eth.getBalance(account)
    )))
    dispatch({ type: 'SET_ACCOUNT', payload: account })
    dispatch({ type: 'SET_PROVIDER', payload: provider })
    dispatch({ type: 'SET_WEB3', payload: web3 })
  }

  console.log('globalState', globalState)

  return globalState.account ? (
    <Box
      display="flex"
      alignItems="center"
      background="gray.700"
      borderRadius="xl"
      py="0"
    >
      <Box px="3">
        <Text color="white" fontSize="md">
          {etherBalance.toFixed(3)} ETH
        </Text>
      </Box>
      <Button
        onClick={handleOpenModal}
        bg="gray.800"
        border="1px solid transparent"
        _hover={{
          border: "1px",
          borderStyle: "solid",
          borderColor: "blue.400",
          backgroundColor: "gray.700",
        }}
        borderRadius="xl"
        m="1px"
        px={3}
        height="38px"
      >
        <Text color="white" fontSize="md" fontWeight="medium" mr="2">
          {globalState.account &&
            `${globalState.account.slice(0, 6)}...${globalState.account.slice(
              globalState.account.length - 4,
              globalState.account.length
            )}`}
        </Text>
        <Identicon />
      </Button>
    </Box>
  ) : (
    <Button
      onClick={handleConnectWallet}
      bg="blue.800"
      color="blue.300"
      fontSize="lg"
      fontWeight="medium"
      borderRadius="xl"
      border="1px solid transparent"
      _hover={{
        borderColor: "blue.700",
        color: "blue.400",
      }}
      _active={{
        backgroundColor: "blue.800",
        borderColor: "blue.700",
      }}
    >
      Connect to MetaMask
    </Button>
  );
}
