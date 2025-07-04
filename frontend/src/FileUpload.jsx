// FileUpload.jsx
import React, { useState, useRef } from "react";
import { Upload, FileText, Trash2 } from "lucide-react";
import { uploadFile } from "./api/api";

const FileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    const formData = new FormData();
    formData.append("file", files[0]); // name must match 'file' in Flask
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    try {
      setUploadStatus("Uploading...");
      const res = await uploadFile(formData); // Axios POST
      setUploadStatus(res.data.message || "Uploaded successfully ✅");

      const newFile = {
        id: Date.now(),
        name: files[0].name,
        size: files[0].size,
        uploadTime: new Date().toLocaleString(),
      };
      setUploadedFiles((prev) => [...prev, newFile]);
    } catch (error) {
      setUploadStatus("Upload failed ❌");
      console.error("Upload error:", error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizeUnits = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizeUnits[i]
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border p-6">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-blue-100 rounded-lg mr-3">
          <Upload className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">File Upload</h2>
      </div>

      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-700 font-medium mb-2">
          Drop files here or click to browse
        </p>
        <p className="text-sm text-gray-500">
          Supports CSV, JSON, Excel, TXT files
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileUpload}
          accept=".csv,.json,.txt,.xlsx,.xls"
        />
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">
              Uploaded Files ({uploadedFiles.length})
            </h3>
            <button
              onClick={() => setUploadedFiles([])}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)} • {file.uploadTime}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
