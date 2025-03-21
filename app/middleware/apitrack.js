const Api = require('../models/apitrack');

const processApi = async (apiName) => {
    try {
        console.log(apiName);
        let existingApi = await Api.findOne({ apiName });
        if (existingApi) {
            existingApi.count++;
            await existingApi.save();
            console.log(`Incremented count for ${apiName}. New count: ${existingApi.count}`);
            return existingApi; // Return the updated API object
        } else {
            const newApi = new Api({ apiName, count: 1 });
            await newApi.save();
            console.log(`Added new API: ${apiName}`);
            return newApi; // Return the newly created API object
        }
    } catch (error) {
        console.error("Error processing API:", error);
        throw error; // Rethrow the error
    }
};

module.exports = processApi 
