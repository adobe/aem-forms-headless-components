import FileUpload from "../../src/components/FileUpload";
import { renderComponent } from "../utils";
import userEvent from "@testing-library/user-event";
import { FileObject } from "@aemforms/af-core";

const field = {
  name: "fileupload",
  label: {
    value: "Upload Image",
  },
  type: "file[]",
  maxFileSize: "5MB",
  fieldType: "file-input",
  visible: true,
};

const fieldTwo = {
  name: "profile",
  format: "data-url",
  type: "string",
  maxFileSize: "8MB",
  label: {
    value: "Profile",
  },
};

const fieldWithValueAndMaxFileSize = {
  name: "profile_image",
  type: "file",
  maxFileSize: "5MB",
  label: {
    value: "Profile Image",
  },
  default: {
    mediaType: "application/pdf",
    name: "abc.pdf",
    size: 2891829,
    data: "http://abc.com/abc.pdf",
  },
};

const fieldWithMultipleFiles = {
  name: "profiles",
  format: "data-url",
  type: "string[]",
  maxFileSize: "10MB",
  fieldType: "file-input",
  label: {
    value: "Multiple Profile",
  },
  default: [
    {
      mediaType: "application/pdf",
      name: "abc.pdf",
      size: 2891829,
      data: "http://abc.com/abc.pdf",
    },
    {
      mediaType: "application/pdf",
      name: "def.pdf",
      size: 2891829,
      data: "http://def.com/def.pdf",
    },
  ],
};

const helper = renderComponent(FileUpload);

