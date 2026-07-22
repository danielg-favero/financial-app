import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  authHeaders,
  buildTestApp,
  extractAuthCookie,
  extractRefreshCookie,
  registerAndSignIn,
} from "../helpers/build-test-app.ts";
import { FailingEmailSender } from "../helpers/in-memory-email-sender.ts";

const signUpPayload = {
  email: "daniel@example.com",
  password: "Super-secret-password1",
  confirmPassword: "Super-secret-password1",
  firstName: "Daniel",
  lastName: "Favero",
};

describe("POST /auth/signup", () => {
  it("registers a user and returns a verification token", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const response = await app.inject({ method: "POST", url: "/api/auth/signup", payload: signUpPayload });

    assert.equal(response.statusCode, 201);
    const body = response.json();
    assert.equal(body.user.email, signUpPayload.email);
    assert.equal(body.user.emailVerified, false);
    assert.equal(typeof body.verificationToken, "string");
    assert.equal(body.user.passwordHash, undefined);
  });

  it("does not start a session before the email is verified", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const response = await app.inject({ method: "POST", url: "/api/auth/signup", payload: signUpPayload });

    assert.equal(response.statusCode, 201);
    assert.deepEqual(response.cookies, []);
  });

  it("sends a registration confirmation email with the verification link", async (t) => {
    const { app, emailSender } = buildTestApp();
    t.after(() => app.close());

    const response = await app.inject({ method: "POST", url: "/api/auth/signup", payload: signUpPayload });

    const { verificationToken } = response.json();
    assert.equal(emailSender.sentEmails.length, 1);
    const [email] = emailSender.sentEmails;
    assert.ok(email);
    assert.equal(email.to, signUpPayload.email);
    assert.equal(email.subject, "Confirm your registration");
    assert.ok(
      email.html.includes(`http://localhost:3000/auth/verify-email?code=${verificationToken}`),
    );
    assert.ok(email.html.includes(signUpPayload.firstName));
  });

  it("still registers the user when the email sending fails", async (t) => {
    const { app } = buildTestApp({ emailSender: new FailingEmailSender() });
    t.after(() => app.close());

    const response = await app.inject({ method: "POST", url: "/api/auth/signup", payload: signUpPayload });

    assert.equal(response.statusCode, 201);
    assert.equal(response.json().user.email, signUpPayload.email);
  });

  it("rejects an invalid body with 400 in the error format", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const response = await app.inject({
      method: "POST",
      url: "/api/auth/signup",
      payload: { ...signUpPayload, email: "not-an-email" },
    });

    assert.equal(response.statusCode, 400);
    assert.equal(typeof response.json().error, "string");
  });

  it("rejects a duplicated email with 409", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    await app.inject({ method: "POST", url: "/api/auth/signup", payload: signUpPayload });
    const response = await app.inject({ method: "POST", url: "/api/auth/signup", payload: signUpPayload });

    assert.equal(response.statusCode, 409);
    assert.equal(response.json().error, "Email already in use");
  });
});

describe("POST /auth/verify-email", () => {
  it("verifies the user email", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const signUpResponse = await app.inject({ method: "POST", url: "/api/auth/signup", payload: signUpPayload });
    const { verificationToken } = signUpResponse.json();

    const response = await app.inject({
      method: "POST",
      url: "/api/auth/verify-email",
      payload: { token: verificationToken },
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json().user.emailVerified, true);
  });

  it("sends an email verification confirmation email", async (t) => {
    const { app, emailSender } = buildTestApp();
    t.after(() => app.close());

    const signUpResponse = await app.inject({ method: "POST", url: "/api/auth/signup", payload: signUpPayload });
    await app.inject({
      method: "POST",
      url: "/api/auth/verify-email",
      payload: { token: signUpResponse.json().verificationToken },
    });

    assert.equal(emailSender.sentEmails.length, 2);
    const email = emailSender.sentEmails[1];
    assert.ok(email);
    assert.equal(email.to, signUpPayload.email);
    assert.equal(email.subject, "Your email has been verified");
    assert.ok(email.html.includes(signUpPayload.firstName));
  });

  it("still verifies the email when the email sending fails", async (t) => {
    const { app } = buildTestApp({ emailSender: new FailingEmailSender() });
    t.after(() => app.close());

    const signUpResponse = await app.inject({ method: "POST", url: "/api/auth/signup", payload: signUpPayload });
    const response = await app.inject({
      method: "POST",
      url: "/api/auth/verify-email",
      payload: { token: signUpResponse.json().verificationToken },
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json().user.emailVerified, true);
  });

  it("rejects an unknown token with 400", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const response = await app.inject({
      method: "POST",
      url: "/api/auth/verify-email",
      payload: { token: "unknown-token" },
    });

    assert.equal(response.statusCode, 400);
    assert.equal(response.json().error, "Invalid verification token");
  });
});

