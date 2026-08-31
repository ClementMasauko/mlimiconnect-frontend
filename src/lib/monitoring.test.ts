import { describe, expect, it } from "vitest";
import { redactMonitoringText, scrubMonitoringValue } from "./monitoring";

describe("Sentry privacy scrubbing",()=>{
  it("removes email, Malawi phone and secrets",()=>{
    const result=redactMonitoringText("clement@example.com +265886096459 token=abc123");
    expect(result).not.toContain("clement@example.com");expect(result).not.toContain("+265886096459");expect(result).not.toContain("abc123");
  });
  it("removes sensitive structured fields",()=>{
    expect(scrubMonitoringValue({email:"person@example.com",message:"private",safe:"operation"})).toEqual({email:"[REDACTED]",message:"[REDACTED]",safe:"operation"});
  });
});
