import { beforeEach, describe, expect, it, vi } from "vitest";
import { changePassword } from "./index";

const { mockedPost } = vi.hoisted(() => ({
  mockedPost: vi.fn(),
}));

vi.mock("../../../utils/request", () => ({
  default: {
    get: vi.fn(),
    post: mockedPost,
  },
}));

describe("system auth api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedPost.mockResolvedValue(undefined);
  });

  it("posts forced password change to /auth/password without no-auth config", async () => {
    const payload = {
      oldPassword: "Init@123",
      newPassword: "NewPass@123",
      confirmPassword: "NewPass@123",
    };

    await changePassword(payload);

    expect(mockedPost).toHaveBeenCalledWith("/auth/password", payload);
  });
});