describe("POST /auth/signin", () => {
  it("rejects a login before email verification with 403", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    await app.inject({ method: "POST", url: "/api/auth/signup", payload: signUpPayload });
    const response = await app.inject({
      method: "POST",
      url: "/api/auth/signin",
      payload: { email: signUpPayload.email, password: signUpPayload.password },
    });

    assert.equal(response.statusCode, 403);
    assert.equal(response.json().error, "Email not verified");
  });

  it("rejects wrong credentials with 401", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    await registerAndSignIn(app);
    const response = await app.inject({
      method: "POST",
      url: "/api/auth/signin",
      payload: { email: "nobody@example.com", password: "wrong-password" },
    });

    assert.equal(response.statusCode, 401);
    assert.equal(response.json().error, "Invalid email or password");
  });

  it("sets the auth cookie for a verified user", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const signUpResponse = await app.inject({ method: "POST", url: "/api/auth/signup", payload: signUpPayload });
    await app.inject({
      method: "POST",
      url: "/api/auth/verify-email",
      payload: { token: signUpResponse.json().verificationToken },
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/auth/signin",
      payload: { email: signUpPayload.email, password: signUpPayload.password },
    });

    assert.equal(response.statusCode, 200);
    const body = response.json();
    assert.equal(body.accessToken, undefined);
    assert.equal(body.user.email, signUpPayload.email);

    const accessToken = extractAuthCookie(response.cookies);
    assert.equal(typeof accessToken, "string");
    const setCookieHeader = response.headers["set-cookie"];
    assert.ok(String(setCookieHeader).includes("HttpOnly"));
  });

  it("sets the refresh cookie for a verified user", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { refreshToken } = await registerAndSignIn(app);

    assert.equal(typeof refreshToken, "string");
    assert.ok(refreshToken.length > 0);
  });
});

describe("POST /auth/refresh", () => {
  it("rejects a request without a refresh cookie with 401", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const response = await app.inject({ method: "POST", url: "/api/auth/refresh" });

    assert.equal(response.statusCode, 401);
    assert.equal(response.json().error, "Missing refresh token");
  });

  it("rejects an unknown refresh token with 401", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const response = await app.inject({
      method: "POST",
      url: "/api/auth/refresh",
      cookies: { refreshToken: "unknown-token" },
    });

    assert.equal(response.statusCode, 401);
    assert.equal(response.json().error, "Invalid or expired token");
  });

  it("rotates the token pair and keeps the session working", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { refreshToken, email } = await registerAndSignIn(app);

    const refreshResponse = await app.inject({
      method: "POST",
      url: "/api/auth/refresh",
      cookies: { refreshToken },
    });

    assert.equal(refreshResponse.statusCode, 204);
    const newAccessToken = extractAuthCookie(refreshResponse.cookies);
    const newRefreshToken = extractRefreshCookie(refreshResponse.cookies);
    assert.notEqual(newRefreshToken, refreshToken);

    const meResponse = await app.inject({
      method: "GET",
      url: "/api/auth/me",
      headers: authHeaders(newAccessToken),
    });
    assert.equal(meResponse.statusCode, 200);
    assert.equal(meResponse.json().user.email, email);
  });

  it("rejects a replayed refresh token and revokes all sessions", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { refreshToken } = await registerAndSignIn(app);

    const firstRefresh = await app.inject({
      method: "POST",
      url: "/api/auth/refresh",
      cookies: { refreshToken },
    });
    const rotatedRefreshToken = extractRefreshCookie(firstRefresh.cookies);

    const replayResponse = await app.inject({
      method: "POST",
      url: "/api/auth/refresh",
      cookies: { refreshToken },
    });
    assert.equal(replayResponse.statusCode, 401);

    const afterReplayResponse = await app.inject({
      method: "POST",
      url: "/api/auth/refresh",
      cookies: { refreshToken: rotatedRefreshToken },
    });
    assert.equal(afterReplayResponse.statusCode, 401);
  });
});

