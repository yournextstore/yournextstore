import { TrieveSDK } from "trieve-ts-sdk";

const apiKey = process.env.TRIEVE_API_KEY;
const datasetId = process.env.TRIEVE_DATASET_ID;

export const trieve = apiKey && datasetId ? new TrieveSDK({ apiKey, datasetId }) : null;
