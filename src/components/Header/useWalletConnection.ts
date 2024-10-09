import { useAccount, useBalance, useConnect } from "wagmi";
import { injected } from 'wagmi/connectors'


const useWalletConnection = () => {
    const { address: account, isConnected } = useAccount();
    const { connect, error: connectError } = useConnect({});
    const { data: balanceData } = useBalance({
        address: account
      });
  
    const connectMetaMask = () => {
        try {
         connect({ connector: injected() });
        } catch (error) {
          console.error('Error connecting wallet', error);
        }
      };
    
      return { account, isConnected, connectMetaMask, connectError, balanceData };
  };
  
  export default useWalletConnection;