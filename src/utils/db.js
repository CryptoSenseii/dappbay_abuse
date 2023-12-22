import {MongoClient} from 'mongodb';

const uri = `mongodb://127.0.0.1:27017`;

export const getAccountsDB = async (dbName) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const collection = client.db(dbName).collection('accounts');
        const res = await collection.find({}).toArray();
        await client.close();
        return res;
    } catch (err) {
        console.log("getAccountsDB error!");
    } finally {
        await client.close();
    }
}

export const getUnregisteredAccountsDB = async (dbName) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const collection = client.db(dbName).collection('accounts');
        const res = await collection.find({quiz: {$exists: false}}).toArray();
        await client.close();
        return res;
    } catch (err) {
        console.log("getAccountsDB error!");
    } finally {
        await client.close();
    }
}

export const getRegisteredAccountsDB = async (dbName) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const collection = client.db(dbName).collection('accounts');
        const res = await collection.find({quiz: true}).toArray();
        await client.close();
        return res;
    } catch (err) {
        console.log("getAccountsDB error!");
    } finally {
        await client.close();
    }
}

export const getWinnerAccountDB = async (dbName, address) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const collection = client.db(dbName).collection('accounts');
        const res = await collection.find({address: address}).toArray();
        await client.close();
        return res;
    } catch (err) {
        console.log("getAccountsDB error!");
    } finally {
        await client.close();
    }
}

export const getAccountsWithPrize = async (dbName) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const collection = client.db(dbName).collection('accounts');
        const res = await collection.find({prize: {$exists: true}}).toArray();
        await client.close();
        return res;
    } catch (err) {
        console.log("getAccountsWithPrize error!");
    } finally {
        await client.close();
    }
}

export const updateAccountData = async (dbName, accountId, data) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const collection = client.db(dbName).collection('accounts');
        await collection.updateOne(
            {id: accountId},
            {$set: {...data}},
            {upsert: true}
        );
    } catch (err) {
        console.log(accountId, "updateAccountData error!");
    } finally {
        await client.close();
    }
}

export const setAccountsDB = async (dbName, accounts) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const collection = client.db(dbName).collection('accounts');
        const data = accounts.map((_, i) => ({
            id: i,
            address: accounts[i].address,
            privateKey: accounts[i].privateKey
        }));
        await collection.insertMany(data);
        console.log(data)
    } catch (err) {
        console.log("getAccountsDB error!");
    } finally {
        await client.close();
    }
}
