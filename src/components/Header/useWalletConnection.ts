import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { walletClient } from "../../client/client";
import { setTransactionResult } from "../Product/Product";

export const accountAtom = atom<string | null>(null);

const useWalletConnection = () => {
    const [account, setAccount] = useAtom(accountAtom);
    const [, setResult] = useAtom(setTransactionResult)

    useEffect(() => {
        // not store connected wallet in localStorage
        // for some reasone user can disconnect wallet (possible without an opened page), and u display incorrect data
        const savedAccount = localStorage.getItem("connectedAccount");
        if (savedAccount) {
          setAccount(savedAccount);
        }

        if (window.ethereum) {
          window.ethereum.on("accountsChanged", handleAccountsChanged);
        }

        return () => {
          if (window.ethereum) {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
          }
        };
      }, []);

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount(null);
        localStorage.removeItem("connectedAccount");
      } else {
        setAccount(accounts[0]);
        localStorage.setItem("connectedAccount", accounts[0]);
      }
      setResult(null)
    };

    const connectMetaMask = async () => {
      try {
        if (!window.ethereum) {
          alert("MetaMask is not installed!");
          return;
        } else{
            const accounts = await walletClient.request({ method: "eth_requestAccounts" });
            const selectedAccount = accounts[0];
            setAccount(selectedAccount);
            localStorage.setItem("connectedAccount", selectedAccount);
        }
      } catch (error) {
        console.error("Error installing wallet", error);
      }
    };

    return { account, connectMetaMask };
  };

  export default useWalletConnection;
