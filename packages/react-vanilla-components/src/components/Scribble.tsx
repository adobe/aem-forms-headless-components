// *******************************************************************************
//  * Copyright 2025 Adobe
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.

//  * The BEM markup is as per the AEM core form components guidelines.
//  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/scribble/v1/scribble/scribble.html
//  ******************************************************************************

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';
import { syncAriaDescribedBy } from '../utils/utils';
import FieldWrapper from './common/FieldWrapper';

const BRUSH_SIZES = [2, 3, 4, 5, 6, 7, 8, 9, 10];
const BEM = 'cmp-adaptiveform-scribble';

const Scribble = (props: PROPS) => {
  const {
    id,
    label,
    value,
    enabled,
    visible,
    required,
    valid,
    appliedCssClassNames,
    properties
  } = props;

  const dialogLabel = properties?.['fd:dialogLabel'] || 'Please sign here';
  const placeholder = (props as any).placeholder || 'Type Your Signature Here';

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const geoCanvasRef = useRef<HTMLCanvasElement>(null);
  const keyboardInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(
    typeof value === 'string' ? value : null
  );
  const [brushSize, setBrushSize] = useState(3);
  const [showBrushList, setShowBrushList] = useState(false);
  const [textMode, setTextMode] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [hasContent, setHasContent] = useState(false);

  const drawingRef = useRef(false);
  const brushSizeRef = useRef(brushSize);

  useEffect(() => {
    brushSizeRef.current = brushSize;
  }, [brushSize]);

  useEffect(() => {
    if (typeof value === 'string' && value !== signatureDataUrl) {
      setSignatureDataUrl(value || null);
    }
  }, [value]);

  const showTemporaryMessage = useCallback((msg: string) => {
    setMessage(msg);
    const timer = setTimeout(() => setMessage(''), 15000);
    return () => clearTimeout(timer);
  }, []);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {return;}
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineWidth = brushSizeRef.current;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#000';
    }
  }, []);

  useEffect(() => {
    if (modalOpen && !textMode) {
      requestAnimationFrame(() => {
        initCanvas();
      });
    }
  }, [modalOpen, textMode, initCanvas]);

  useEffect(() => {
    if (modalOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [modalOpen]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) {return null;}
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e && e.touches.length > 0) {
      const touch = e.touches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    } else if ('clientX' in e) {
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    return null;
  };

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) {return;}
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!ctx) {return;}
    ctx.lineWidth = brushSizeRef.current;
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    drawingRef.current = true;
  }, []);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!drawingRef.current) {return;}
    const coords = getCoordinates(e);
    if (!coords) {return;}
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!ctx) {return;}
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setHasContent(true);
  }, []);

  const stopDrawing = useCallback(() => {
    if (!drawingRef.current) {return;}
    const ctx = canvasRef.current?.getContext('2d', { willReadFrequently: true });
    if (ctx) {ctx.closePath();}
    drawingRef.current = false;
  }, []);

  const eraseCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {ctx.clearRect(0, 0, canvas.width, canvas.height);}
    }
    const geoCanvas = geoCanvasRef.current;
    if (geoCanvas) {
      const geoCtx = geoCanvas.getContext('2d');
      if (geoCtx) {geoCtx.clearRect(0, 0, geoCanvas.width, geoCanvas.height);}
      geoCanvas.width = 0;
      geoCanvas.height = 0;
    }
    if (keyboardInputRef.current) {
      keyboardInputRef.current.value = '';
    }
    setHasContent(false);
    setTextMode(false);
  }, []);

  const buildDataUrl = useCallback((): string | null => {
    const sigCanvas = canvasRef.current;
    if (!sigCanvas) {return null;}

    const geoCanvas = geoCanvasRef.current;
    const hasGeo = geoCanvas && geoCanvas.width > 0 && geoCanvas.height > 0;

    if (hasGeo) {
      const merged = document.createElement('canvas');
      merged.width = Math.max(sigCanvas.width, geoCanvas!.width);
      merged.height = sigCanvas.height + geoCanvas!.height;
      const ctx = merged.getContext('2d');
      if (!ctx) {return null;}
      ctx.drawImage(sigCanvas, 0, 0);
      ctx.drawImage(geoCanvas!, 0, sigCanvas.height);
      return merged.toDataURL('image/png').replace(
        'data:image/png;base64,',
        'data:image/png;name=fd_type_signature.png;base64,'
      );
    }

    return sigCanvas.toDataURL('image/png').replace(
      'data:image/png;base64,',
      'data:image/png;name=fd_type_signature.png;base64,'
    );
  }, []);

  const isCanvasEmpty = useCallback((): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) {return true;}
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {return true;}
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] > 0) {return false;}
    }
    return true;
  }, []);

  const handleSave = useCallback(() => {
    if (textMode) {
      const textVal = keyboardInputRef.current?.value;
      if (!textVal) {return;}
      const canvas = canvasRef.current;
      if (!canvas) {return;}
      initCanvas();
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {return;}
      const rect = canvas.getBoundingClientRect();
      const fontFamily = 'sans-serif, Georgia';
      const fontStyle = 'italic';
      let fontSize = 10;
      ctx.font = `${fontStyle} ${fontSize}rem ${fontFamily}`;
      let textWidth = ctx.measureText(textVal).width;
      while (fontSize > 1 && textWidth > rect.width) {
        fontSize -= 0.5;
        ctx.font = `${fontStyle} ${fontSize}rem ${fontFamily}`;
        textWidth = ctx.measureText(textVal).width;
      }
      ctx.fillText(textVal, 0, rect.height / 2);
    }

    if (isCanvasEmpty()) {return;}

    const dataUrl = buildDataUrl();
    if (dataUrl) {
      setSignatureDataUrl(dataUrl);
      props.dispatchChange(dataUrl);
    }
    setModalOpen(false);
    setTextMode(false);
    setShowBrushList(false);
    setMessage('');
  }, [textMode, isCanvasEmpty, buildDataUrl, initCanvas, props.dispatchChange]);

  const handleClose = useCallback(() => {
    eraseCanvas();
    setModalOpen(false);
    setTextMode(false);
    setShowBrushList(false);
    setMessage('');
  }, [eraseCanvas]);

  const handleClearSignature = useCallback(() => {
    setSignatureDataUrl(null);
    props.dispatchChange(undefined);
    setShowClearConfirm(false);
    eraseCanvas();
  }, [eraseCanvas, props.dispatchChange]);

  const handleTextSign = useCallback(() => {
    eraseCanvas();
    setTextMode(true);
  }, [eraseCanvas]);

  const handleBrushMode = useCallback(() => {
    if (textMode) {
      eraseCanvas();
      setTextMode(false);
      requestAnimationFrame(() => initCanvas());
    }
    setShowBrushList(prev => !prev);
  }, [textMode, eraseCanvas, initCanvas]);

  const handleSelectBrush = useCallback((size: number) => {
    setBrushSize(size);
    brushSizeRef.current = size;
    setShowBrushList(false);
  }, []);

  const handleGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      showTemporaryMessage('Geolocation is not supported by this browser.');
      return;
    }
    showTemporaryMessage('Fetching geolocation...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMessage('');
        const { latitude, longitude } = position.coords;
        const dateObj = new Date();
        const tZone = (dateObj.getTimezoneOffset() / 60) * -1;
        const latStr = `Latitude: ${latitude}`;
        const longStr = `Longitude: ${longitude}`;
        const timeStr = `${dateObj.getTime()}: ${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()} ${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}${tZone > 0 ? ' +' : ' '}${tZone}`;

        const geoCanvas = geoCanvasRef.current;
        if (geoCanvas) {
          geoCanvas.style.display = 'block';
          geoCanvas.width = 200;
          geoCanvas.height = 50;
          const ctx = geoCanvas.getContext('2d');
          if (ctx) {
            ctx.font = 'bold 10px Arial';
            ctx.fillStyle = 'black';
            ctx.fillText(latStr, 0, 15);
            ctx.fillText(longStr, 0, 30);
            ctx.fillText(timeStr, 0, 45);
          }
        }
      },
      () => {
        showTemporaryMessage('Error fetching geolocation.');
      },
      { timeout: 10000 }
    );
  }, [showTemporaryMessage]);

  const handleKeyboardInput = useCallback(() => {
    const val = keyboardInputRef.current?.value;
    setHasContent(!!val);
  }, []);

  const openModal = useCallback(() => {
    if (!enabled) {return;}
    setModalOpen(true);
    setHasContent(false);
    setTextMode(false);
    setShowBrushList(false);
    setMessage('');
  }, [enabled]);

  const isFilled = !!signatureDataUrl;

  return (
    <div
      className={`${BEM} ${isFilled ? `${BEM}--filled` : `${BEM}--empty`} ${appliedCssClassNames || ''}`}
      data-cmp-is="adaptiveFormScribble"
      data-cmp-visible={visible}
      data-cmp-enabled={enabled}
      data-cmp-required={required}
      data-cmp-valid={valid}
    >
      <FieldWrapper
        bemBlock={BEM}
        label={label}
        id={id}
        tooltip={props.tooltip}
        description={props.description}
        isError={props.isError}
        errorMessage={props.errorMessage}
      >
        <button
          type="button"
          className={`${BEM}__canvas-signed-container`}
          title="Signature Canvas"
          onClick={openModal}
          disabled={!enabled}
          aria-label={label?.visible === false ? label?.value : 'Open signature pad'}
          aria-describedby={syncAriaDescribedBy(id, props.tooltip, props.description, props.errorMessage)}
        >
          {signatureDataUrl ? (
            <img
              className={`${BEM}__canvas-signed-image`}
              src={signatureDataUrl}
              alt="Signature"
              style={{ width: '100%', height: '150px' }}
            />
          ) : null}
        </button>

        {signatureDataUrl && enabled && (
          <div
            className={`${BEM}__clear-sign`}
            role="button"
            tabIndex={0}
            aria-label="Clear Signature"
            onClick={(e) => { e.stopPropagation(); setShowClearConfirm(true); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowClearConfirm(true);
              }
            }}
          />
        )}
      </FieldWrapper>

      {/* Signature modal dialog */}
      {modalOpen && (
        <div
          className={`${BEM}__container`}
          role="dialog"
          aria-label={dialogLabel}
          aria-modal="true"
          tabIndex={-1}
          ref={modalRef}
        >
          <div className={`${BEM}__header`} aria-live="polite" role="heading">
            {dialogLabel}
          </div>
          <div className={`${BEM}__content`}>
            <div className={`${BEM}__canvases`}>
              <div className={`${BEM}__signcanvases`} style={{ display: 'inline-block', verticalAlign: 'top', width: '100%' }}>
                {!textMode ? (
                  <canvas
                    ref={canvasRef}
                    className={`${BEM}__canvas`}
                    aria-label="Signature canvas"
                    style={{ width: '100%', height: '200px', border: '1px dashed #AAAAAA', touchAction: 'none' }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    onTouchCancel={stopDrawing}
                  />
                ) : (
                  <input
                    ref={keyboardInputRef}
                    type="text"
                    className={`${BEM}__keyboard-sign-box`}
                    placeholder={placeholder}
                    aria-label="Signature text"
                    style={{ display: 'block', width: '100%', font: 'italic 2rem sans-serif, Georgia', padding: '8px', boxSizing: 'border-box' }}
                    onInput={handleKeyboardInput}
                    autoFocus
                  />
                )}
              </div>
              <canvas
                ref={geoCanvasRef}
                className={`${BEM}__geocanvas`}
                width={0}
                height={0}
                aria-label="Geolocation"
                style={{ display: 'none' }}
              />
            </div>

            <div className={`${BEM}__controlpanel`}>
              <div className={`${BEM}__controls`}>
                <button
                  type="button"
                  className={`${BEM}__control-brush ${BEM}__button`}
                  aria-label="Brushes"
                  onClick={handleBrushMode}
                >
                  Brush
                </button>

                {showBrushList && (
                  <div className={`${BEM}__brushlist`} aria-label="Brush size selection">
                    {BRUSH_SIZES.map((size) => (
                      <div key={size} onClick={() => handleSelectBrush(size)} style={{ cursor: 'pointer', padding: '2px 0' }}>
                        <canvas
                          aria-label={`Brush size ${size}`}
                          width={100}
                          height={20}
                          style={{ border: '1px solid #AAAAAA', backgroundColor: brushSize === size ? '#e0e0e0' : 'white' }}
                          ref={(el) => {
                            if (el) {
                              const ctx = el.getContext('2d');
                              if (ctx) {
                                ctx.clearRect(0, 0, 100, 20);
                                ctx.lineWidth = size;
                                ctx.beginPath();
                                ctx.moveTo(10, 10);
                                ctx.lineTo(90, 10);
                                ctx.stroke();
                              }
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  className={`${BEM}__control-clear ${BEM}__button`}
                  aria-label="Clear"
                  disabled={!hasContent}
                  onClick={eraseCanvas}
                >
                  Clear
                </button>

                <button
                  type="button"
                  className={`${BEM}__control-geo ${BEM}__button`}
                  aria-label="Geolocation"
                  onClick={handleGeolocation}
                >
                  Geo
                </button>

                <button
                  type="button"
                  className={`${BEM}__control-text ${BEM}__button`}
                  aria-label="Text sign"
                  onClick={handleTextSign}
                >
                  Text
                </button>

                {message && (
                  <div className={`${BEM}__control-message`}>{message}</div>
                )}
              </div>

              <div className={`${BEM}__controlpanel-controls`}>
                <button
                  className={`${BEM}__close-button`}
                  type="button"
                  aria-label="Close"
                  onClick={handleClose}
                >
                  Close
                </button>
                <button
                  className={`${BEM}__save-button`}
                  type="button"
                  aria-label="Save"
                  disabled={!hasContent}
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear signature confirmation dialog */}
      {showClearConfirm && (
        <div className={`${BEM}__clearsign-container`}>
          <h2 className={`${BEM}__clearsign-title`}>Erase Current Signature?</h2>
          <div className={`${BEM}__clearsign-content`}>
            <div className={`${BEM}__clearsign-message`}>
              This will permanently remove the signature you&apos;ve drawn. Do you wish to proceed and begin again?
            </div>
            <div className={`${BEM}__clearsign-panel`}>
              <button
                type="button"
                className={`${BEM}__button--secondary`}
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`${BEM}__button--primary`}
                onClick={handleClearSignature}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withRuleEngine(Scribble);
