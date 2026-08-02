import request from "supertest";
import { describe, it, expect, beforeEach } from "@jest/globals";
import { createApp } from "../src/app.js";

const app = createApp();
const base = "/api/v1";

/** Helper: register admin and return a bearer token. */
async function getToken() {
  const res = await request(app)
    .post(`${base}/auth/register`)
    .send({ name: "Admin", email: "a@a.com", password: "Passw0rd!" });
  return res.body.data.accessToken;
}

describe("Health", () => {
  it("reports healthy", async () => {
    const res = await request(app).get(`${base}/health`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe("Projects API", () => {
  it("creates and lists a project (admin)", async () => {
    const token = await getToken();
    const create = await request(app)
      .post(`${base}/projects`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "My Project", description: "A great project", category: "web" });
    expect(create.status).toBe(201);
    expect(create.body.data.slug).toBe("my-project");

    const list = await request(app).get(`${base}/projects`);
    expect(list.status).toBe(200);
    expect(list.body.data.length).toBe(1);
    expect(list.body.meta.total).toBe(1);
  });

  it("prevents non-admins from creating projects", async () => {
    const res = await request(app)
      .post(`${base}/projects`)
      .send({ title: "X", description: "Y" });
    expect(res.status).toBe(401);
  });

  it("hides draft projects from public listing", async () => {
    const token = await getToken();
    await request(app)
      .post(`${base}/projects`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Draft One", description: "hidden", status: "draft" });
    const list = await request(app).get(`${base}/projects`);
    expect(list.body.data.length).toBe(0);
  });
});

describe("Contact messages", () => {
  it("accepts a valid message", async () => {
    const res = await request(app).post(`${base}/messages`).send({
      name: "Visitor",
      email: "v@v.com",
      subject: "Hello there",
      message: "This is a sufficiently long message.",
    });
    expect(res.status).toBe(201);
  });

  it("rejects an invalid message", async () => {
    const res = await request(app)
      .post(`${base}/messages`)
      .send({ name: "V", email: "bad", subject: "", message: "x" });
    expect(res.status).toBe(400);
  });
});