describe("GET /auth/me", () => {
  it("rejects a request without a bearer token with 401", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const response = await app.inject({ method: "GET", url: "/api/auth/me" });

    assert.equal(response.statusCode, 401);
    assert.equal(response.json().error, "Missing authentication token");
  });

  it("rejects an invalid token with 401", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const response = await app.inject({
      method: "GET",
      url: "/api/auth/me",
      headers: authHeaders("not-a-jwt"),
    });

    assert.equal(response.statusCode, 401);
    assert.equal(response.json().error, "Invalid or expired token");
  });

  it("returns the current user profile", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken, email } = await registerAndSignIn(app);
    const response = await app.inject({
      method: "GET",
      url: "/api/auth/me",
      headers: authHeaders(accessToken),
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json().user.email, email);
  });
});

describe("POST /auth/signout", () => {
  it("revokes the token so it can no longer be used", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);

    const signOutResponse = await app.inject({
      method: "POST",
      url: "/api/auth/signout",
      headers: authHeaders(accessToken),
    });
    assert.equal(signOutResponse.statusCode, 204);

    const meResponse = await app.inject({
      method: "GET",
      url: "/api/auth/me",
      headers: authHeaders(accessToken),
    });
    assert.equal(meResponse.statusCode, 401);
    assert.equal(meResponse.json().error, "Invalid or expired token");
  });

  it("revokes the refresh token so the session cannot be refreshed", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken, refreshToken } = await registerAndSignIn(app);

    const signOutResponse = await app.inject({
      method: "POST",
      url: "/api/auth/signout",
      headers: authHeaders(accessToken),
      cookies: { refreshToken },
    });
    assert.equal(signOutResponse.statusCode, 204);

    const refreshResponse = await app.inject({
      method: "POST",
      url: "/api/auth/refresh",
      cookies: { refreshToken },
    });
    assert.equal(refreshResponse.statusCode, 401);
  });
});

describe("PATCH /auth/me", () => {
  it("updates the profile and returns the updated user", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);

    const response = await app.inject({
      method: "PATCH",
      url: "/api/auth/me",
      headers: authHeaders(accessToken),
      payload: { firstName: "Updated", lastName: "Name", email: "updated@example.com" },
    });

    assert.equal(response.statusCode, 200);
    const body = response.json();
    assert.equal(body.user.firstName, "Updated");
    assert.equal(body.user.lastName, "Name");
    assert.equal(body.user.email, "updated@example.com");
    assert.equal(body.user.passwordHash, undefined);
  });

  it("allows keeping the current email", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken, email } = await registerAndSignIn(app);

    const response = await app.inject({
      method: "PATCH",
      url: "/api/auth/me",
      headers: authHeaders(accessToken),
      payload: { firstName: "Updated", lastName: "Name", email },
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json().user.email, email);
  });

  it("rejects an email already used by another account with 409", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const other = await registerAndSignIn(app);
    const { accessToken } = await registerAndSignIn(app);

    const response = await app.inject({
      method: "PATCH",
      url: "/api/auth/me",
      headers: authHeaders(accessToken),
      payload: { firstName: "Updated", lastName: "Name", email: other.email },
    });

    assert.equal(response.statusCode, 409);
    assert.equal(response.json().error, "Email already in use");
  });

  it("rejects an invalid body with 400", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);

    const response = await app.inject({
      method: "PATCH",
      url: "/api/auth/me",
      headers: authHeaders(accessToken),
      payload: { firstName: "", lastName: "Name", email: "not-an-email" },
    });

    assert.equal(response.statusCode, 400);
    assert.equal(typeof response.json().error, "string");
  });

  it("rejects a request without a bearer token with 401", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const response = await app.inject({
      method: "PATCH",
      url: "/api/auth/me",
      payload: { firstName: "Updated", lastName: "Name", email: "updated@example.com" },
    });

    assert.equal(response.statusCode, 401);
  });
});

