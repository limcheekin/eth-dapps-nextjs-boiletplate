import { Button, Box, Text, SimpleGrid } from "@chakra-ui/react";
import Identicon from "./Identicon";
import { handleInjectedProvider, handleWalletConnect } from "../lib";
import { useContext, useState } from 'react';
import { globalContext } from '../store'
import BeatLoader from 'react-spinners/BeatLoader'


type Props = {
  handleOpenModal: any
};

export default function ConnectButton({ handleOpenModal }: Props) {
  const { globalState, dispatch } = useContext(globalContext)
  const [ etherBalance, setEtherBalance ] = useState(0)
  const [ loading, setLoading ] = useState(false)
  const [ walletConnectLoading, setWalletConnectLoading ] = useState(false)

  async function handleConnectWallet(wallet: string)  {
    wallet === 'WalletConnect' ? setWalletConnectLoading(true) : setLoading(true)
    try {
      const { account, web3 } = wallet === 'WalletConnect' ? 
        await handleWalletConnect(dispatch):
        await handleInjectedProvider(dispatch)
      const balance = await web3.eth.getBalance(account)
      console.log('balance', balance)
      setEtherBalance(parseInt(balance)/1e18)
    } catch (error) {
      console.error(error)  
    } finally {
      wallet === 'WalletConnect' ? setWalletConnectLoading(false) : setLoading(false)
    }
  }
  // console.log('globalState', globalState)
  return globalState.account ? (
    <Box
      mt={3}
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
    <SimpleGrid mt={3} columns={2} spacing={3}>
      <Button
        isLoading={loading}
        spinner={<BeatLoader size={8} color="white" />}
        onClick={() => handleConnectWallet('MetaMask')}
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
        Connect with MetaMask
      </Button>
      <Button
        isLoading={walletConnectLoading}
        spinner={<BeatLoader size={8} color="white" />}
        onClick={() => handleConnectWallet('WalletConnect')}
        bg="gray.800"
        color="gray.300"
        fontSize="lg"
        fontWeight="medium"
        borderRadius="xl"
        border="1px solid transparent"
        _hover={{
          borderColor: "gray.700",
          color: "gray.400",
        }}
        _active={{
          backgroundColor: "gray.800",
          borderColor: "gray.700",
        }}
      >
        Connect with WalletConnect
      </Button>
    </SimpleGrid>
  );
}
