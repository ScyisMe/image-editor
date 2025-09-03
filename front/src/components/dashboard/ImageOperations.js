import React, { useEffect, useState } from 'react';
import { Settings, Play, AlertCircle, CheckCircle, Copy, Download } from 'lucide-react';
import apiService from '../../services/api';
import { ENDPOINTS, IMAGE_FORMATS } from '../../utils/contens';

const ImageOperations = () => {
  const [file, setFile] = useState(null);
  const [operation, setOperation] = useState('convert-type');
  const [parameters, setParameters] = useState({
    width: '',
    height: '',
    format: 'JPEG',
    quality: '80',
    x: '',
    y: '',
    crop_width: '',
    crop_height: '',
    merge_image_id: '',
    merge_position: 'center'
  });
  const [result, setResult] = useState(null);
  const [resultDims, setResultDims] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOperation = async () => {
    // For file-based operations (like info), imageId is not required

    setLoading(true);
    setError('');
    setResult(null);

    try {
      let endpoint;
      if (operation === 'info') {
        endpoint = ENDPOINTS.IMAGE.INFO;
        if (!file) {
          setError('Select an image file for Get Image Info');
          return;
        }
        const respJson = await apiService.uploadFileJson(endpoint, file);
        setResult(respJson);
        return;
      }
      if (operation === 'convert-type') {
        await runNonInfoOperation(ENDPOINTS.IMAGE.CONVERT_TYPE);
        return;
      }
      if (operation === 'convert-size') {
        await runNonInfoOperation(ENDPOINTS.IMAGE.CONVERT_SIZE);
        return;
      }
      setError('This operation UI for this type is not wired yet.');
      return;
    } catch (err) {
      console.error('Operation error:', err);
      setError(err.response?.data?.message || err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const downloadImage = (imageUrl, filename) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename || 'converted_image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderParameterInputs = () => {
    switch (operation) {
      case 'convert-type':
        return (
          <div className="parameter-group">
            <label>Format:</label>
            <select
              value={parameters.format}
              onChange={(e) => setParameters({...parameters, format: e.target.value})}
            >
              {IMAGE_FORMATS.map(format => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>
          </div>
        );

      case 'convert-size':
        return (
          <div className="parameter-group">
            <div className="input-row">
              <div>
                <label>Width:</label>
                <input
                  type="number"
                  placeholder="Width in pixels"
                  value={parameters.width}
                  onChange={(e) => setParameters({...parameters, width: e.target.value})}
                />
              </div>
              <div>
                <label>Height:</label>
                <input
                  type="number"
                  placeholder="Height in pixels"
                  value={parameters.height}
                  onChange={(e) => setParameters({...parameters, height: e.target.value})}
                />
              </div>
            </div>
            <small>Leave empty to maintain aspect ratio</small>
          </div>
        );

      case 'convert-decrease':
        return (
          <div className="parameter-group">
            <label>Quality (1-100):</label>
            <input
              type="range"
              min="1"
              max="100"
              value={parameters.quality}
              onChange={(e) => setParameters({...parameters, quality: e.target.value})}
            />
            <span className="quality-value">{parameters.quality}%</span>
          </div>
        );

      case 'convert-cut':
        return (
          <div className="parameter-group">
            <div className="input-row">
              <div>
                <label>X Position:</label>
                <input
                  type="number"
                  placeholder="X coordinate"
                  value={parameters.x}
                  onChange={(e) => setParameters({...parameters, x: e.target.value})}
                />
              </div>
              <div>
                <label>Y Position:</label>
                <input
                  type="number"
                  placeholder="Y coordinate"
                  value={parameters.y}
                  onChange={(e) => setParameters({...parameters, y: e.target.value})}
                />
              </div>
            </div>
            <div className="input-row">
              <div>
                <label>Crop Width:</label>
                <input
                  type="number"
                  placeholder="Width to crop"
                  value={parameters.crop_width}
                  onChange={(e) => setParameters({...parameters, crop_width: e.target.value})}
                  required
                />
              </div>
              <div>
                <label>Crop Height:</label>
                <input
                  type="number"
                  placeholder="Height to crop"
                  value={parameters.crop_height}
                  onChange={(e) => setParameters({...parameters, crop_height: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 'convert-merge':
        return (
          <div className="parameter-group">
            <div>
              <label>Merge Image ID:</label>
              <input
                type="text"
                placeholder="ID of image to merge"
                value={parameters.merge_image_id}
                onChange={(e) => setParameters({...parameters, merge_image_id: e.target.value})}
                required
              />
            </div>
            <div>
              <label>Position:</label>
              <select
                value={parameters.merge_position}
                onChange={(e) => setParameters({...parameters, merge_position: e.target.value})}
              >
                <option value="center">Center</option>
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const runNonInfoOperation = async (endpoint) => {
    if (!file) {
      setError('Select an image file first');
      return;
    }
    const extra = {};
    // Always pass target_format so backend saves in the expected format
    extra.target_format = parameters.format || 'JPEG';
    if (operation === 'convert-size') {
      if (parameters.width) extra.width = parseInt(parameters.width, 10);
      if (parameters.height) extra.height = parseInt(parameters.height, 10);
    }
    // Some backends expect width/height as query params; send both ways
    const response = await apiService.uploadFile(endpoint, file, { bodyFields: extra, queryParams: extra });
    setResult({ image_url: response.url, blob: response.blob, contentType: response.contentType });
    setResultDims(null);
  };

  useEffect(() => {
    if (!result?.image_url) return;
    const img = new Image();
    img.onload = () => {
      setResultDims({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = result.image_url;
    return () => { img.onload = null; };
  }, [result?.image_url]);

  const renderResult = () => {
    if (!result) return null;

    return (
      <div className="result-section">
        <div className="result-header">
          <CheckCircle className="success-icon" />
          <h3>Operation Complete</h3>
        </div>

        {operation === 'info' && (
          <div className="info-result">
            <h4 className="text-lg font-medium mb-2">Image Information</h4>
            <ul className="text-sm text-gray-800 space-y-1">
              {Array.isArray(result.size) && (
                <li><span className="font-semibold">Size:</span> {result.size[0]} × {result.size[1]} px</li>
              )}
              <li><span className="font-semibold">Format:</span> {result.format || (result.info && result.info.format) || '—'}</li>
              {result.info && result.info.mode && (
                <li><span className="font-semibold">Mode:</span> {result.info.mode}</li>
              )}
              {result.info && result.info.dpi && Array.isArray(result.info.dpi) && (
                <li><span className="font-semibold">DPI:</span> {result.info.dpi[0]} × {result.info.dpi[1]}</li>
              )}
              {result.info && result.info.jfif_density && Array.isArray(result.info.jfif_density) && (
                <li><span className="font-semibold">JFiF density:</span> {result.info.jfif_density[0]} × {result.info.jfif_density[1]}</li>
              )}
            </ul>
            <details className="mt-3">
              <summary className="text-xs text-gray-600 cursor-pointer">Raw data</summary>
              <pre className="mt-2 bg-gray-50 border rounded p-2 text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
            </details>
          </div>
        )}

        {result.image_url && (
          <div className="converted-result">
            <h4 className="text-lg font-medium mb-2">Result</h4>
            <div className="result-actions flex gap-3 mb-3">
              <button
                className="download-btn inline-flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700"
                onClick={() => downloadImage(result.image_url, `result.${(result.contentType||'image/jpeg').split('/')[1]}`)}
              >
                <Download size={16} />
                Download
              </button>
            </div>

            <div className="preview">
              <img src={result.image_url} alt="Result" className="result-preview max-w-full rounded border" />
            </div>
            {resultDims && (
              <div className="text-sm text-gray-700 mt-2">Actual size: {resultDims.width} × {resultDims.height} px</div>
            )}
          </div>
        )}

        {result.message && (
          <div className="result-message">
            {result.message}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-100 p-2 rounded-full"><Settings className="h-6 w-6 text-blue-600" /></div>
        <h2 className="text-xl font-semibold text-gray-800">Image Operations</h2>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-1">
          <label className="text-sm text-gray-600">Image file</label>
          <input className="border rounded px-3 py-2" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>

        <div className="grid gap-1">
          <label className="text-sm text-gray-600">Operation</label>
          <select
            className="border rounded px-3 py-2"
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
          >
            <option value="convert-type">Convert Format</option>
            <option value="convert-size">Resize Image</option>
            <option value="info">Get Image Info</option>
          </select>
        </div>

        <div className="grid gap-2">
          {renderParameterInputs()}
        </div>

        <button
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-fit"
          onClick={handleOperation}
          disabled={loading || !file}
        >
          {loading ? 'Processing…' : (<><Play size={16} /> Run</>)}
        </button>
      </div>

      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="mt-4">
        {renderResult()}
      </div>
    </div>
  );
};

export default ImageOperations;