import {setAxiosClient} from "./utils/axiosClient.js";
import {
    getAccountsDB,
    updateAccountData,
    setAccountsDB,
    getUnregisteredAccountsDB,
    getRegisteredAccountsDB, getWinnerAccountDB
} from "./utils/db.js";
import {getChallenge, getSignature, login} from "./login.js";
import {getProxies} from "./utils/getProxies.js";
import {answerQuiz} from "./quiz.js";
import {ethers} from "ethers";

const accounts = await getAccountsDB('dappbay');
const proxies = getProxies('proxy.txt');
const threads = 100;

const run = async (account, i) => {
    const axiosClient = setAxiosClient(proxies[i % proxies.length]);
    const challenge = await getChallenge(axiosClient, account);
    if (!challenge) {
        return;
    }
    const signature = await getSignature(account, challenge);
    if (!signature) {
        console.log(account.id, 'failed to get signature!');
        return;
    }
    const cookie = await login(axiosClient, account, signature);
    if (!cookie) {
        return;
    }
    account.cookie = cookie;
    for (let j = 0; j < 11; j++) {
        const status = await answerQuiz(axiosClient, account, j);
        if (!status) {
            console.log(account.id, "quiz failed!");
            return;
        }
    }
    await updateAccountData("dappbay", account.id, {cookie: cookie, quiz: true});
    console.log(account.id, "quiz completed.");
}

(async () => {
    let activeThreads = 0;
    console.log('Dappbay bot successfully started.');

    // Create and save wallets to DB:
    // const wallets = [...Array(200000)].map((address, privateKey) => ethers.Wallet.createRandom());
    // console.log(wallets.length);
    // await setAccountsDB("dappbay", wallets);

    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        let live = true;
        while (live === true) {
            if (activeThreads < threads) {
                live = false
                activeThreads++;
                run(account, i).then(() => activeThreads--);
            } else {
                await new Promise(r => setTimeout(r, 100));
            }
        }
    }
})();
