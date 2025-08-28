import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const BreadcrumbTrail = ({ 
  customBreadcrumbs = null, 
  contextInfo = null,
  className = '' 
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getDefaultBreadcrumbs = () => {
    const pathSegments = location?.pathname?.split('/')?.filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/', icon: 'Home' }];

    const routeMap = {
      'student-dashboard': { label: 'Student Dashboard', icon: 'LayoutDashboard' },
      'teacher-dashboard': { label: 'Teacher Dashboard', icon: 'LayoutDashboard' },
      'attendance-management': { label: 'Attendance Management', icon: 'UserCheck' },
      'marks-management': { label: 'Marks Management', icon: 'GraduationCap' },
      'analytics-dashboard': { label: 'Analytics Dashboard', icon: 'BarChart3' },
      'login-screen': { label: 'Login', icon: 'LogIn' }
    };

    let currentPath = '';
    pathSegments?.forEach((segment) => {
      currentPath += `/${segment}`;
      const routeInfo = routeMap?.[segment];
      if (routeInfo) {
        breadcrumbs?.push({
          label: routeInfo?.label,
          path: currentPath,
          icon: routeInfo?.icon
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = customBreadcrumbs || getDefaultBreadcrumbs();

  const handleBreadcrumbClick = (path, index) => {
    if (index < breadcrumbs?.length - 1) {
      navigate(path);
    }
  };

  if (breadcrumbs?.length <= 1) {
    return null;
  }

  return (
    <nav className={`bg-background border-b border-border py-3 ${className}`} aria-label="Breadcrumb">
      <div className="px-6">
        <div className="flex items-center space-x-2">
          {/* Breadcrumb Items */}
          <ol className="flex items-center space-x-2 flex-1">
            {breadcrumbs?.map((crumb, index) => {
              const isLast = index === breadcrumbs?.length - 1;
              const isClickable = !isLast && crumb?.path;

              return (
                <li key={index} className="flex items-center space-x-2">
                  {index > 0 && (
                    <Icon 
                      name="ChevronRight" 
                      size={16} 
                      className="text-muted-foreground" 
                    />
                  )}
                  {isClickable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBreadcrumbClick(crumb?.path, index)}
                      className="flex items-center space-x-1 px-2 py-1 h-auto text-muted-foreground hover:text-foreground transition-smooth"
                    >
                      {crumb?.icon && (
                        <Icon name={crumb?.icon} size={14} />
                      )}
                      <span className="text-sm">{crumb?.label}</span>
                    </Button>
                  ) : (
                    <div className="flex items-center space-x-1 px-2 py-1">
                      {crumb?.icon && (
                        <Icon 
                          name={crumb?.icon} 
                          size={14} 
                          className={isLast ? 'text-foreground' : 'text-muted-foreground'} 
                        />
                      )}
                      <span className={`text-sm font-medium ${
                        isLast ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {crumb?.label}
                      </span>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>

          {/* Context Information */}
          {contextInfo && (
            <div className="hidden md:flex items-center space-x-4 text-sm text-muted-foreground border-l border-border pl-4">
              {contextInfo?.subject && (
                <div className="flex items-center space-x-1">
                  <Icon name="BookOpen" size={14} />
                  <span>Subject: {contextInfo?.subject}</span>
                </div>
              )}
              {contextInfo?.class && (
                <div className="flex items-center space-x-1">
                  <Icon name="Users" size={14} />
                  <span>Class: {contextInfo?.class}</span>
                </div>
              )}
              {contextInfo?.semester && (
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={14} />
                  <span>Semester: {contextInfo?.semester}</span>
                </div>
              )}
              {contextInfo?.academicYear && (
                <div className="flex items-center space-x-1">
                  <Icon name="GraduationCap" size={14} />
                  <span>AY: {contextInfo?.academicYear}</span>
                </div>
              )}
            </div>
          )}

          {/* Mobile Context Toggle */}
          {contextInfo && (
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => console.log('Show mobile context')}
            >
              <Icon name="Info" size={16} />
            </Button>
          )}
        </div>

        {/* Mobile Context Information */}
        {contextInfo && (
          <div className="md:hidden mt-2 pt-2 border-t border-border">
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              {contextInfo?.subject && (
                <div className="flex items-center space-x-1">
                  <Icon name="BookOpen" size={12} />
                  <span>{contextInfo?.subject}</span>
                </div>
              )}
              {contextInfo?.class && (
                <div className="flex items-center space-x-1">
                  <Icon name="Users" size={12} />
                  <span>{contextInfo?.class}</span>
                </div>
              )}
              {contextInfo?.semester && (
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={12} />
                  <span>Sem {contextInfo?.semester}</span>
                </div>
              )}
              {contextInfo?.academicYear && (
                <div className="flex items-center space-x-1">
                  <Icon name="GraduationCap" size={12} />
                  <span>{contextInfo?.academicYear}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default BreadcrumbTrail;