describe("File Upload", () => {
  test("render file label", async () => {
    const f = {
      ...field,
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.queryByText(f?.label?.value)).toBeTruthy();
  });

  test("upload mutiple image", async () => {
    const f = {
      ...field,
      accept: "image/png",
    };
    const { renderResponse } = await helper(f);
    const uploadButton = await renderResponse.findByText("Attach");
    const file1 = new File(["(⌐□_□)"], "aaa.png", { type: "image/png" });
    const file2 = new File(["(⌐□_□)"], "bbb.png", { type: "image/png" });
    userEvent.upload(uploadButton, [file1, file2]);
    expect(renderResponse.queryByText("aaa.png")).toBeTruthy();
    expect(renderResponse.queryByText("bbb.png")).toBeTruthy();

    const file3 = new File(["(⌐□_□)"], "ccc.png", { type: "image/png" });
    userEvent.upload(uploadButton, file3);
    expect(renderResponse.queryByText("aaa.png")).toBeTruthy();
    expect(renderResponse.queryByText("bbb.png")).toBeTruthy();
    expect(renderResponse.queryByText("ccc.png")).toBeTruthy();
  });

  test("upload single image", async () => {
    const f = {
      ...field,
      type: "file",
    };
    const { renderResponse } = await helper(f);
    const uploadButton = await renderResponse.findByText("Attach");
    const file = new File(["(⌐□_□)"], "aaa.png", { type: "image/png" });
    userEvent.upload(uploadButton, file);
    expect(renderResponse.queryByText("aaa.png")).toBeTruthy();
  });

  test("upload pdf file", async () => {
    const f = {
      ...field,
    };
    const { renderResponse } = await helper(f);
    const uploadButton = await renderResponse.findByText("Attach");
    const file1 = new File(["(⌐□_□)"], "aaa.pdf", { type: "pdf" });
    userEvent.upload(uploadButton, [file1]);
    expect(renderResponse.queryByText("aaa.pdf")).toBeTruthy();
  });

  test("file input with type file should have correct data and model value", async () => {
    const f = {
      ...fieldWithValueAndMaxFileSize,
    };

    const { form, element } = await helper(f);
    let data = form.exportData();
    expect(data.profile_image).toEqual({
      data: "http://abc.com/abc.pdf",
      mediaType: "application/pdf",
      name: "abc.pdf",
      size: 2891829,
    });
    let state = element?.getState();
    let fieldJson = state;
    let value = fieldJson.value;
    expect(value).not.toBeUndefined();
    // @ts-ignore
    let controller = form?.getElement(fieldJson?.id);
    // in json, max file size is not serialized and is stored as a string
    expect(fieldJson.maxFileSize).toEqual("5MB");
    // in model, maxFileSize should be as number and in bytes so that it can be used in rules
    expect(controller.maxFileSize).toEqual(5242880);
    expect(value).toBeInstanceOf(FileObject);
  });

  test("file input with change in view should update model", async () => {
    const f = {
      ...fieldTwo,
      required: true,
    };

    const { form, element, renderResponse } = await helper(f);
    const input = renderResponse.container.getElementsByClassName(
      "cmp-adaptiveform-fileinput__widget"
    );
    let file = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" });
    // in case of png this is called
    // @ts-ignore
    global.URL.createObjectURL = jest.fn();
    // simulate upload event
    userEvent.upload(input[0] as HTMLInputElement, file);
    let state = element?.getState();
    expect(state.value).toBeInstanceOf(FileObject);
    // @ts-ignore
    expect(state.value?.data).toBeInstanceOf(File);
    // expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    // // check attachments which is to be sent during submit
    // //@ts-ignore
    let attachments = form?.getState().attachments;
    expect(Object.keys(attachments).length).toEqual(1);
  });

  test("file input with type file[] or string[] should have correct data and model value", async () => {
    const f = {
      ...fieldWithMultipleFiles,
    };

    const { form, element, renderResponse } = await helper(f);
    const input = renderResponse.container.getElementsByClassName(
      "cmp-adaptiveform-fileinput__widget"
    );
    let data = form.exportData();
    expect(data.profiles).toEqual([
      "http://abc.com/abc.pdf",
      "http://def.com/def.pdf",
    ]);
    let state = element?.getState();
    let value = state.value;
    expect(value).not.toBeUndefined();
    expect(value).toBeInstanceOf(Array);
    // @ts-ignore
    expect(value.length).toEqual(2);
    // @ts-ignore
    expect(value[0]).toBeInstanceOf(FileObject);
    let file = new File(["(⌐□_□)"], "chucknorris.pdf", {
      type: "application/pdf",
    });
    // simulate upload event
    userEvent.upload(input[0] as HTMLInputElement, file);
    state = element?.getState();
    value = state.value;
    // @ts-ignore
    expect(value.length).toEqual(3);
    // @ts-ignore
    expect(value[2]).toBeInstanceOf(FileObject);
  });

  test("label is null if label is marked as invisible in the field", async () => {
    const field = {
      ...fieldWithValueAndMaxFileSize,
      label: {
        ...fieldWithValueAndMaxFileSize.label,
        visible: false,
      },
    };
    const { renderResponse } = helper(field);
    expect(renderResponse.queryByText(field.label.value)).toBeNull();
  });

  test("required attribute properly set for required field", async () => {
    const f = {
      ...fieldWithValueAndMaxFileSize,
      required: true
    };
    const { renderResponse } = helper(f);
    expect(renderResponse.container.getAttribute('required')).toEqual(null);
  });

  test('html in the label should be handled for non rich text', async () => {
    const f = {
      ...field,
      label: {
        value: '<p>title inside p tags</p>',
        richText: true,
        visible: true
      }
    }
    let { renderResponse } = await helper(f);
    expect(renderResponse.container.innerHTML).toContain('<p>title inside p tags</p>');
  });

  test('labels and inputs are linked with for and id attribute', async () => {
    let { renderResponse } = await helper(field);
    const input = await renderResponse.container.getElementsByClassName('cmp-adaptiveform-fileinput__widget');
    const label = await renderResponse.queryByText(field.label.value);
    expect(input[0]?.getAttribute('id')).toEqual(label?.getAttribute('for'));
  });
});
