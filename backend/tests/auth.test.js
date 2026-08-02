import request from "supertest";
import { describe, it, expect, beforeEach } from "@jest/globals";
import { createApp } from "../src/app.js";

const app = createApp();
const base = "/api/v1";

describe("Auth API", () => {
  const admin = { name: "Test Admin", email: "admin@test.com", password: "Passw0rd!" };

  it("registers the first user as admin", async () => {
    const res = await request(app).post(`${base}/auth/register`).send(admin);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe("admin");
    expect(res.body.data.accessToken).toBeDefined();
  });

  it("rejects login with wrong password", async () => {
    await request(app).post(`${base}/auth/register`).send(admin);
    const res = await request(app)
      .post(`${base}/auth/login`)
      .send({ email: admin.email, password: "wrong" });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("logs in and returns current user via /me", async () => {
    await request(app).post(`${base}/auth/register`).send(admin);
    const login = await request(app)
      .post(`${base}/auth/login`)
      .send({ email: admin.email, password: admin.password });
    const token = login.body.data.accessToken;

    const me = await request(app)
      .get(`${base}/auth/me`)
      .set("Authorization", `Bearer ${token}`);
    expect(me.status).toBe(200);
    expect(me.body.data.email).toBe(admin.email);
  });

  it("blocks protected routes without a token", async () => {
    const res = await request(app).get(`${base}/auth/me`);
    expect(res.status).toBe(401);
  });

  it("validates registration input", async () => {
    const res = await request(app)
      .post(`${base}/auth/register`)
      .send({ name: "x", email: "bad", password: "short" });
    expect(res.status).toBe(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });
});
