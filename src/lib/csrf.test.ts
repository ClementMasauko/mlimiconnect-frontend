import { describe, expect, it } from "vitest";
import { csrfTokenFromCookie, isCsrfFailure } from "./csrf";

describe("CSRF token handling", () => {
  it("reads the latest encoded CSRF cookie", () => {
    expect(csrfTokenFromCookie("sessionid=abc; csrftoken=new%2Dtoken; theme=dark")).toBe("new-token");
  });

  it("recognizes Django CSRF failures without retrying unrelated forbidden responses", () => {
    expect(isCsrfFailure(403, { detail: "CSRF Failed: CSRF token from the 'X-Csrftoken' HTTP header incorrect." })).toBe(true);
    expect(isCsrfFailure(403, { detail: "You do not have permission." })).toBe(false);
    expect(isCsrfFailure(401, { detail: "CSRF Failed: token missing." })).toBe(false);
  });
});
