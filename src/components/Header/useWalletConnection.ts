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
            if (typeof window.ethereum === 'undefined') {
                alert("MetaMask is not installed. Please install it to use this feature.");
            } 
            connect({ connector: injected() });
        } catch (error) {
            console.error('Error connecting wallet', error);
        }
      };
    
      return { account, isConnected, connectMetaMask, connectError, balanceData };
};
  
export default useWalletConnection;