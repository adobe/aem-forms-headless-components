/*
 * Copyright 2026 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import Scribble from '../../src/components/Scribble';
import { renderComponent } from '../utils';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

const BEM = 'cmp-adaptiveform-scribble';

/** Mock canvas 2d context and element so isCanvasEmpty() returns false and toDataURL works in JSDOM */
function mockCanvas2D() {
  const imageData = new Uint8ClampedArray(4);
  imageData[3] = 255;
  const mockCtx = {
    scale: jest.fn(),
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    closePath: jest.fn(),
    fillText: jest.fn(),
    drawImage: jest.fn(),
    getImageData: jest.fn(() => ({ data: imageData })),
    measureText: jest.fn(() => ({ width: 50 })),
    lineWidth: 0,
    lineCap: '',
    lineJoin: '',
    strokeStyle: '',
    font: '',
    fillStyle: '',
  };
  const dataUrl = 'data:image/png;name=fd_type_signature.png;base64,mock';
  const getContext = HTMLCanvasElement.prototype.getContext;
  const getBoundingClientRect = HTMLCanvasElement.prototype.getBoundingClientRect;
  const toDataURL = HTMLCanvasElement.prototype.toDataURL;
  HTMLCanvasElement.prototype.getContext = jest.fn(function (this: HTMLCanvasElement, type: string) {
    if (type === '2d') return mockCtx as any;
    return getContext.call(this, type as any);
  });
  HTMLCanvasElement.prototype.getBoundingClientRect = jest.fn(() => ({ width: 200, height: 100, top: 0, left: 0, right: 200, bottom: 100, x: 0, y: 0, toJSON: () => ({}) }));
  HTMLCanvasElement.prototype.toDataURL = jest.fn(() => dataUrl);
  return () => {
    HTMLCanvasElement.prototype.getContext = getContext;
    HTMLCanvasElement.prototype.getBoundingClientRect = getBoundingClientRect;
    HTMLCanvasElement.prototype.toDataURL = toDataURL;
  };
}
const IS = 'adaptiveFormScribble';

const field = {
  name: 'scribble',
  id: 'scribble-1',
  visible: true,
  enabled: true,
  required: false,
  valid: true,
  label: {
    value: 'Sign here',
  },
  description: 'Please provide your signature.',
  fieldType: 'scribble',
  properties: {
    'fd:dialogLabel': 'Please sign here',
  },
};

const helper = renderComponent(Scribble);