describe("DELETE /auth/me", () => {
  it("deletes the account and revokes the current session", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);

    const deleteResponse = await app.inject({
      method: "DELETE",
      url: "/api/auth/me",
      headers: authHeaders(accessToken),
    });
    assert.equal(deleteResponse.statusCode, 204);

    const meResponse = await app.inject({
      method: "GET",
      url: "/api/auth/me",
      headers: authHeaders(accessToken),
    });
    assert.equal(meResponse.statusCode, 401);
  });

  it("clears the auth cookies", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken } = await registerAndSignIn(app);

    const response = await app.inject({
      method: "DELETE",
      url: "/api/auth/me",
      headers: authHeaders(accessToken),
    });

    const clearedCookies = response.cookies.filter((cookie) => cookie.value === "");
    assert.equal(clearedCookies.length, 2);
  });

  it("prevents signing in with the deleted credentials", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const { accessToken, email } = await registerAndSignIn(app);

    await app.inject({ method: "DELETE", url: "/api/auth/me", headers: authHeaders(accessToken) });

    const signInResponse = await app.inject({
      method: "POST",
      url: "/api/auth/signin",
      payload: { email, password: "Super-secret-password1" },
    });
    assert.equal(signInResponse.statusCode, 401);
  });
});

describe("POST /auth/forgot-password", () => {
  it("responds 204 and sends the password reset email with the reset link", async (t) => {
    const { app, repositories, emailSender } = buildTestApp();
    t.after(() => app.close());

    const { email } = await registerAndSignIn(app);
    const emailCountBefore = emailSender.sentEmails.length;

    const response = await app.inject({
      method: "POST",
      url: "/api/auth/forgot-password",
      payload: { email },
    });

    assert.equal(response.statusCode, 204);
    const user = await repositories.userRepository.findByEmail(email);
    assert.ok(user?.passwordResetToken);
    assert.equal(emailSender.sentEmails.length, emailCountBefore + 1);
    const resetEmail = emailSender.sentEmails[emailCountBefore];
    assert.ok(resetEmail);
    assert.equal(resetEmail.to, email);
    assert.equal(resetEmail.subject, "Reset your password");
    assert.ok(
      resetEmail.html.includes(
        `http://localhost:3000/auth/reset-password?code=${user.passwordResetToken}`,
      ),
    );
  });

  it("responds 204 for an unknown email without sending an email", async (t) => {
    const { app, emailSender } = buildTestApp();
    t.after(() => app.close());

    const response = await app.inject({
      method: "POST",
      url: "/api/auth/forgot-password",
      payload: { email: "nobody@example.com" },
    });

    assert.equal(response.statusCode, 204);
    assert.equal(emailSender.sentEmails.length, 0);
  });

  it("still responds 204 when the email sending fails", async (t) => {
    const { app } = buildTestApp({ emailSender: new FailingEmailSender() });
    t.after(() => app.close());

    const { email } = await registerAndSignIn(app);

    const response = await app.inject({
      method: "POST",
      url: "/api/auth/forgot-password",
      payload: { email },
    });

    assert.equal(response.statusCode, 204);
  });
});

