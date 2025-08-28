import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExportPanel = ({ onExport, className = '' }) => {
  const [exportConfig, setExportConfig] = useState({
    format: 'pdf',
    template: 'comprehensive',
    sections: {
      kpis: true,
      charts: true,
      defaulters: true,
      insights: true,
      recommendations: true
    },
    schedule: 'none',
    recipients: []
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const formatOptions = [
    { value: 'pdf', label: 'PDF Report' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'csv', label: 'CSV Data' },
    { value: 'pptx', label: 'PowerPoint Presentation' }
  ];

  const templateOptions = [
    { value: 'comprehensive', label: 'Comprehensive Report' },
    { value: 'executive', label: 'Executive Summary' },
    { value: 'detailed', label: 'Detailed Analytics' },
    { value: 'custom', label: 'Custom Template' }
  ];

  const scheduleOptions = [
    { value: 'none', label: 'One-time Export' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'semester', label: 'End of Semester' }
  ];

  const handleSectionChange = (section, checked) => {
    setExportConfig(prev => ({
      ...prev,
      sections: {
        ...prev?.sections,
        [section]: checked
      }
    }));
  };

  const handleExport = () => {
    onExport(exportConfig);
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'pdf': return 'FileText';
      case 'excel': return 'FileSpreadsheet';
      case 'csv': return 'Database';
      case 'pptx': return 'Presentation';
      default: return 'Download';
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Download" size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">Export Reports</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleExport}
              className="flex items-center space-x-2"
            >
              <Icon name={getFormatIcon(exportConfig?.format)} size={14} />
              <span>Export Now</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={16} />
            </Button>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Format and Template Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Export Format"
              options={formatOptions}
              value={exportConfig?.format}
              onChange={(value) => setExportConfig(prev => ({ ...prev, format: value }))}
            />

            <Select
              label="Report Template"
              options={templateOptions}
              value={exportConfig?.template}
              onChange={(value) => setExportConfig(prev => ({ ...prev, template: value }))}
            />
          </div>

          {/* Sections to Include */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Include Sections</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Checkbox
                label="KPI Dashboard"
                description="Key performance indicators and metrics"
                checked={exportConfig?.sections?.kpis}
                onChange={(e) => handleSectionChange('kpis', e?.target?.checked)}
              />
              <Checkbox
                label="Charts & Visualizations"
                description="All interactive charts and graphs"
                checked={exportConfig?.sections?.charts}
                onChange={(e) => handleSectionChange('charts', e?.target?.checked)}
              />
              <Checkbox
                label="Defaulters List"
                description="Students below attendance threshold"
                checked={exportConfig?.sections?.defaulters}
                onChange={(e) => handleSectionChange('defaulters', e?.target?.checked)}
              />
              <Checkbox
                label="Key Insights"
                description="Automated insights and trends"
                checked={exportConfig?.sections?.insights}
                onChange={(e) => handleSectionChange('insights', e?.target?.checked)}
              />
              <Checkbox
                label="Recommendations"
                description="Suggested actions and interventions"
                checked={exportConfig?.sections?.recommendations}
                onChange={(e) => handleSectionChange('recommendations', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Scheduling Options */}
          <div>
            <Select
              label="Schedule Export"
              description="Set up automatic report generation"
              options={scheduleOptions}
              value={exportConfig?.schedule}
              onChange={(value) => setExportConfig(prev => ({ ...prev, schedule: value }))}
            />
          </div>

          {/* Quick Export Buttons */}
          <div className="border-t border-border pt-4">
            <h4 className="font-medium text-foreground mb-3">Quick Export Options</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport({ ...exportConfig, format: 'pdf', template: 'executive' })}
                className="flex flex-col items-center space-y-1 h-auto py-3"
              >
                <Icon name="FileText" size={20} />
                <span className="text-xs">Executive PDF</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport({ ...exportConfig, format: 'excel', template: 'detailed' })}
                className="flex flex-col items-center space-y-1 h-auto py-3"
              >
                <Icon name="FileSpreadsheet" size={20} />
                <span className="text-xs">Detailed Excel</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport({ ...exportConfig, format: 'csv', sections: { defaulters: true } })}
                className="flex flex-col items-center space-y-1 h-auto py-3"
              >
                <Icon name="Database" size={20} />
                <span className="text-xs">Defaulters CSV</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport({ ...exportConfig, format: 'pptx', template: 'comprehensive' })}
                className="flex flex-col items-center space-y-1 h-auto py-3"
              >
                <Icon name="Presentation" size={20} />
                <span className="text-xs">Full Presentation</span>
              </Button>
            </div>
          </div>

          {/* Export History */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-foreground">Recent Exports</h4>
              <Button variant="ghost" size="sm">
                <Icon name="History" size={14} className="mr-1" />
                View All
              </Button>
            </div>
            <div className="space-y-2">
              {[
                { name: 'Comprehensive Report - December 2024.pdf', date: '28/12/2024', size: '2.4 MB' },
                { name: 'Defaulters List - December 2024.xlsx', date: '27/12/2024', size: '156 KB' },
                { name: 'Executive Summary - November 2024.pdf', date: '30/11/2024', size: '1.8 MB' }
              ]?.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded border border-border">
                  <div className="flex items-center space-x-2">
                    <Icon name="FileText" size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{file?.name}</p>
                      <p className="text-xs text-muted-foreground">{file?.date} • {file?.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Icon name="Download" size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportPanel;