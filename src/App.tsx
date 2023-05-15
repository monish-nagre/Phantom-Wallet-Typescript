import React, { FC, ReactNode, useMemo, useState, useEffect } from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter
} from "@solana/wallet-adapter-wallets";
import './App.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import { Connection, PublicKey } from '@solana/web3.js';
import { CpiGuardLayout } from '@solana/spl-token';

const App: FC = () => {
  return (
    <Context>
      <Content />
    </Context>
  );
};

export default App;

const Context: FC<{ children: ReactNode }> = ({ children }) => {


  const endpoint = "https://devnet.solana.com";

  const wallet = useMemo(() => [
    new PhantomWalletAdapter(),
    // new SolflareWalletAdapter(),
    // new GlowWalletAdapter(),
    // new SlopeWalletAdapter(),
    // new TorusWalletAdapter(),
  ], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallet} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

const Content: FC = () => {
  const { publicKey } = useWallet();
  console.log(publicKey?.toBase58());
  const [balance, setBalance] = useState<number | null>(null);
  console.log("Balance", balance);
  useEffect(() => {
    const getBalance = async () => {
      if (publicKey) {
        const connection = new Connection("https://api.devnet.solana.com");
        console.log("Connection", connection);
        const balance = await connection.getBalance(new PublicKey(publicKey.toBase58()));
        setBalance(balance / 1000000000); // convert lamports to SOL

        // const rpcEndpoint_val = connection.rpcEndpoint;
        // console.log(rpcEndpoint_val)
        // const balanceandcontext = await connection.getBalanceAndContext(new PublicKey(publicKey.toBase58()));
        // console.log(balanceandcontext)
        // const timeSlot = (await connection.getSlot('confirmed')).valueOf()

        // const blockslot = await connection.getBlockTime(timeSlot.valueOf())
        // console.log(blockslot)
        const getMinimumLedgerSlot= await connection.getMinimumLedgerSlot()
        console.log(getMinimumLedgerSlot)
      }
    };
    getBalance();
  }, [publicKey]);

  return (
    <div className="App">
      <WalletMultiButton />
      {balance !== null && <p>Balance: {balance} SOL</p>}
    </div>
  )
}