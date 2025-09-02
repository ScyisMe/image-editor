import React, { useState, useRef } from 'react';
import { Upload, Image, X, CheckCircle, AlertCircle, FileImage } from 'lucide-react';
import apiService from '../../services/api';
import { ENDPOINTS } from '../../utils/constants';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/bmp', 'image/tiff'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      return 'Please select a valid image file (JPEG, PNG, WebP, BMP, or TIFF)';
    }
    if (file.size > maxFileSize) {
      return 'File size must be less than 10MB';
    }
    return null;
  };

  const handleFileSelect = (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    setError('');
    setUploadedImage(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError('');

    try {
      const result = await apiService.uploadFile(ENDPOINTS.IMAGE.UPLOAD, selectedFile);
      setUploadedImage(result);
      setSelectedFile(null);
      setPreview(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearUploadResult = () => {
    setUploadedImage(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-100 p-2 rounded-full">
          <Upload className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Image Upload</h2>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Upload Area */}
      {!selectedFile && !uploadedImage && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <FileImage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Drop your image here, or click to select
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Supports: JPEG, PNG, WebP, BMP, TIFF (max 10MB)
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Choose File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* Selected File Preview */}
      {selectedFile && preview && (
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-800">Selected Image</h3>
              <button
                onClick={clearSelection}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-md border"
                />
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-600">Name:</span>
                  <p className="text-sm text-gray-800 truncate">{selectedFile.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Size:</span>
                  <p className="text-sm text-gray-800">{formatFileSize(selectedFile.size)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Type:</span>
                  <p className="text-sm text-gray-800">{selectedFile.type}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleUpload}
              disabled={loading}
              className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Upload size={16} />
              {loading ? 'Uploading...' : 'Upload Image'}
            </button>
            
            <button
              onClick={clearSelection}
              disabled={loading}
              className="flex items-center gap-2 bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Upload Result */}
      {uploadedImage && (
        <div className="border border-green-200 rounded-lg p-6 bg-green-50">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-medium text-green-800">Upload Successful!</h3>
            </div>
            <button
              onClick={clearUploadResult}
              className="text-green-600 hover:text-green-800"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-green-700">Image ID:</span>
              <p className="text-sm text-green-800 font-mono bg-white px-2 py-1 rounded border inline-block ml-2">
                {uploadedImage.id}
              </p>
            </div>
            
            {uploadedImage.filename && (
              <div>
                <span className="text-sm font-medium text-green-700">Filename:</span>
                <p className="text-sm text-green-800">{uploadedImage.filename}</p>
              </div>
            )}
            
            {uploadedImage.url && (
              <div className="mt-4">
                <img
                  src={uploadedImage.url}
                  alt="Uploaded"
                  className="max-w-xs rounded-md border shadow-sm"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-green-200">
            <p className="text-sm text-green-700">
              💡 Copy the Image ID above to use it in image operations.
            </p>
          </div>
        </div>
      )}

      {/* Upload Another */}
      {uploadedImage && (
        <div className="mt-6 text-center">
          <button
            onClick={clearUploadResult}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Upload Another Image
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;