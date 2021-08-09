process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");
const helperClass = require("./routes/helper");

const items = [{"name": "popsicle", "price": 1.45}]

beforeEach(() => {
    helperClass.processData.write_in_db(items);
});

afterEach(() => {
  helperClass.processData.write_in_db([])
});

describe("GET /items",() => {

    test("Gets a list of items", async () => {

      const resp = await request(app).get(`/items`);

      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({data: items});

    });

});

describe("POST /items", () => {
  test("Creates a new item", async () => {
    const resp = await request(app)
      .post(`/items`)
      .send({ name: "cheerios", price: 3.40});

    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual({ data: {added: { name: "cheerios", "price": 3.4 }}});
  });
});


describe("PATCH /items/:name", () => {

  test("Updates a single cat", async () => {
    const resp = await request(app)
      .patch(`/items/${items[0].name}`)
      .send({name: "apple"});

    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ data: [{name: "apple", "price": 1.45}]});
  });

  test("Responds with 404 if name invalid", async () => {
    const resp = await request(app).patch(`/items/zoo`);
    expect(resp.statusCode).toBe(404);
  });
});


describe("DELETE /items/:name", () => {
  test("Deletes a single an itemt", async () => {
    const resp = await request(app).delete(`/items/${items[0].name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: "Deleted" });
  });
});