import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Image } from "@/components/leaf/Image";

describe("Image", () => {
  it("renders img with src and alt", () => {
    render(<Image src="https://example.com/img.png" alt="test" />);
    const img = screen.getByAltText("test");
    expect(img).toHaveAttribute("src", "https://example.com/img.png");
  });

  it("renders nothing when src is empty", () => {
    const { container } = render(<Image src="" alt="test" />);
    expect(container.innerHTML).toBe("");
  });
});
