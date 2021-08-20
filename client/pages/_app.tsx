import '../styles/globals.css'
import { AppProps } from 'next/app'
import { DAppProvider } from '@usedapp/core'
import { ChakraProvider } from '@chakra-ui/react'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <DAppProvider config={{}}>
            <ChakraProvider>
                <Component {...pageProps} />
            </ChakraProvider>
        </DAppProvider>
    )
}
