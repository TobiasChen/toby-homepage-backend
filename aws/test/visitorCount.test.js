const vis = require("../src/visitorCount")

jest.mock('aws-sdk', () => {
    return {
      DynamoDB: { 
        DocumentClient: jest.fn(() => ({
          update: jest.fn(() => ({
            promise: jest.fn(() => ({"visits": 1}))
          }))
        }))
    }}
    });



test("On Get, return 200 with Value",async ()=> {
    const event = {"httpMethod": "GET"}
    await expect( vis.handler(event)).resolves.toEqual({"body": "{\"visits\":1}", "headers": {"Content-Type": "application/json"}, "statusCode": 200})
})

test("On non existing HTTP Method, return 405",async ()=> {
    const event = {"httpMethod": "XYZ"}
    await expect( vis.handler(event)).resolves.toEqual({"body": "\"Unsupported method \\\"XY2Z\\\"\"", "headers": {"Content-Type": "application/json"}, "statusCode": 405})
})

test("On non supported HTTP Method, return 405",async ()=> {
    const event = {"httpMethod": "PUT"}
    const expectation = {body: '"Unsupported method \\"PUT\\""', headers: {"Content-Type": "application/json"}, statusCode: 405}
    await expect( vis.handler(event)).resolves.toEqual(expectation)
})
