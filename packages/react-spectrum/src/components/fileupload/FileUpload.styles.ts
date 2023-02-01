/*

 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// @ts-ignore
import styled from 'styled-components';

export const FileUploadContainer = styled.section`
  position: relative;
  margin: 25px 0 15px;
  border: ${(props: { isError: boolean }) => props.isError ? '2px dotted #c9252d' : '2px dotted lightgray'};
  padding: 35px 20px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
`;

export const FormField = styled.input.attrs((props:any) => ({...props}))`
  font-size: 18px;
  display: block;
  width: 100%;
  border: none;
  text-transform: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;

  &:focus {
    outline: none;
  }
`;

export const InputLabel = styled.label.attrs((props:any) => ({...props}))`
  top: -21px;
  font-size: 13px;
  color: black;
  left: 0;
  position: absolute;
`;

export const DragDropText = styled.p`

  /* Styles for text inside file upload copied from spectrum */
  --formField-fu-text-color: rgb(44, 44, 44);
  --formField-fu-text-font-weight: 300;
  --formField-fu-text-font-family: adobe-clean, "Source Sans Pro";
  --formField-fu-text-font-size: 22px;
  --formField-fu-text-line-height: 28.6px;
  --formField-fu-text-font-style: normal;
  --formField-fu-text-letter-spacing: normal;
  --formField-fu-text-transform: none;
  
  margin-bottom: 15px;
  text-align: center;
  color: var(--formField-fu-text-color);
  font-weight: var(--formField-fu-text-font-weight);
  font-family: var(--formField-fu-text-font-family);
  font-size: var(--formField-fu-text-font-size);
  line-height: var(--formField-fu-text-line-height);
  font-style: var(--formField-fu-text-font-style);
  letter-spacing: var(--formField-fu-text-letter-spacing);
  text-transform: var( --formField-fu-text-transform);
  margin-top: 0;
`;

export const UploadFileBtn = styled.button`

  /* Styles for button inside file upload copied from spectrum */
  --formField-fu-button-padding: 0px;
  --formField-fu-button-border-color: rgb(75, 75, 75);
  --formField-fu-button-color: rgb(75, 75, 75);
  --formField-fu-button-min-height: auto;
  --formField-fu-button-min-width: auto;
  --formField-fu-button-font-size: 14px;
  --formField-fu-button-border-width: 2px;
  --formField-fu-button-font-family: adobe-clean, "Source Sans Pro";
  --formField-fu-button-line-height: 18.2px;
  
  box-sizing: border-box;
  appearance: none;
  background-color: transparent;
  text-align: center;
  font-weight: 700;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: color 250ms ease-in-out;
  width: 30%;
  align-items: center;
  justify-content: center;
  padding: var(--formField-fu-button-padding);
  border-color: var(--formField-fu-button-border-color);
  color: var(--formField-fu-button-color);
  min-height: var(--formField-fu-button-min-height);
  height: auto;
  min-width: var(--formField-fu-button-min-width);
  font-size: var(--formField-fu-button-font-size);
  border-width: var(--formField-fu-button-border-width);
  border-style: solid;
  display: inline-flex;
  margin: 0;
  text-transform: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-appearance: button;
  vertical-align: top;
  text-decoration: none;
  font-family: var(--formField-fu-button-font-family);
  line-height: var(--formField-fu-button-line-height);
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-user-select: none;
  cursor: pointer;

  &:after {
    content: "";
    position: absolute;
    display: block;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 100%;
    background: #3498db;
    z-index: -1;
    transition: width 250ms ease-in-out;
  }

  @media only screen and (max-width: 500px) {
    width: 70%;
  }

  @media only screen and (max-width: 350px) {
    width: 100%;
  }

  &:disabled {
    opacity: 0.4;
    filter: grayscale(100%);
    pointer-events: none;
  }
`;

export const FilePreviewContainer = styled.article`
  margin-bottom: 35px;

  span {
    font-size: 14px;
  }
`;

export const PreviewList = styled.section`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;

  @media only screen and (max-width: 400px) {
    flex-direction: column;
  }
`;

export const FileMetaData = styled.div`
  display: ${(props: { isImageFile: any; }) => (props.isImageFile ? 'none' : 'flex')};
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  background-color: rgba(5, 5, 5, 0.55);

  aside {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
  }
`;

export const RemoveFileIcon = styled.i`
  cursor: pointer;
  &:hover {
    transform: scale(1.3);
  }
  &:after {
    display: inline-block;
    content: "\\00d7"; /* This will render the 'X' */
  }
`;

export const PreviewContainer = styled.section`
  padding: 0.25rem;
  width: 20%;
  height: 120px;
  border-radius: 6px;
  box-sizing: border-box;

  &:hover {
    opacity: 0.55;

    ${FileMetaData} {
      display: flex;
    }
  }

  & > div:first-of-type {
    height: 100%;
    position: relative;
  }

  @media only screen and (max-width: 750px) {
    width: 25%;
  }

  @media only screen and (max-width: 500px) {
    width: 50%;
  }

  @media only screen and (max-width: 400px) {
    width: 100%;
    padding: 0 0 0.4em;
  }
`;

export const ImagePreview = styled.img`
  border-radius: 6px;
  width: 100%;
  height: 100%;
`;

export const InputDescription = styled.div.attrs((props:any) => ({...props}))`
  font-size: 12px;
  color: black;
  margin-top: -12px;
  color: ${(props: { isError: boolean }) => props.isError ? '#c9252d' : ''};
`;