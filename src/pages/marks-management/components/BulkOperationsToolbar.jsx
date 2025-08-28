import React, { useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BulkOperationsToolbar = ({
  onCSVUpload,
  onDownloadTemplate,
  onAutoCalculate,
  onSaveAll,
  onExportPDF,
  onExportExcel,
  hasUnsavedChanges = false,
  isCalculating = false,
  className = ''
}) => {
  const fileInputRef = useRef(null);

  const handleCSVUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      onCSVUpload(file);
      event.target.value = '';
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Settings" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Bulk Operations</h3>
        </div>
        {hasUnsavedChanges && (
          <div className="flex items-center space-x-2 text-warning">
            <Icon name="AlertCircle" size={16} />
            <span className="text-sm font-medium">Unsaved changes</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {/* CSV Upload */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef?.current?.click()}
          iconName="Upload"
          iconPosition="left"
          className="text-xs"
        >
          Upload CSV
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
          className="hidden"
        />

        {/* Download Template */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onDownloadTemplate}
          iconName="Download"
          iconPosition="left"
          className="text-xs"
        >
          Template
        </Button>

        {/* Auto Calculate */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onAutoCalculate}
          loading={isCalculating}
          iconName="Calculator"
          iconPosition="left"
          className="text-xs"
        >
          Calculate
        </Button>

        {/* Save All */}
        <Button
          variant="default"
          size="sm"
          onClick={onSaveAll}
          iconName="Save"
          iconPosition="left"
          className="text-xs"
          disabled={!hasUnsavedChanges}
        >
          Save All
        </Button>

        {/* Export PDF */}
        <Button
          variant="outline"
          size="sm"
          onClick={onExportPDF}
          iconName="FileText"
          iconPosition="left"
          className="text-xs"
        >
          PDF
        </Button>

        {/* Export Excel */}
        <Button
          variant="outline"
          size="sm"
          onClick={onExportExcel}
          iconName="FileSpreadsheet"
          iconPosition="left"
          className="text-xs"
        >
          Excel
        </Button>

        {/* View History */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => console.log('View history')}
          iconName="History"
          iconPosition="left"
          className="text-xs"
        >
          History
        </Button>
      </div>
    </div>
  );
};

export default BulkOperationsToolbar;