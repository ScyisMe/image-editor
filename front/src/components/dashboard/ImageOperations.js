import React, { useState } from 'react';
import { Settings, Image, Play, AlertCircle, CheckCircle, Copy, Download } from 'lucide-react';
import apiService from '../../services/api';
import { ENDPOINTS, OPERATION_TYPES, IMAGE_FORMATS } from '../../utils/constants';

const ImageOperations = () => {
  const [imageId, setImageId] = useState('');
  const [operation, setOperation] = useState('info');
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOperation = async () => {
    if (!imageId.trim()) {
      setError('Please enter an Image ID');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      let endpoint;
      let body = { image_id: imageId };

      switch (operation) {
        case 'info':
          endpoint = ENDPOINTS.IMAGE.INFO;
          break;
        case 'convert-type':
          endpoint = ENDPOINTS.IMAGE.CONVERT_TYPE;
          body.format = parameters.format;
          break;
        case 'convert-size':
          endpoint = ENDPOINTS.IMAGE.CONVERT_SIZE;
          if (parameters.width) body.width = parseInt(parameters.width);
          if (parameters.height) body.height = parseInt(parameters.height);
          break;
        case 'convert-decrease':
          endpoint = ENDPOINTS.IMAGE.CONVERT_DECREASE;
          body.quality = parseInt(parameters.quality) || 80;
          break;
        case 'convert-cut':
          endpoint = ENDPOINTS.IMAGE.CONVERT_CUT;
          body.x = parseInt(parameters.x) || 0;
          body.y = parseInt(parameters.y) || 0;
          body.width = parseInt(parameters.crop_width);
          body.height = parseInt(parameters.crop_height);
          break;
        case 'convert-merge':
          endpoint = ENDPOINTS.IMAGE.CONVERT_MERGE;
          body.merge_image_id = parameters.merge_image_id;
          body.position = parameters.merge_position;
          break;
        case 'convert-transpose':
          endpoint = ENDPOINTS.IMAGE.CONVERT_TRANSPOSE;
          break;
        default:
          throw new Error('Unknown operation');
      }

      const response = await apiService.post(endpoint, body);
      setResult(response.data);
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
            <h4>Image Information</h4>
            <div className="info-grid">
              <div><strong>Size:</strong> {result.width} × {result.height}</div>
              <div><strong>Format:</strong> {result.format}</div>
              <div><strong>Mode:</strong> {result.mode}</div>
              <div><strong>File Size:</strong> {result.file_size}</div>
              {result.color_count && <div><strong>Colors:</strong> {result.color_count}</div>}
            </div>
          </div>
        )}

        {result.converted_image_id && (
          <div className="converted-result">
            <h4>Converted Image</h4>
            <div className="result-actions">
              <div className="image-id-group">
                <span>New Image ID: <strong>{result.converted_image_id}</strong></span>
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(result.converted_image_id)}
                  title="Copy ID"
                >
                  <Copy size={16} />
                </button>
              </div>
              
              {result.image_url && (
                <button
                  className="download-btn"
                  onClick={() => downloadImage(result.image_url, `converted_${result.converted_image_id}`)}
                >
                  <Download size={16} />
                  Download
                </button>
              )}
            </div>

            {result.image_url && (
              <div className="preview">
                <img src={result.image_url} alt="Converted" className="result-preview" />
              </div>
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
    <div className="image-operations">
      <div className="operations-header">
        <Settings className="header-icon" />
        <h2>Image Operations</h2>
      </div>

      <div className="operations-form">
        <div className="input-group">
          <label>Image ID:</label>
          <input
            type="text"
            placeholder="Enter image ID from upload"
            value={imageId}
            onChange={(e) => setImageId(e.target.value)}
            className="image-id-input"
          />
        </div>

        <div className="input-group">
          <label>Operation:</label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="operation-select"
          >
            <option value="info">Get Image Info</option>
            <option value="convert-type">Convert Format</option>
            <option value="convert-size">Resize Image</option>
            <option value="convert-decrease">Decrease Quality</option>
            <option value="convert-cut">Crop Image</option>
            <option value="convert-merge">Merge Images</option>
            <option value="convert-transpose">Transpose Image</option>
          </select>
        </div>

        {renderParameterInputs()}

        <button
          className="execute-btn"
          onClick={handleOperation}
          disabled={loading || !imageId.trim()}
        >
          {loading ? (
            <div className="loading-spinner" />
          ) : (
            <Play size={16} />
          )}
          {loading ? 'Processing...' : 'Execute Operation'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {renderResult()}
    </div>
  );
};

export default ImageOperations;