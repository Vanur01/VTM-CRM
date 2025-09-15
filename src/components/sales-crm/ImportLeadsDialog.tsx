"use client";

import React, { useState, useRef } from "react";
import { useLeadsStore } from "@/stores/salesCrmStore/useLeadsStore";
import { useAuthStore } from "@/stores/salesCrmStore/useAuthStore";

interface ImportLeadsDialogProps {
  open: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

const ImportLeadsDialog: React.FC<ImportLeadsDialogProps> = ({
  open,
  onClose,
  onImportComplete,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    importedCount: number;
    duplicateCount: number;
    message: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { importLeads, fetchLeads, fetchLeadsByUser, fetchManagerLeads } = useLeadsStore();
  const { user } = useAuthStore();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    // Validate file type - only CSV allowed
    const allowedTypes = ["text/csv"];
    const fileName = file.name.toLowerCase();
    const isValidType = allowedTypes.includes(file.type) || fileName.endsWith('.csv');
                       
    if (!isValidType) {
      setError("Only CSV files are allowed");
      return;
    }
    setSelectedFile(file);
    setError(null);
    setImportResult(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setImporting(true);
    setError(null);

    try {
      const result = await importLeads(selectedFile);
      setImportResult(result);
      
      if (result.importedCount > 0) {
        // Call role-based API after successful import
        if (user?.companyId) {
          try {
            if (user.role === 'admin') {
              // Admin sees all leads in the company
              await fetchLeads(user.companyId);
            } else if (user.role === 'manager') {
              // Manager sees leads assigned to their team
              await fetchManagerLeads(user.companyId);
            } else {
              // Regular user sees only their assigned leads
              await fetchLeadsByUser(user.companyId);
            }
          } catch (apiError) {
            console.error('Failed to refresh leads after import:', apiError);
            // Don't show error to user as import was successful
          }
        }
        
        onImportComplete();
        // Clear the selected file after successful import
        setTimeout(() => {
          setSelectedFile(null);
          setImportResult(null);
        }, 3000); // Clear after 3 seconds to show the result
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to import leads");
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setImportResult(null);
    setError(null);
    setImporting(false);
    onClose();
  };

  const clearUploadData = () => {
    setSelectedFile(null);
    setImportResult(null);
    setError(null);
  };

  const downloadSampleFile = () => {
    const link = document.createElement('a');
    link.href = '/CRM.csv';
    link.download = 'CRM_sample.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,13V17H10V13H7L12,8L17,13M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Import Leads</h2>
                <p className="text-sm text-gray-500">Upload CSV files</p>
              </div>
            </div>
            <button 
              className="w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-500 hover:text-gray-700 cursor-pointer" 
              onClick={handleClose}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Instructions */}
          <div className="mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h3 className="text-base font-medium text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13,9H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                </svg>
                Instructions
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Upload a CSV file with lead data. Download the sample file to see the correct format.
              </p>
              <button 
                className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm px-3 py-2 rounded-md font-medium transition-colors cursor-pointer" 
                onClick={downloadSampleFile}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
                </svg>
                Download Sample File
              </button>
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13,9V3.5L18.5,9M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z" />
              </svg>
              Select File
            </h3>
            <div 
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
                ${isDragging 
                  ? 'border-gray-400 bg-gray-50' 
                  : selectedFile 
                    ? 'border-[#00a900] bg-green-50/50' 
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13,9V3.5L18.5,9M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900">{selectedFile.name}</h4>
                    <p className="text-sm text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-lg bg-gray-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14,13V17H10V13H7L12,8L17,13M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      {isDragging ? "Drop your file here" : "Click to select or drag & drop"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      CSV files supported
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress */}
          {importing && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4 border">
              <div className="flex items-center gap-3 mb-3">
                <div className="animate-spin w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full"></div>
                <p className="text-gray-700 font-medium">Importing leads...</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-800 h-2 rounded-full animate-pulse" style={{width: '50%'}}></div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                </svg>
                <div className="flex-1">
                  <h4 className="text-red-800 font-medium mb-1">Upload Error</h4>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Import Result */}
          {importResult && (
            <div className={`mb-6 rounded-lg p-4 border ${importResult.duplicateCount > 0 
              ? 'bg-yellow-50 border-yellow-200' 
              : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  importResult.duplicateCount > 0 ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  <svg className={`w-5 h-5 ${importResult.duplicateCount > 0 ? 'text-yellow-600' : 'text-green-600'}`} viewBox="0 0 24 24" fill="currentColor">
                    {importResult.duplicateCount > 0 ? (
                      <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                    ) : (
                      <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                    )}
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium mb-2 ${importResult.duplicateCount > 0 ? 'text-yellow-800' : 'text-green-800'}`}>
                    {importResult.message}
                  </h4>
                  <div className="space-y-1 text-sm mb-3">
                    <p className={importResult.duplicateCount > 0 ? 'text-yellow-700' : 'text-green-700'}>
                      • Successfully imported: <span className="font-medium">{importResult.importedCount}</span> leads
                    </p>
                    {importResult.duplicateCount > 0 && (
                      <p className="text-yellow-700">
                        • Duplicates found: <span className="font-medium">{importResult.duplicateCount}</span> leads
                      </p>
                    )}
                    {selectedFile && (
                      <p className="text-gray-600">
                        • From file: <span className="font-medium">{selectedFile.name}</span>
                      </p>
                    )}
                  </div>
                  <button
                    onClick={clearUploadData}
                    className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm px-3 py-2 rounded-md font-medium transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14,13V17H10V13H7L12,8L17,13M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z" />
                    </svg>
                    Upload New File
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end gap-3">
            <button 
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" 
              onClick={handleClose} 
              disabled={importing}
            >
              {importResult ? "Close" : "Cancel"}
            </button>
            {!importResult && (
              <button
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                onClick={handleImport}
                disabled={!selectedFile || importing}
              >
                {importing ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Importing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14,12L10,8V11H2V13H10V16M20,18V6C20,4.89 19.1,4 18,4H6A2,2 0 0,0 4,6V9H6V6H18V18H6V15H4V18A2,2 0 0,0 6,20H18A2,2 0 0,0 20,18Z" />
                    </svg>
                    Import Leads
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportLeadsDialog;