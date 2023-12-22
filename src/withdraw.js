import {ethers} from "ethers";
import {getProxies} from "./utils/getProxies.js";
import {
    getAccountsDB,
    updateAccountData,
    setAccountsDB,
    getUnregisteredAccountsDB,
    getRegisteredAccountsDB,
    getWinnerAccountDB,
    getAccountsWithPrize
} from "./utils/db.js";

const provider = new ethers.JsonRpcProvider('https://rpc.ankr.com/bsc');

const withdraw = async (walletFrom, walletTo, amount) => {
    try {
        const recipientAddress = walletTo;
        const contractAddress = '0x55d398326f99059fF775485246999027B3197955';
        const tokenAbi = ["function balanceOf(address) view returns (uint256)", "function transfer(address to, uint256 value) returns (bool)"];
        const tokenContract = new ethers.Contract(contractAddress, tokenAbi, provider);
        const wallet = new ethers.Wallet(walletFrom.privateKey, provider);
        const tokenWithSigner = tokenContract.connect(wallet);
        const hash = (await tokenWithSigner.transfer(recipientAddress, amount)).hash;
        console.log(hash);
        return hash;
    } catch (error) {
        console.log(walletFrom.id, error.message);
    }
}

const getTokenBalance = async (wallet) => {
    try {
        const contractAddress = "0x55d398326f99059fF775485246999027B3197955";
        const tokenAbi = ["function balanceOf(address) view returns (uint256)"];
        const tokenContract = new ethers.Contract(contractAddress, tokenAbi, provider);
        return  await tokenContract.balanceOf(wallet.address);
    } catch (error) {
        console.log(wallet.id, error.message);
    }
}

const sendBNB = async (walletFrom, walletTo, amount, gasPrice) => {
    const wallet = new ethers.Wallet(walletFrom.privateKey, provider);
        let nonce = await wallet.getNonce();
        const tx = {
            'to': walletTo.address,
            'value': ethers.parseUnits(amount, 'ether'),
            'gas': 30000,
            'gasPrice': gasPrice,
            'nonce': nonce,
        };
        const txResponse = await wallet.sendTransaction(tx);
        console.log(walletTo.id, txResponse.hash);
        console.log('waiting 5 seconds...');
        await new Promise(r => setTimeout(r, 5000));
}

(async () => {
    const wallets = await getAccountsWithPrize("dappbay");

    for (let i = 0; i < wallets.length; i++) {
        try {
            const wallet = wallets[i];
            const amount = await getTokenBalance(wallet);
            if (await getTokenBalance(wallet) <= 0) {
                console.log(wallet.id, "insuffisient balance", amount);
                continue;
            }
            await withdraw(wallet, "address :)", amount);
            await new Promise(r => setTimeout(r, 10000));
            // await sendBNB({privateKey: 'private key :)'}, wallet, '0.0003', '1100000000');
        } catch (error) {
            console.log(i, error.message);
        }
    }
})();
