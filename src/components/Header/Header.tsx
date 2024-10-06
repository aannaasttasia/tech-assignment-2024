import "./css/Header.scss";
import useWalletConnection from "./useWalletConnection";

function Header() {
  const { account, connectMetaMask } = useWalletConnection();

  const handleClick = () => {
    if (account) {
      alert("Your account is already connected");
      return;
    }
    connectMetaMask();
  };

  return (
    <header>
      <div className="header_logo">aannaasttasia</div>
      <div className="header_account">
        <div className="header_wallet" onClick={handleClick}>
          {account ? "Connected" : "Connect wallet"}
        </div>
        <div className="header_title">
          Internet <span className="header_shop">Shop</span>{" "}
        </div>
      </div>
    </header>
  );
}

export default Header;