describe('Scribble', () => {
  test('should render scribble field with label and container', async () => {
    const f = { ...field };
    const { renderResponse } = await helper(f);
    expect(renderResponse.getByText(f.label.value)).toBeInTheDocument();
    const container = renderResponse.container.querySelector(`.${BEM}`);
    expect(container).toBeInTheDocument();
    const signedContainer = renderResponse.container.querySelector(`.${BEM}__canvas-signed-container`);
    expect(signedContainer).toBeInTheDocument();
  });

  test('should have correct data attributes', async () => {
    const f = { ...field };
    const { renderResponse } = await helper(f);
    const scribble = renderResponse.container.querySelector(`[data-cmp-is="${IS}"]`);
    expect(scribble).toBeInTheDocument();
    expect(scribble).toHaveAttribute('data-cmp-is', IS);
    expect(scribble).toHaveAttribute('data-cmp-visible', 'true');
    expect(scribble).toHaveAttribute('data-cmp-enabled', 'true');
  });

  test('should open the scribble modal when signed container is clicked', async () => {
    const f = { ...field };
    const { renderResponse } = await helper(f);
    const signedContainer = renderResponse.container.querySelector(`.${BEM}__canvas-signed-container`);
    expect(signedContainer).toBeInTheDocument();
    userEvent.click(signedContainer!);
    const modal = renderResponse.container.querySelector(`.${BEM}__container`);
    expect(modal).toBeInTheDocument();
    expect(modal).toBeVisible();
  });

  test('modal should have correct accessibility attributes when open', async () => {
    const f = { ...field };
    const { renderResponse } = await helper(f);
    const signedContainer = renderResponse.container.querySelector(`.${BEM}__canvas-signed-container`);
    userEvent.click(signedContainer!);
    const modal = renderResponse.container.querySelector(`.${BEM}__container`);
    expect(modal).toHaveAttribute('role', 'dialog');
    expect(modal).toHaveAttribute('aria-label', f.properties['fd:dialogLabel']);
    expect(modal).toHaveAttribute('aria-modal', 'true');
    const canvas = renderResponse.container.querySelector(`.${BEM}__canvas`);
    expect(canvas).toHaveAttribute('aria-label', 'Signature canvas');
  });

  test('label should have for attribute linking to widget', async () => {
    const f = { ...field, id: 'scribble-field-1' };
    const { renderResponse } = await helper(f);
    const label = renderResponse.getByText(f.label.value);
    expect(label).toHaveAttribute('for');
    const labelFor = label.getAttribute('for');
    expect(labelFor).toBeTruthy();
  });

  test('should close the modal when close button is clicked', async () => {
    const f = { ...field };
    const { renderResponse } = await helper(f);
    const signedContainer = renderResponse.container.querySelector(`.${BEM}__canvas-signed-container`);
    userEvent.click(signedContainer!);
    expect(renderResponse.container.querySelector(`.${BEM}__container`)).toBeInTheDocument();
    const closeButton = renderResponse.getByRole('button', { name: 'Close' });
    userEvent.click(closeButton);
    expect(renderResponse.container.querySelector(`.${BEM}__container`)).not.toBeInTheDocument();
  });

  test('should clear the signature content when clear is clicked in text mode', async () => {
    const f = { ...field };
    const { renderResponse } = await helper(f);
    const signedContainer = renderResponse.container.querySelector(`.${BEM}__canvas-signed-container`);
    userEvent.click(signedContainer!);
    const textSignButton = renderResponse.getByRole('button', { name: 'Text sign' });
    userEvent.click(textSignButton);
    const textInput = renderResponse.getByRole('textbox', { name: 'Signature text' });
    expect(textInput).toHaveValue('');
    await userEvent.type(textInput, 'test');
    expect(textInput).toHaveValue('test');
    const clearButton = renderResponse.getByRole('button', { name: 'Clear' });
    expect(clearButton).toBeEnabled();
    userEvent.click(clearButton);
    expect(textInput).toHaveValue('');
  });

  test('should not clear signature when clear is cancelled, then clear when confirmed', async () => {
    const restore = mockCanvas2D();
    try {
      const f = { ...field };
      const { renderResponse, element } = await helper(f);
      const signedContainer = renderResponse.container.querySelector(`.${BEM}__canvas-signed-container`);
      userEvent.click(signedContainer!);
      const textSignButton = renderResponse.getByRole('button', { name: 'Text sign' });
      userEvent.click(textSignButton);
      const textInput = renderResponse.getByRole('textbox', { name: 'Signature text' });
      await userEvent.type(textInput, 'test');
      const saveButton = renderResponse.getByRole('button', { name: 'Save' });
      userEvent.click(saveButton);

      const signedImage = renderResponse.container.querySelector(`.${BEM}__canvas-signed-image`);
      expect(signedImage).toBeInTheDocument();
    expect(signedImage).toHaveAttribute('src');
    expect(signedImage).toHaveAttribute('alt', 'Signature');

    const clearSignButton = renderResponse.getByRole('button', { name: 'Clear Signature' });
    expect(clearSignButton).toBeInTheDocument();
    userEvent.click(clearSignButton);

    const confirmDialog = renderResponse.container.querySelector(`.${BEM}__clearsign-container`);
    expect(confirmDialog).toBeVisible();
    expect(confirmDialog).toHaveAttribute('aria-label', 'Erase Current Signature?');

    const cancelButton = renderResponse.getByRole('button', { name: 'Cancel' });
    userEvent.click(cancelButton);
    expect(renderResponse.container.querySelector(`.${BEM}__clearsign-container`)).not.toBeInTheDocument();
    expect(renderResponse.container.querySelector(`.${BEM}__canvas-signed-image`)).toBeInTheDocument();
    expect(renderResponse.container.querySelector(`.${BEM}__canvas-signed-image`)?.getAttribute('src')).toBeTruthy();

    userEvent.click(clearSignButton);
    const confirmClearButton = renderResponse.getByRole('button', { name: 'Clear' });
    userEvent.click(confirmClearButton);
    expect(renderResponse.container.querySelector(`.${BEM}__clear-sign`)).not.toBeInTheDocument();
    expect(renderResponse.container.querySelector(`.${BEM}__canvas-signed-image`)).not.toBeInTheDocument();
    expect(element?.value == null).toBe(true);
    } finally {
      restore();
    }
  });

  test('should display brush list with correct accessibility when brush button is clicked', async () => {
    const f = { ...field };
    const { renderResponse } = await helper(f);
    const signedContainer = renderResponse.container.querySelector(`.${BEM}__canvas-signed-container`);
    userEvent.click(signedContainer!);
    expect(renderResponse.container.querySelector(`.${BEM}__brushlist`)).not.toBeInTheDocument();

    const brushButton = renderResponse.getByRole('button', { name: 'Brushes' });
    userEvent.click(brushButton);
    const brushListVisible = renderResponse.container.querySelector(`.${BEM}__brushlist`);
    expect(brushListVisible).toBeInTheDocument();
    expect(brushListVisible).toHaveAttribute('aria-label', 'Brush size selection');
    const brushCanvases = renderResponse.container.querySelectorAll(`.${BEM}__brushlist canvas`);
    brushCanvases.forEach((canvas, index) => {
      const size = [2, 3, 4, 5, 6, 7, 8, 9, 10][index];
      expect(canvas).toHaveAttribute('aria-label', `Brush size ${size}`);
    });

    userEvent.click(brushButton);
    expect(renderResponse.container.querySelector(`.${BEM}__brushlist`)).not.toBeInTheDocument();
  });

  test('text sign flow: type text and save updates model and shows signed image', async () => {
    const restore = mockCanvas2D();
    try {
      const f = { ...field };
      const { renderResponse, element } = await helper(f);
      const signedContainer = renderResponse.container.querySelector(`.${BEM}__canvas-signed-container`);
      userEvent.click(signedContainer!);
      expect(renderResponse.getByRole('button', { name: 'Save' })).toBeDisabled();
      const textSignButton = renderResponse.getByRole('button', { name: 'Text sign' });
      userEvent.click(textSignButton);
      const textInput = renderResponse.getByRole('textbox', { name: 'Signature text' });
      await userEvent.type(textInput, 'My Signature');
      const saveButton = renderResponse.getByRole('button', { name: 'Save' });
      expect(saveButton).toBeEnabled();
      userEvent.click(saveButton);
      expect(renderResponse.container.querySelector(`.${BEM}__container`)).not.toBeInTheDocument();
      expect(renderResponse.container.querySelector(`.${BEM}__canvas-signed-image`)).toBeInTheDocument();
      const dataUrl = element?.value;
      expect(typeof dataUrl).toBe('string');
      expect(dataUrl).toMatch(/^data:image\/png;name=fd_type_signature\.png;base64/);
    } finally {
      restore();
    }
  });

  test('should not render when visible is false', async () => {
    const f = { ...field, visible: false };
    const { renderResponse } = await helper(f);
    const scribble = renderResponse.container.querySelector(`[data-cmp-is="${IS}"]`);
    expect(scribble).not.toBeInTheDocument();
  });

  test('should not open modal when disabled', async () => {
    const f = { ...field, enabled: false };
    const { renderResponse } = await helper(f);
    const signedContainer = renderResponse.container.querySelector(`.${BEM}__canvas-signed-container`);
    userEvent.click(signedContainer!);
    expect(renderResponse.container.querySelector(`.${BEM}__container`)).not.toBeInTheDocument();
  });

  test('should use custom dialog label from properties', async () => {
    const f = {
      ...field,
      properties: { 'fd:dialogLabel': 'Custom sign dialog' },
    };
    const { renderResponse } = await helper(f);
    const signedContainer = renderResponse.container.querySelector(`.${BEM}__canvas-signed-container`);
    userEvent.click(signedContainer!);
    const modal = renderResponse.container.querySelector(`.${BEM}__container`);
    expect(modal).toHaveAttribute('aria-label', 'Custom sign dialog');
    expect(renderResponse.getByRole('heading', { name: 'Custom sign dialog' })).toBeInTheDocument();
  });
});
