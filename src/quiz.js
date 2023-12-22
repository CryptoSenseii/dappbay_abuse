const QUIZ_ANSWERS = [
    ["C","B","C"],
    ["A","C","A"],
    ["B","C","B"],
    ["C","B","B"],
    ["B","B","B"],
    ["B","C","A"],
    ["A","B","C"],
    ["B","B","A"],
    ["A","C","C"],
    ["B","C","C"],
    ["C","A","C"]
];

export const answerQuiz = async (axiosClient, account, quizId) => {
    try {
        return await axiosClient.post("https://dappbay.bnbchain.org/api/v1/avenger-dao-le-campaign/answer-quiz", {
            quizIdx: quizId,
            answers: QUIZ_ANSWERS[quizId]
        }, {
            headers: {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9,ru;q=0.8,uk;q=0.7",
                "content-type": "application/json",
                "cookie": account.cookie,
                "Referer": `https://dappbay.bnbchain.org/campaign/avengerdao-10k-usdt/${quizId}-adopting-web3-standards`,
            }
        }).then(data => data.data.status);
    } catch (err) {
        console.log(account.id, "answerQuiz error!");
    }
}
