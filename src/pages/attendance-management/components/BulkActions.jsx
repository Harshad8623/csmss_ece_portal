import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActions = ({ 
  onMarkAllPresent, 
  onMarkAllAbsent, 
  onCsvUpload,
  totalStudents = 0,
  isProcessing = false 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    const files = e?.dataTransfer?.files;
    if (files?.length > 0) {
      handleFileUpload(files?.[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file) => {
    if (!file?.name?.endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          onCsvUpload(file);
          return 0;
        }
        return prev + 10;
      });
    }, 100);
  };

  const downloadTemplate = () => {
    const csvContent = `PRN,Student Name,Status\n23025331844001,Aarav Sharma,Present\n23025331844002,Vivaan Patel,Absent\n23025331844003,Aditya Kumar,Late`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_template.csv';
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Zap" size={20} className="mr-2" />
          Bulk Actions
        </h3>
        <div className="text-sm text-muted-foreground">
          {totalStudents} students loaded
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Quick Mark</h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="success"
              onClick={onMarkAllPresent}
              disabled={isProcessing || totalStudents === 0}
              iconName="CheckCircle"
              iconPosition="left"
              className="flex-1"
            >
              Mark All Present
            </Button>
            <Button
              variant="destructive"
              onClick={onMarkAllAbsent}
              disabled={isProcessing || totalStudents === 0}
              iconName="XCircle"
              iconPosition="left"
              className="flex-1"
            >
              Mark All Absent
            </Button>
          </div>
        </div>

        {/* CSV Upload */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">CSV Upload</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadTemplate}
              iconName="Download"
              iconPosition="left"
            >
              Template
            </Button>
          </div>
          
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver 
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {uploadProgress > 0 ? (
              <div className="space-y-2">
                <Icon name="Upload" size={24} className="mx-auto text-primary" />
                <p className="text-sm font-medium">Uploading... {uploadProgress}%</p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Icon name="Upload" size={24} className="mx-auto text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">
                  Drop CSV file here or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports CSV files with PRN, Name, and Status columns
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef?.current?.click()}
                  disabled={isProcessing}
                >
                  Choose File
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-2 text-sm text-muted-foreground">
          <Icon name="Info" size={16} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">Bulk Action Guidelines:</p>
            <ul className="space-y-1 text-xs">
              <li>• Quick mark actions apply to all loaded students</li>
              <li>• CSV upload overwrites existing attendance for the session</li>
              <li>• Valid status values: Present, Absent, Late, Leave Approved, OD</li>
              <li>• Changes are saved automatically after processing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;