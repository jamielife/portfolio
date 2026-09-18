import PocketBase from 'pocketbase';

export const POCKETBASE_URL = 'https://jamietaylor.me';

const pocketbase = new PocketBase(POCKETBASE_URL);

export default pocketbase;
