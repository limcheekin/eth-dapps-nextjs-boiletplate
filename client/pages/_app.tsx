import '../styles/globals.css'
import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { GlobalStore } from '../store'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <GlobalStore>
            <ChakraProvider>
                <Component {...pageProps} />
            </ChakraProvider>
        </GlobalStore>
    )
}
