/**
* This test verifies by making an API call that will trigger console logs
* Run this while monitoring the backend server logs
*/

console.log("Test making API request to /api/events");
console.log("Watch the backend console for the '🔔 GET /api/events handler called!' message\n");

const http = require("http");

const options = {
  hostname: "localhost",
  port: 5000,
  path: "/api/events",
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  }
};

const req = http.request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log(`Response Status: ${res.statusCode}`);
    console.log(`Response Headers:`);
    Object.entries(res.headers).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
    
    const parsed = JSON.parse(data);
    console.log(`\nResponse Body:`);
    console.log(JSON.stringify(parsed, null, 2));
    
    console.log(`\nAnalysis:`);
    console.log(`- Events returned: ${parsed.data.length}`);
    console.log(`- Total in DB: ${parsed.pagination.total}`);
    
    if (parsed.data.length === 0 && parsed.pagination.total === 0) {
      console.log("\n❌ PROBLEM:  Both are 0 - the backend might not have fresh code");
    } else if (parsed.data.length === 0 && parsed.pagination.total > 0) {
      console.log("\n⚠️  WARNING: Total shows events exist but data array is empty");
      console.log("      This suggests a data/schema mismatch");
    }
  });
});

req.on("error", (error) => {
  console.error(`Request error: ${error.message}`);
});

console.log(`Sending GET request to http://localhost:5000/api/events\n`);
req.end();

setTimeout(() => {
  process.exit(0);
}, 1000);
