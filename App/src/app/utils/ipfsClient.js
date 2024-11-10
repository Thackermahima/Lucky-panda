import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';

// Singleton instance of Helia to avoid reinitializing
let heliaInstance = null;

async function getHeliaInstance() {
    if (!heliaInstance) {
        heliaInstance = await createHelia();
    }
    return heliaInstance;
}

// Function to add file content to IPFS
export async function addFile(content) {
    const helia = await getHeliaInstance();
    const fs = unixfs(helia);
    const cid = await fs.addBytes(typeof content === "string" ? new TextEncoder().encode(content) : content);
    return cid.toString();
}

// Function to retrieve file content from IPFS by CID
export async function getFile(cid) {
    const helia = await getHeliaInstance();
    const fs = unixfs(helia);
    const chunks = [];
    for await (const chunk of fs.cat(cid)) {
        chunks.push(chunk);
    }
    return new TextDecoder().decode(Buffer.concat(chunks));
}
