import DropDown from "../../src/components/DropDown";
import { renderComponent } from "../utils";
import userEvent from "@testing-library/user-event";

const field = {
  name: "dropdown",
  visible: true,
  label: {
    value: "Drop Down",
  },
  fieldType: "drop-down",
  placeholder: "select",
  enum: [1, 2, 3],
  enumNames: ["option 1", "option 2", "option 3"],
};
const helper = renderComponent(DropDown);

describe("Drop Down", () => {
  test("option selected by user is set in the model", async () => {
    const f = {
      ...field,
    };
    const { renderResponse } = await helper(f);
    userEvent.selectOptions(
      renderResponse.getByRole("combobox"),
      renderResponse.getByRole("option", { name: "option 1" })
    );
    expect(
      renderResponse.getByRole("option", { name: "option 1" })
    ).toBeTruthy();
  });

  test("selection made by the user sets the value", async () => {
    const f = {
      ...field,
    };
    const { renderResponse, element } = await helper(f);

    userEvent.click(renderResponse.getByTestId("select"));
    userEvent.selectOptions(
      renderResponse.getByRole("combobox"),
      renderResponse.getByRole("option", { name: "option 1" })
    );
    expect(element?.value).toEqual(1);
  });

  test("error message element exists when the field is invalid", async () => {
    const f = {
      ...field,
      valid: false,
      errorMessage: "Error",
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.queryByText(f.errorMessage)).not.toBeNull();
  });

  test("it should handle visible property", async () => {
    const f = {
      ...field,
      visible: false,
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.queryByTestId("select")).toBeNull();
  });

  test("In case of both tooltip and description, tooltip should be visible and onclick of toggle button, description should be visible", async () => {
    const f = {
      ...field,
      tooltip: "Short Description",
      description: "Mandatory",
    };
    const helper = renderComponent(DropDown);
    const { renderResponse } = await helper(f);
    expect(renderResponse.getByText("Short Description")).not.toBeNull();
    const button = renderResponse.container.getElementsByClassName(
      "cmp-adaptiveform-dropdown__questionmark"
    );
    userEvent.click(button[0]);
    expect(renderResponse.getByText("Mandatory")).not.toBeNull();
  });

  test('html in the label should be handled for non rich text', async () => {
    const f =  {
      ...field,
      label: {
          value: '<p>title inside p tags</p>',
          richText: true,
          visible: true
      }
  }
   let {renderResponse} = await helper(f);
   expect(renderResponse.container.innerHTML).toContain( '<p>title inside p tags</p>');  
  });
});