describe("POST /auth/reset-password", () => {
  const newPassword = "New-secret-password1";

  async function requestResetToken(
    app: Awaited<ReturnType<typeof buildTestApp>>["app"],
    repositories: ReturnType<typeof buildTestApp>["repositories"],
    email: string,
  ): Promise<string> {
    await app.inject({ method: "POST", url: "/api/auth/forgot-password", payload: { email } });
    const user = await repositories.userRepository.findByEmail(email);
    if (!user?.passwordResetToken) {
      throw new Error("Password reset token was not stored");
    }
    return user.passwordResetToken;
  }

  it("resets the password so only the new one signs in", async (t) => {
    const { app, repositories } = buildTestApp();
    t.after(() => app.close());

    const { email } = await registerAndSignIn(app);
    const token = await requestResetToken(app, repositories, email);

    const response = await app.inject({
      method: "POST",
      url: "/api/auth/reset-password",
      payload: { token, password: newPassword, confirmPassword: newPassword },
    });
    assert.equal(response.statusCode, 204);

    const oldPasswordResponse = await app.inject({
      method: "POST",
      url: "/api/auth/signin",
      payload: { email, password: "Super-secret-password1" },
    });
    assert.equal(oldPasswordResponse.statusCode, 401);

    const newPasswordResponse = await app.inject({
      method: "POST",
      url: "/api/auth/signin",
      payload: { email, password: newPassword },
    });
    assert.equal(newPasswordResponse.statusCode, 200);
  });

  it("sends a password reset confirmation email", async (t) => {
    const { app, repositories, emailSender } = buildTestApp();
    t.after(() => app.close());

    const { email } = await registerAndSignIn(app);
    const token = await requestResetToken(app, repositories, email);
    const emailCountBefore = emailSender.sentEmails.length;

    await app.inject({
      method: "POST",
      url: "/api/auth/reset-password",
      payload: { token, password: newPassword, confirmPassword: newPassword },
    });

    assert.equal(emailSender.sentEmails.length, emailCountBefore + 1);
    const confirmationEmail = emailSender.sentEmails[emailCountBefore];
    assert.ok(confirmationEmail);
    assert.equal(confirmationEmail.to, email);
    assert.equal(confirmationEmail.subject, "Your password has been changed");
  });

  it("revokes existing sessions so the old refresh token stops working", async (t) => {
    const { app, repositories } = buildTestApp();
    t.after(() => app.close());

    const { email, refreshToken } = await registerAndSignIn(app);
    const token = await requestResetToken(app, repositories, email);

    await app.inject({
      method: "POST",
      url: "/api/auth/reset-password",
      payload: { token, password: newPassword, confirmPassword: newPassword },
    });

    const refreshResponse = await app.inject({
      method: "POST",
      url: "/api/auth/refresh",
      cookies: { refreshToken },
    });
    assert.equal(refreshResponse.statusCode, 401);
  });

  it("rejects an unknown token with 400", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const response = await app.inject({
      method: "POST",
      url: "/api/auth/reset-password",
      payload: { token: "unknown-token", password: newPassword, confirmPassword: newPassword },
    });

    assert.equal(response.statusCode, 400);
    assert.equal(response.json().error, "Invalid or expired password reset token");
  });

  it("rejects an expired token with 400", async (t) => {
    const { app, repositories } = buildTestApp();
    t.after(() => app.close());

    const { email } = await registerAndSignIn(app);
    const token = await requestResetToken(app, repositories, email);
    const user = await repositories.userRepository.findByEmail(email);
    assert.ok(user);
    await repositories.userRepository.update(user.id, {
      passwordResetTokenExpiresAt: new Date(Date.now() - 1000),
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/auth/reset-password",
      payload: { token, password: newPassword, confirmPassword: newPassword },
    });

    assert.equal(response.statusCode, 400);
    assert.equal(response.json().error, "Invalid or expired password reset token");
  });

  it("rejects a reused token with 400", async (t) => {
    const { app, repositories } = buildTestApp();
    t.after(() => app.close());

    const { email } = await registerAndSignIn(app);
    const token = await requestResetToken(app, repositories, email);

    await app.inject({
      method: "POST",
      url: "/api/auth/reset-password",
      payload: { token, password: newPassword, confirmPassword: newPassword },
    });
    const response = await app.inject({
      method: "POST",
      url: "/api/auth/reset-password",
      payload: { token, password: newPassword, confirmPassword: newPassword },
    });

    assert.equal(response.statusCode, 400);
    assert.equal(response.json().error, "Invalid or expired password reset token");
  });

  it("rejects a password that violates the policy with 400", async (t) => {
    const { app, repositories } = buildTestApp();
    t.after(() => app.close());

    const { email } = await registerAndSignIn(app);
    const token = await requestResetToken(app, repositories, email);

    const response = await app.inject({
      method: "POST",
      url: "/api/auth/reset-password",
      payload: { token, password: "weak", confirmPassword: "weak" },
    });

    assert.equal(response.statusCode, 400);
    assert.equal(typeof response.json().error, "string");
  });
});

describe("error middleware", () => {
  it("returns the error format for unknown routes", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const response = await app.inject({ method: "GET", url: "/unknown-route" });

    assert.equal(response.statusCode, 404);
    assert.equal(typeof response.json().error, "string");
  });

  it("returns the error format for malformed JSON bodies", async (t) => {
    const { app } = buildTestApp();
    t.after(() => app.close());

    const response = await app.inject({
      method: "POST",
      url: "/api/auth/signup",
      headers: { "content-type": "application/json" },
      payload: "{not-json",
    });

    assert.equal(response.statusCode, 400);
    assert.equal(typeof response.json().error, "string");
  });
});
