import React, { useRef, useState, useEffect } from 'react';

/**
 * VideoDemo component
 * - Upload a video or use the camera
 * - Capture frames periodically and send base64 frames to a Roboflow proxy
 * - Draw predictions as bounding boxes on a canvas
 *
 * Notes:
 * - The proxy URL is taken from REACT_APP_ROBOFLOW_PROXY_URL or defaults to http://localhost:4000/roboflow
 * - The client does NOT send any api_key; the proxy should inject it server-side.
 */

const PROXY_URL = process.env.REACT_APP_ROBOFLOW_PROXY_URL || 'http://localhost:4000/roboflow';

function stripDataUrlPrefix(dataUrl) {
  const comma = dataUrl.indexOf(',');
  return comma === -1 ? dataUrl : dataUrl.slice(comma + 1);
}

const VideoDemo = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const captureTimerRef = useRef(null);

  const [mode, setMode] = useState(null); // 'upload' | 'camera' | null
  const [intervalMs, setIntervalMs] = useState(500);
  const [running, setRunning] = useState(false);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    return () => {
      stopCapture();
      // stop camera if running
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((t) => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = (e) => {
    stopCapture();
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    
    const v = videoRef.current;
    if (!v) {
      console.error('Video element not found');
      return;
    }

    // Clean up previous video URL
    if (v.src && v.src.startsWith('blob:')) {
      URL.revokeObjectURL(v.src);
    }
    
    const url = URL.createObjectURL(file);
    v.srcObject = null;
    v.src = url;
    v.controls = true;
    
    // Wait for video to be ready before playing
    v.onloadedmetadata = () => {
      console.log('Video metadata loaded:', v.videoWidth, 'x', v.videoHeight);
      v.play().catch(err => {
        console.error('Video play error:', err);
        alert('Error playing video: ' + err.message);
      });
    };
    
    v.onerror = (err) => {
      console.error('Video load error:', err);
      alert('Error loading video. Please try a different video format.');
    };
    
    setMode('upload');
  };

  const startCamera = async () => {
    stopCapture();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      const v = videoRef.current;
      if (!v) {
        console.error('Video element not found');
        return;
      }
      
      // Clean up previous stream
      if (v.srcObject) {
        const tracks = v.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      // Clean up any uploaded video URL
      if (v.src && v.src.startsWith('blob:')) {
        URL.revokeObjectURL(v.src);
      }
      
      v.srcObject = stream;
      v.src = ''; // Clear src when using srcObject
      v.controls = false;
      
      v.play().catch(err => {
        console.error('Video play error:', err);
        alert('Error playing camera stream: ' + err.message);
      });
      
      // Wait for video to be ready
      v.onloadedmetadata = () => {
        console.log('Camera stream ready:', v.videoWidth, 'x', v.videoHeight);
      };
      
      v.onerror = (err) => {
        console.error('Video error:', err);
        alert('Error with camera stream');
      };
      
      setMode('camera');
    } catch (err) {
      console.error('Camera start error:', err);
      alert('Cannot access camera: ' + err.message);
    }
  };

  const captureFrameBase64 = () => {
    const v = videoRef.current;
    const c = canvasRef.current;
    if (!v || !c) {
      console.warn('Video or canvas element not found');
      return null;
    }
    
    // Check if video is ready
    if (!v.readyState || v.readyState < 2) {
      console.warn('Video not ready, readyState:', v.readyState);
      return null;
    }
    
    // Check if video has dimensions
    const width = v.videoWidth;
    const height = v.videoHeight;
    if (!width || !height || width === 0 || height === 0) {
      console.warn('Video dimensions not available:', width, 'x', height);
      return null;
    }
    
    const ctx = c.getContext('2d');
    c.width = width;
    c.height = height;
    
    try {
      ctx.drawImage(v, 0, 0, width, height);
      const dataUrl = c.toDataURL('image/jpeg', 0.8);
      return dataUrl;
    } catch (err) {
      console.error('capture error', err);
      return null;
    }
  };

  // Replace the direct Roboflow URL with your proxy and remove sending api_key from the client
  const sendFrameToRoboflow = async (frameDataUrl) => {
    const base64 = stripDataUrlPrefix(frameDataUrl);
    const payload = {
      // Do NOT include api_key here; the proxy will add it server-side
      inputs: {
        image: { type: 'base64', value: base64 }
      }
    };

    try {
      const resp = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await resp.json();
      
      // Log the full response to console for debugging
      console.log('=== Roboflow Proxy Response ===');
      console.log('Full Response:', json);
      console.log('Status:', resp.status);
      console.log('Predictions:', json.predictions || 'No predictions found');
      console.log('==============================');
      
      if (json && json.predictions) {
        setPredictions(json.predictions);
      } else {
        setPredictions([]);
        if (json.error) {
          console.warn('Roboflow API Error:', json.error, json);
        }
      }
      return json;
    } catch (err) {
      console.error('Roboflow proxy request error', err);
      console.error('Error details:', err.message);
      if (err.message.includes('fetch')) {
        console.error('Network error - is the Roboflow proxy running on port 4000?');
        alert('Cannot connect to Roboflow proxy. Please ensure it is running on port 4000.');
      }
      return null;
    }
  };

  const overlayDetections = (frameDataUrl, preds = []) => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const img = new Image();
    img.onload = () => {
      c.width = img.width;
      c.height = img.height;
      ctx.drawImage(img, 0, 0, c.width, c.height);

      ctx.lineWidth = 2;
      ctx.font = '16px Arial';

      preds.forEach((pred) => {
        // Try common bbox shapes: pred.x/y/width/height or pred.bbox.{x,y,width,height}
        let x = pred.x ?? pred.bbox?.x ?? 0;
        let y = pred.y ?? pred.bbox?.y ?? 0;
        let width = pred.width ?? pred.bbox?.width ?? pred.bbox?.w ?? 0;
        let height = pred.height ?? pred.bbox?.height ?? pred.bbox?.h ?? 0;

        // If normalized coordinates (0..1), convert to pixels
        if (x > 0 && x <= 1 && c.width) x = x * c.width;
        if (y > 0 && y <= 1 && c.height) y = y * c.height;
        if (width > 0 && width <= 1 && c.width) width = width * c.width;
        if (height > 0 && height <= 1 && c.height) height = height * c.height;

        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.stroke();

        ctx.fillStyle = 'red';
        const label = pred.class ?? pred.label ?? pred?.classification?.predicted_class ?? '';
        const conf = pred.confidence ?? pred?.score ?? null;
        const text = label + (conf ? ' ' + (conf * 100).toFixed(0) + '%' : '');
        ctx.fillText(text, Math.max(2, x), Math.max(14, y - 5));
      });
    };
    img.src = frameDataUrl;
  };

  const startCapture = () => {
    if (running) return;
    
    const v = videoRef.current;
    if (!v) {
      alert('Video element not found!');
      return;
    }
    
    // Check if video is ready (either uploaded video or camera stream)
    const hasVideo = v.src || v.srcObject;
    if (!hasVideo) {
      alert('Please upload a video or start camera first!');
      return;
    }
    
    // For camera stream, wait a bit for it to initialize
    if (v.srcObject && !v.videoWidth) {
      console.log('Waiting for camera stream to be ready...');
      const checkReady = () => {
        if (v.videoWidth > 0 && v.videoHeight > 0) {
          console.log('Camera ready, starting capture');
          startCaptureInterval();
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
      return;
    }
    
    // For uploaded video, wait for metadata if needed
    if (v.src && v.readyState < 2) {
      console.log('Waiting for video metadata to load...');
      v.onloadeddata = () => {
        console.log('Video ready, starting capture');
        startCaptureInterval();
      };
      return;
    }
    
    // Start capture immediately if ready
    startCaptureInterval();
  };

  const startCaptureInterval = () => {
    if (running) return;
    
    setRunning(true);
    console.log('Starting capture interval...');

    const doCapture = async () => {
      const frame = captureFrameBase64();
      if (!frame) {
        console.warn('Frame capture failed, skipping...');
        return;
      }
      try {
        const res = await sendFrameToRoboflow(frame);
        overlayDetections(frame, (res && res.predictions) || []);
      } catch (err) {
        console.error('Error in capture cycle:', err);
      }
    };

    // Do first capture immediately
    doCapture();
    // Then set up interval
    captureTimerRef.current = setInterval(doCapture, intervalMs);
  };

  const stopCapture = () => {
    setRunning(false);
    if (captureTimerRef.current) {
      clearInterval(captureTimerRef.current);
      captureTimerRef.current = null;
    }
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h3>Video / Camera Demo (Roboflow via Proxy)</h3>

      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ minWidth: 260 }}>
          <div>
            <label>
              Upload video:
              <input type="file" accept="video/*" onChange={handleUpload} style={{ display: 'block', marginTop: 8 }} />
            </label>
          </div>

          <div style={{ marginTop: 10 }}>
            <button onClick={startCamera}>Start Camera</button>
          </div>

          <div style={{ marginTop: 10 }}>
            <label>
              Capture interval (ms):
              <input
                type="number"
                value={intervalMs}
                onChange={(e) => setIntervalMs(Number(e.target.value || 500))}
                style={{ width: 100, marginLeft: 8 }}
              />
            </label>
          </div>

          <div style={{ marginTop: 10 }}>
            {!running ? (
              <button onClick={startCapture} disabled={!mode}>
                Start Capture
              </button>
            ) : (
              <button onClick={stopCapture}>Stop Capture</button>
            )}
          </div>
        </div>

        <div>
          <div style={{ position: 'relative' }}>
            <video ref={videoRef} id="preview" style={{ maxWidth: 480 }} playsInline muted />
            <canvas ref={canvasRef} style={{ display: 'block', marginTop: 8, maxWidth: 480 }} />
          </div>

          <div style={{ marginTop: 8 }}>
            <small>Predictions will be drawn on the canvas below the video. Check DevTools console for raw proxy/Roboflow responses.</small>
          </div>

          {/* Display predictions count and details */}
          {predictions && predictions.length > 0 && (
            <div style={{ marginTop: 12, padding: 12, background: '#f0f0f0', borderRadius: 4, fontSize: '14px' }}>
              <strong>Detections Found: {predictions.length}</strong>
              <div style={{ marginTop: 8, maxHeight: 150, overflowY: 'auto' }}>
                {predictions.map((pred, idx) => (
                  <div key={idx} style={{ marginBottom: 4, padding: 4, background: 'white', borderRadius: 2 }}>
                    <strong>#{idx + 1}:</strong> {pred.class || pred.label || pred?.classification?.predicted_class || 'Unknown'}
                    {pred.confidence !== undefined && (
                      <span> - Confidence: {(pred.confidence * 100).toFixed(1)}%</span>
                    )}
                    {pred.score !== undefined && (
                      <span> - Score: {(pred.score * 100).toFixed(1)}%</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {running && predictions.length === 0 && (
            <div style={{ marginTop: 12, padding: 8, background: '#fff3cd', borderRadius: 4, fontSize: '14px', color: '#856404' }}>
              Processing frames... Check browser console (F12) for detailed responses.
            </div>
          )}

          {/* Error display */}
          {running && (
            <div style={{ marginTop: 12, padding: 8, background: '#f8d7da', borderRadius: 4, fontSize: '14px', color: '#721c24' }}>
              <strong>Tips:</strong>
              <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
                <li>Make sure Roboflow proxy is running on port 4000</li>
                <li>Check console (F12) for detailed error messages</li>
                <li>Verify video is playing before starting capture</li>
                <li>If you see connection errors, restart the proxy: <code>cd backend && npm run proxy</code></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDemo;