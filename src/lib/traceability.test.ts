import { describe, expect, it } from "vitest";
import { extractPublicTraceabilityCode, publicTraceabilityUrl } from "./traceability";

describe("public traceability links", () => {
  it("accepts a batch code", () => {
    expect(extractPublicTraceabilityCode(" BATCH-MZ-2026-01 ")).toBe("BATCH-MZ-2026-01");
  });

  it("extracts codes from current and legacy QR links", () => {
    expect(extractPublicTraceabilityCode("https://market.example/verify/BATCH-123")).toBe("BATCH-123");
    expect(extractPublicTraceabilityCode("https://market.example/verify?product=BATCH-456")).toBe("BATCH-456");
  });

  it("generates a deployment-safe public URL", () => {
    expect(publicTraceabilityUrl("BATCH 123", "https://market.example")).toBe("https://market.example/verify/BATCH%20123");
  });
});
