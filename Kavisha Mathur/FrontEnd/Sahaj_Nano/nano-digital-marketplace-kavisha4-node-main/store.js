const fs = require("fs").promises;
const filePath = "data.json";

async function loadBusinessListings() {
    try {
        const data = await fs.readFile(filePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        // If file does not exist or is empty, return an empty array
        if (error.code === 'ENOENT' || error.code === 'ERR_FS_FILE_NOT_FOUND') {
            return [];
        }
        console.error("Error reading file:", error);
        throw error;
    }
}

async function saveBusinessListings(jsonData) {
    try {
        const jsonString = JSON.stringify(jsonData, null, 2);
        await fs.writeFile(filePath, jsonString, "utf8");
    } catch (error) {
        console.error("Error writing file:", error);
        throw error;
    }
}

async function create(businessListingRequest) {
    try {
        if (!businessListingRequest || !businessListingRequest.businessName) {
            console.error("Invalid businessListingRequest");
            return null;
        }

        let jsonData = await loadBusinessListings();

        const existingBusiness = jsonData.find(entry => entry.businessName === businessListingRequest.businessName);
        if (existingBusiness) {
            console.log("Business with the same name already exists");
            return null;
        }

        const highestId = jsonData.reduce(
            (maxId, entry) => Math.max(maxId, parseInt(entry.businessListingId) || 0),
            0
        );
        const newId = (highestId + 1).toString();

        const newEntry = {
            businessListingId: newId,
            businessName: businessListingRequest.businessName,
            ownerName: businessListingRequest.ownerName || "",
            category: businessListingRequest.category || "",
            city: businessListingRequest.city || "",
            establishmentYear: businessListingRequest.establishmentYear || 0,
        };

        jsonData.push(newEntry);

        await saveBusinessListings(jsonData);

        console.log("Business listing created successfully:", newEntry);
        return newEntry;
    } catch (error) {
        console.error("Error creating business listing:", error);
        throw error;
    }
}

async function readAll() {
    try {
        const jsonData = await loadBusinessListings();
        return jsonData;
    } catch (error) {
        console.error("Error reading all business listings:", error);
        throw error;
    }
}

async function read(id) {
    try {
        const jsonData = await loadBusinessListings();
        const businessListing = jsonData.find(entry => entry.businessListingId === id) || null;
        return businessListing;
    } catch (error) {
        console.error("Error reading business listing:", error);
        throw error;
    }
}

async function search(searchCriteria) {
    try {
        const jsonData = await loadBusinessListings();

        const results = jsonData.filter(entry => {
            if (searchCriteria.condition === "AND") {
                return searchCriteria.fields.every(criteria => {
                    const fieldValue = entry[criteria.fieldName];
                    return (criteria.eq && fieldValue === criteria.eq)
                     || (criteria.neq && fieldValue !== criteria.neq);
                });
            } else if (searchCriteria.condition === "OR") {
                return searchCriteria.fields.some(criteria => {
                    const fieldValue = entry[criteria.fieldName];
                    return (criteria.eq && fieldValue === criteria.eq) || (criteria.neq && fieldValue !== criteria.neq);
                });
            }
        });

        console.log("Search results:", results);
        return results;
    } catch (error) {
        console.error("Error searching business listings:", error);
        throw error;
    }
}

async function aggregate(aggregateCriteria) {
    try {
        const jsonData = await loadBusinessListings();

        const groupedData = jsonData.reduce((acc, entry) => {
            const groupKey = aggregateCriteria.groupByFields.map(fieldName => entry[fieldName]).join("_");
            if (!acc[groupKey]) {
                acc[groupKey] = { ...entry };
            }
            return acc;
        }, {});

        const aggregatedResults = Object.values(groupedData).map(groupEntry => {
            const aggregationResults = aggregateCriteria.aggregationRequests.reduce((result, request) => {
                const { fieldName, function: aggregationFunction, alias } = request;
                const values = jsonData
                    .filter(entry => aggregateCriteria.groupByFields.every(field => entry[field] === groupEntry[field]))
                    .map(entry => entry[fieldName]);

                switch (aggregationFunction) {
                    case "COUNT":
                        result[alias] = values.length;
                        break;
                    case "MIN":
                        result[alias] = Math.min(...values);
                        break;
                    case "MAX":
                        result[alias] = Math.max(...values);
                        break;
                    // Add other aggregation functions as needed

                }

                return result;
            }, {});

            return { ...groupEntry, ...aggregationResults };
        });

        return aggregatedResults;
    } catch (error) {
        console.error("Error aggregating business listings:", error);
        throw error;
    }
}

module.exports = { create, read, readAll, search, aggregate };
