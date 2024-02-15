import Link from "../../src/components/Link";
import { renderComponent } from "../utils";
import { fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

const TncWithLink = {
  id: "toggleablelink-fbe77bf5a6",
  fieldType: "checkbox-group",
  name: "link1700040668210",
  visible: true,
  type: "string[]",
  enabled: true,
  readOnly: false,
  enforceEnum: true,
  enum: ["https://www.google.com", "https://www.youtube.com"],
  ":type": "core/fd/components/form/toggleablelink/v1/toggleablelink",
  enumNames: [
    {
      value: "label for the link",
    },
    {
      value: "link",
    },
  ],
};

describe("Link", () => {
  test("", async () => {
    const helper = renderComponent(Link);
    const { renderResponse } = await helper(TncWithLink);
    const linkElement = renderResponse.getByText("label for the link");
    expect(linkElement).toBeInTheDocument();
    fireEvent.click(linkElement);
    expect(renderResponse.container.innerHTML).toContain(
      "cmp-adaptiveform-checkboxgroup cmp-adaptiveform-checkboxgroup--filled"
    );
  });
});
