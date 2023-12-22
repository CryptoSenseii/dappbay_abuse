import {ethers} from "ethers";

export const getChallenge = async (axiosClient, account) => {
    try {
        return await axiosClient.post("https://dappbay.bnbchain.org/api/v1/user/challenge", {
            address: account.address
        }, {
            headers: {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9,ru;q=0.8,uk;q=0.7",
                "content-type": "application/json",
                "Referer": "https://dappbay.bnbchain.org/campaign/avengerdao-10k-usdt"
            }
        }).then(({data}) => data.challenge);
    } catch (err) {
        console.log(account.id, "getChallenge error!");
    }
}

export const getSignature = async (account, message) => {
    const wallet = new ethers.Wallet(account.privateKey);
    return wallet.signMessage(message);
}

export const login = async (axiosClient, account, signature) => {
    try {
        return await axiosClient.post("https://dappbay.bnbchain.org/api/v1/user/login", {
            address: account.address,
            signedMsg: signature
        }, {
            headers: {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9,ru;q=0.8,uk;q=0.7",
                "content-type": "application/json",
                "Referer": "https://dappbay.bnbchain.org/campaign/avengerdao-10k-usdt"
            }
        }).then((data) => data.headers['set-cookie'][0]);
    } catch (err) {
        console.log(account.id, "login error!");
    }
}
