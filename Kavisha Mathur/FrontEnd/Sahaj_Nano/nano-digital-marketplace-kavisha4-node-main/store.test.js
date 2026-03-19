const store = require("./store");
const fs = require('fs');
const path = require('path');

describe('store', () => {
  beforeEach(()=>{
    try{
      const files = fs.readdirSync("./digital-marketplace");
      files.forEach((file) => {
        console.log("deleting file");
        const filePath = path.join(absolutePath, file);
        fs.unlinkSync(filePath);
      });
    }catch(err){
      console.log("Could not delete files");
    }
  })

  //remove x from prefix from the below after implementing logic
  xtest('should create business listing', () => {
    const businessListingRequest = {businessName:"microBiz",ownerName:"Divy Sharma",category:"Food",city:"Mumbai",establishmentYear:2020};

    const result = store.create(businessListingRequest);

    expect(result.businessListingId).toBeDefined();
    expect(result.businessName).toBe("microBiz");
    expect(result.ownerName).toBe("Divy Sharma");
    expect(result.category).toBe("Food");
    expect(result.city).toBe("Mumbai");
  });

  //remove x from prefix from the below after implementing logic
  xtest('should not create business listing with same name', () => {
    const businessListingRequest = {businessName:"microBiz",ownerName:"Divy Sharma",category:"Food",city:"Mumbai",establishmentYear:2020};
    store.create(businessListingRequest);
    const businessListingRequest1 = {businessName:"microBiz",ownerName:"Divy Sharma",category:"Food",city:"Mumbai",establishmentYear:2020};
    
    const result = store.create(businessListingRequest1);

    expect(result).toBeNull();
  });

  //remove x from prefix from the below after implementing logic
  xtest('should get business listing by id', () => {
    const businessListingRequest = {businessName:"microBiz",ownerName:"Divy Sharma",category:"Food",city:"Mumbai",establishmentYear:2020};
    const preExistingBusinessListing = store.create(businessListingRequest);

    const businessListing = store.read(preExistingBusinessListing.businessListingId);
    expect(businessListing.businessListingId).toBeDefined();
    expect(businessListing.businessName).toBe("microBiz");
    expect(businessListing.ownerName).toBe("Divy Sharma");
    expect(businessListing.category).toBe("Food");
    expect(businessListing.city).toBe("Mumbai");
  });

  //remove x from prefix from the below after implementing logic
  xtest('should get business listing by id', () => {
    const businessListingRequest = {businessName:"microBiz",ownerName:"Divy Sharma",category:"Food",city:"Mumbai",establishmentYear:2020};
    const preExistingBusinessListing = store.create(businessListingRequest);

    const businessListing = store.read(preExistingBusinessListing.businessListingId);
    expect(businessListing.businessListingId).toBeDefined();
    expect(businessListing.businessName).toBe("microBiz");
    expect(businessListing.ownerName).toBe("Divy Sharma");
    expect(businessListing.category).toBe("Food");
    expect(businessListing.city).toBe("Mumbai");
  });

  //remove x from prefix from the below after implementing logic
  test('should get all business listing', async () => {
    const businessListingRequest1 = {businessName:"microBiz",ownerName:"Divy Sharma",category:"Food",city:"Mumbai",establishmentYear:2020};
    const preExistingBusinessListing1 = store.create(businessListingRequest1);

    const businessListingRequest2 = {businessName:"nanoBiz",ownerName:"Nidhi Sharma",category:"Food",city:"Bengaluru",establishmentYear:2020};
    const preExistingBusinessListing2 = store.create(businessListingRequest2);

    const businessListings = store.readAll();
    expect(businessListings).toHaveLength(2);
    expect(businessListings).toContain(preExistingBusinessListing1);
    expect(businessListings).toContain(preExistingBusinessListing2);
  });
  //remove x from prefix from the below after implementing logic
  xtest('should get business listing by search criteria', () => {
    const searchRequest = {fields:[{fieldName:"city",eq:"Mumbai",neq:null}], condition:"AND"};
    const businessListingRequest1 = {businessName:"microBiz",ownerName:"Divy Sharma",category:"Food",city:"Mumbai",establishmentYear:2020};
    const preExistingBusinessListing1 = store.create(businessListingRequest1);
    const businessListingRequest2 = {businessName:"nanoBiz",ownerName:"Nidhi Sharma",category:"Food",city:"Bengaluru",establishmentYear:2020};
    const preExistingBusinessListing2 = store.create(businessListingRequest2);
    const businessListingRequest3 = {businessName:"miniBiz",ownerName:"Riddhi Sharma",category:"Home Decor",city:"Chennai",establishmentYear:2020};
    const preExistingBusinessListing3 = store.create(businessListingRequest3);

    const businessListings = store.search(searchRequest);
    expect(businessListings).toHaveLength(1);
    expect(businessListings).toContain(preExistingBusinessListing1);
  });

  //remove x from prefix from the below after implementing logic
  xtest('should aggregate count of business listing by given group by fields', () => {
    const aggregateRequest = {groupByFields:["city","category"], aggregationRequests:[{
      fieldName: "businessName",
      function: "COUNT",
      alias: "totalListedBusinesses"
  }]};
    const businessListingRequest1 = {businessName:"microBiz",ownerName:"Divy Sharma",category:"Home Decor",city:"Pune",establishmentYear:2020};
    const preExistingBusinessListing1 = store.create(businessListingRequest1);
    const businessListingRequest2 = {businessName:"nanoBiz",ownerName:"Nidhi Sharma",category:"Home Backer",city:"Pune",establishmentYear:2021};
    const preExistingBusinessListing2 = store.create(businessListingRequest2);
    const businessListingRequest3 = {businessName:"miniBiz",ownerName:"Riddhi Sharma",category:"Home Decor",city:"Pune",establishmentYear:2023};
    const preExistingBusinessListing3 = store.create(businessListingRequest3);
    const businessListingRequest4 = {businessName:"maxiBiz",ownerName:"Riddhi Shah",category:"Home Cook",city:"Mumbai",establishmentYear:2020};
    const preExistingBusinessListing4 = store.create(businessListingRequest3);

    const businessListings = store.aggregate(aggregateRequest);

    expect(businessListings).toHaveLength(3);
    expect(businessListings).toContain({city:"Pune", category:"Home Decor", totalListedBusinesses: 2});
    expect(businessListings).toContain({city:"Pune", category:"Home Backer", totalListedBusinesses: 1});
    expect(businessListings).toContain({city:"Mumbai", category:"Home Cook", totalListedBusinesses: 1});
  });

  //remove x from prefix from the below after implementing logic
  xtest('should aggregate minimum of business listing by given group by fields', () => {
    const aggregateRequest = {groupByFields:["city","category"], aggregationRequests:[{
      fieldName: "establishmentYear",
      function: "MIN",
      alias: "firstEstablishmentYear"
  }]};
    const businessListingRequest1 = {businessName:"microBiz",ownerName:"Divy Sharma",category:"Home Decor",city:"Pune",establishmentYear:2020};
    const preExistingBusinessListing1 = store.create(businessListingRequest1);
    const businessListingRequest2 = {businessName:"nanoBiz",ownerName:"Nidhi Sharma",category:"Home Backer",city:"Pune",establishmentYear:2021};
    const preExistingBusinessListing2 = store.create(businessListingRequest2);
    const businessListingRequest3 = {businessName:"miniBiz",ownerName:"Riddhi Sharma",category:"Home Decor",city:"Pune",establishmentYear:2023};
    const preExistingBusinessListing3 = store.create(businessListingRequest3);
    const businessListingRequest4 = {businessName:"maxiBiz",ownerName:"Riddhi Shah",category:"Home Cook",city:"Mumbai",establishmentYear:2020};
    const preExistingBusinessListing4 = store.create(businessListingRequest3);

    const businessListings = store.aggregate(aggregateRequest);

    expect(businessListings).toHaveLength(3);
    expect(businessListings).toContain({city:"Pune", category:"Home Decor", firstEstablishmentYear: 2020});
    expect(businessListings).toContain({city:"Pune", category:"Home Backer", firstEstablishmentYear: 2021});
    expect(businessListings).toContain({city:"Mumbai", category:"Home Cook", firstEstablishmentYear: 2020});
  });

  //remove x from prefix from the below after implementing logic
  xtest('should aggregate maximum of business listing by given group by fields', () => {
    const aggregateRequest = {groupByFields:["city","category"], aggregationRequests:[{
      fieldName: "establishmentYear",
      function: "MAX",
      alias: "lastEstablishmentYear"
  }]};
    const businessListingRequest1 = {businessName:"microBiz",ownerName:"Divy Sharma",category:"Home Decor",city:"Pune",establishmentYear:2020};
    const preExistingBusinessListing1 = store.create(businessListingRequest1);
    const businessListingRequest2 = {businessName:"nanoBiz",ownerName:"Nidhi Sharma",category:"Home Backer",city:"Pune",establishmentYear:2021};
    const preExistingBusinessListing2 = store.create(businessListingRequest2);
    const businessListingRequest3 = {businessName:"miniBiz",ownerName:"Riddhi Sharma",category:"Home Decor",city:"Pune",establishmentYear:2023};
    const preExistingBusinessListing3 = store.create(businessListingRequest3);
    const businessListingRequest4 = {businessName:"maxiBiz",ownerName:"Riddhi Shah",category:"Home Cook",city:"Mumbai",establishmentYear:2020};
    const preExistingBusinessListing4 = store.create(businessListingRequest3);

    const businessListings = store.aggregate(aggregateRequest);

    expect(businessListings).toHaveLength(3);
    expect(businessListings).toContain({city:"Pune", category:"Home Decor", lastEstablishmentYear: 2023});
    expect(businessListings).toContain({city:"Pune", category:"Home Backer", lastEstablishmentYear: 2021});
    expect(businessListings).toContain({city:"Mumbai", category:"Home Cook", lastEstablishmentYear: 2020});
  });
});