const { client } = require("../../redis_connect");

// Function to scan keys matching a pattern
const scanKeysMatchingPattern = (pattern) => {
  return new Promise(async (resolve, reject) => {
    console.log("ScanningmatchedPattern");
    console.log(pattern);
    const scanning = await client.scan(0, pattern);

    // console.log(scanning)

    const keys = scanning.keys;
    resolve(keys);
  });
};

// Function to delete keys
const deleteKeys = (keys) => {
  return new Promise(async (resolve, reject) => {
    console.log("deleteKeys");
    if (keys.length > 0) {
      const deleting = await client.del(keys);
      resolve(keys);
    } else {
      console.log("No keys to delete.");
      resolve([]);
    }
  });
};

// Example usage: Scan for keys matching pattern and delete them
const flushKeysStartingWith = async (pattern) => {
  try {
    console.log("Flush keys starting with");
    const keys = await scanKeysMatchingPattern(pattern);
    const deletedKeys = await deleteKeys(keys);
    return keys
  } catch (error) {
    console.error("Error flushing keys:", error);
    throw new Error
  }
};

module.exports = { flushKeysStartingWith };
