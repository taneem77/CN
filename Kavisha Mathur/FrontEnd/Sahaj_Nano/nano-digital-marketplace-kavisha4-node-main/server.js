const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const store = require("./store");

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

// Greeting
app.get('/greeting', (req, res) => {
    return res.send('Hello world!');
});

// Register business
app.post('/business-listing', async (req, res) => {
    const businessListingRequest = req.body;
    try {
        const businessListing = await store.create(businessListingRequest);
        if (!businessListing) {
            return res.status(400).json({ error: "Failed to create business listing" });
        }
        console.log(businessListing);
        return res.status(201).send(businessListing);
    } catch (error) {
        console.error("Error creating business listing:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Get business listing
app.get('/business-listing/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const businessListing = await store.read(id);
        if (!businessListing) {
            const msg = "Business listing with " + id + " was not found";
            return res.status(404).json(({ message: msg }));
        }
        return res.send(businessListing);
    } catch (error) {
        console.error("Error reading business listing:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Get all business listing
app.get('/business-listings/all', async (req, res) => {
    try {
        const businessListings = await store.readAll();
        return res.send(businessListings);
    } catch (error) {
        console.error("Error reading all business listings:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/business-listings/search', async (req, res) => {
    try {
        const businessListings = await store.search(req.body);
        return res.send(businessListings);
    } catch (error) {
        console.error("Error searching business listings:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/business-listings/aggregate', async (req, res) => {
    const aggregateCriteria = req.body;
    try {
        const aggregatedResults = await store.aggregate(aggregateCriteria);
        return res.send(aggregatedResults);
    } catch (error) {
        console.error("Error aggregating business listings:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log("Server running at PORT", PORT);
});
