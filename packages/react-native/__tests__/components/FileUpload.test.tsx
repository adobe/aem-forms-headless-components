import { fireEvent } from '@testing-library/react-native';
import FileUpload from '../../src/components/FileUpload';
import { renderComponent } from '../utils';

const field = {
  name: 'fileupload',
  label: {
    value: 'Upload Image',
  },
  type: "file[]",
  maxFileSize: "5MB",
  fieldType: 'file-input',
  visible: true
};
const helper = renderComponent(FileUpload);

describe('File Upload', () => {

  test('render file label', async () => {
    const f = {
      ...field,
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.findByText(f?.label?.value)).toBeTruthy();
  });

  test('upload mutiple image', async () => {
    const f = {
      ...field,
      accept: 'image/png'
    };
    const { renderResponse } = await helper(f);
    const uploadButton = await renderResponse.findByText('Upload');
    const file1 = new File(['(⌐□_□)'], 'aaa.png', { type: 'image/png' });
    const file2 = new File(['(⌐□_□)'], 'bbb.png', { type: 'image/png' });
    fireEvent.press(uploadButton, [file1, file2]);
    expect(renderResponse.findByText('aaa.png')).toBeTruthy();
    expect(renderResponse.findByText('bbb.png')).toBeTruthy();

    const file3 = new File(['(⌐□_□)'], 'ccc.png', { type: 'image/png' });
    fireEvent.press(uploadButton, file3);
    expect(renderResponse.findByText('aaa.png')).toBeTruthy();
    expect(renderResponse.findByText('bbb.png')).toBeTruthy();
    expect(renderResponse.findByText('ccc.png')).toBeTruthy();
  });

  test('upload image without accept', async () => {
    const f = {
      ...field,
      accept: "",
    };
    const { renderResponse } = await helper(f);
    const uploadButton = await renderResponse.findByText('Upload');
    const file = new File(['(⌐□_□)'], 'aaa.png', { type: 'image/png' });
    fireEvent.press(uploadButton, file);
    expect(renderResponse.findByText('aaa.png')).toBeTruthy();
  });

  test('upload single image', async () => {
    const f = {
      ...field,
      type: "file",
    };
    const { renderResponse } = await helper(f);
    const uploadButton = await renderResponse.findByText('Upload');
    const file = new File(['(⌐□_□)'], 'aaa.png', { type: 'image/png' });
    fireEvent.press(uploadButton, file);
    expect(renderResponse.findByText('aaa.png')).toBeTruthy();
  });

  test('upload pdf files', async () => {
    const f = {
      ...field,
    };
    const { renderResponse } = await helper(f);
    const uploadButton = await renderResponse.findByText('Upload');
    const file1 = new File(['(⌐□_□)'], 'aaa.pdf', { type: 'pdf' });
    const file2 = new File(['(⌐□_□)'], 'bbb.png', { type: 'pdf' });
    fireEvent.press(uploadButton, [file1, file2]);
    expect(renderResponse.findByText('aaa.pdf')).toBeTruthy();
    expect(renderResponse.findByText('bbb.pdf')).toBeTruthy();
  });

})