import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Component } from "react";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { apiGetAccountAssets } from "../helpers/api";

const INITIAL_STATE = {
  connector: null,
  fetching: false,
  connected: false,
  chainId: 1,
  showModal: false,
  pendingRequest: false,
  uri: "",
  accounts: [],
  address: "",
  result: null,
  assets: [],
};

class Home extends Component {

  constructor(props) {
    super(props);
    
    this.state = INITIAL_STATE;
  }

  connect = async () => {
    // bridge url
    const bridge = "https://bridge.walletconnect.org";
  
    // create new connector
    const connector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal });
  
    await this.setState({ connector });
  
    // check if already connected
    if (!connector.connected) {
      // create new session
      await connector.createSession();
    }
  
    // subscribe to events
    await this.subscribeToEvents();
  };
  
  subscribeToEvents = () => {
    const { connector } = this.state;
  
    if (!connector) {
      return;
    }
  
    connector.on("session_update", async (error, payload) => {
      console.log(`connector.on("session_update")`);
  
      if (error) {
        throw error;
      }
  
      const { chainId, accounts } = payload.params[0];
      this.onSessionUpdate(accounts, chainId);
    });
  
    connector.on("connect", (error, payload) => {
      console.log(`connector.on("connect")`);
  
      if (error) {
        throw error;
      }
  
      this.onConnect(payload);
    });
  
    connector.on("disconnect", (error, payload) => {
      console.log(`connector.on("disconnect")`);
  
      if (error) {
        throw error;
      }
  
      this.onDisconnect();
    });
  
    if (connector.connected) {
      const { chainId, accounts } = connector;
      const address = accounts[0];
      this.setState({
        connected: true,
        chainId,
        accounts,
        address,
      });
      this.onSessionUpdate(accounts, chainId);
    }
  
    this.setState({ connector });
  };
  
  killSession = async () => {
    const { connector } = this.state;
    if (connector) {
      connector.killSession();
    }
    this.resetApp();
  };

  resetApp = async () => {
    await this.setState({ ...INITIAL_STATE });
  };

  onConnect = async (payload) => {
    const { chainId, accounts } = payload.params[0];
    const address = accounts[0];
    await this.setState({
      connected: true,
      chainId,
      accounts,
      address,
    });
    this.getAccountAssets();
  };

  getAccountAssets = async () => {
    const { address, chainId } = this.state;
    this.setState({ fetching: true });
    try {
      // get account balances
      const assets = await apiGetAccountAssets(address, chainId);

      await this.setState({ fetching: false, address, assets });
    } catch (error) {
      console.error(error);
      await this.setState({ fetching: false });
    }
  };

  onDisconnect = async () => {
    this.resetApp();
  };

  onSessionUpdate = async (accounts, chainId) => {
    const address = accounts[0];
    await this.setState({ chainId, accounts, address });
    await this.getAccountAssets();
  };


  render() {
    const title = 'Ethereum dApps Next.js Boiletplate'
    const { connected, chainId, address, assets, connector } = this.state
    return (
      <div className={styles.container}>
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
            A simple dApps to demo the integration of WalletConnect and Greeter smart contract.
          </p>

          {!connected ?
            (<button type="button" onClick={this.connect}>Connect to Wallet</button>)
          : ( <>
              <h2>Connected</h2>
              <ul>
              <li>
                Chain Id: <strong>{chainId}</strong>
              </li>
              <li>
                Address: <strong>{address}</strong>
              </li>
              <li>
                Assets:
                <ul> 
                {
                  assets.map(asset => {
                    const balanceInDecimals = (asset.balance * ('0.' + '1'.padStart(asset.decimals, '0'))).toFixed(5)
                    return <li key={asset.symbol}>{asset.symbol} {balanceInDecimals}</li>
                  })
                }
                </ul>
              </li>
              <li>
                Wallet: <strong>{connector._peerMeta.description}</strong>
              </li>
              </ul>
              <button type="button" onClick={this.killSession}>Disconnect</button>
             </>
            )
          }            
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
              <Image src="/logos/walletconnect.png" alt="WalletConnect Logo" width={144} height={32} />
            </span>
        </footer>
      </div>
    )
  }
}

export default Home
