import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Component } from 'react'
import Layout from '../components/Layout'
import ConnectButton from '../components/ConnectButton'
import { useDisclosure } from '@chakra-ui/react'
import AccountModal from '../components/AccountModal'
import Greeter from '../components/Greeter'

function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const title = 'Ethereum dApps Next.js Boiletplate'
  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={title} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://github.com/limcheekin/eth-dapps-nextjs-boiletplate">{title}</a>
        </h1>

        <p className={styles.description}>
          A simple dApps to demo the integration of MetaMask, WalletConnect and Greeter smart contract.
        </p>

        {
        // Our connect button will only handle opening
        }
        <ConnectButton handleOpenModal={onOpen} />
        {
        // Our Account modal will handle open state & closing
        }
        <AccountModal isOpen={isOpen} onClose={onClose} />
        <Greeter />
      </main>

      <footer className={styles.footer}>
        Powered by{' '}
        <span className={styles.logo}>
          <Image src="/logos/ethereum.png" alt="Ethereum Logo" width={144} height={32} />
        </span>
        <span className={styles.logo}>
          <Image src="/logos/nextjs.png" alt="NextJS Logo" width={64} height={32} />
        </span>
        <span className={styles.logo}>
          <Image src="/logos/metamask.png" alt="MetaMask Logo" width={128} height={32} />
        </span>
        <span className={styles.logo}>
          <Image src="/logos/walletconnect.png" alt="WalletConnect Logo" width={128} height={32} />
        </span>      
      </footer>
    </Layout>
  )
}


export default Home
