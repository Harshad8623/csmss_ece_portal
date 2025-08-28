import { supabase } from '../lib/supabase';

// Authentication helpers
export const authHelpers = {
  // Check if user is authenticated
  isAuthenticated: () => {
    return supabase?.auth?.getUser()?.then(({ data: { user } }) => !!user);
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase?.auth?.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single();
      
      if (error && error?.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }
};

// Data fetching helpers
export const dataHelpers = {
  // Generic fetch with error handling
  fetchData: async (table, options = {}) => {
    try {
      let query = supabase?.from(table);
      
      if (options?.select) {
        query = query?.select(options?.select);
      } else {
        query = query?.select('*');
      }

      if (options?.filters) {
        options?.filters?.forEach(filter => {
          if (filter?.column && filter?.value !== undefined) {
            query = query?.eq(filter?.column, filter?.value);
          }
        });
      }

      if (options?.orderBy) {
        query = query?.order(options?.orderBy?.column, { 
          ascending: options?.orderBy?.ascending !== false 
        });
      }

      if (options?.limit) {
        query = query?.limit(options?.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return { data: data || [], error: null };
    } catch (error) {
      console.error(`Error fetching from ${table}:`, error);
      return { data: [], error: error?.message || 'Failed to fetch data' };
    }
  },

  // Get student attendance summary
  getStudentAttendanceSummary: async (studentId, subjectId = null) => {
    try {
      let query = supabase?.from('attendance_records')?.select('status, attendance_date, subject:subjects(subject_name)')?.eq('student_id', studentId)?.order('attendance_date', { ascending: false });

      if (subjectId) {
        query = query?.eq('subject_id', subjectId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const totalRecords = data?.length || 0;
      const presentCount = data?.filter(record => record?.status === 'present')?.length || 0;
      const attendancePercentage = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;

      return {
        data: {
          records: data || [],
          totalClasses: totalRecords,
          presentClasses: presentCount,
          absentClasses: totalRecords - presentCount,
          attendancePercentage
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting attendance summary:', error);
      return { data: null, error: error?.message || 'Failed to get attendance summary' };
    }
  },

  // Get student marks summary
  getStudentMarksSummary: async (studentId, subjectId = null) => {
    try {
      let query = supabase?.from('marks_records')?.select(`
          *,
          subject:subjects(subject_name, subject_code),
          exam_type:exam_types(exam_name, max_marks)
        `)?.eq('student_id', studentId)?.order('created_at', { ascending: false });

      if (subjectId) {
        query = query?.eq('subject_id', subjectId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const totalMarks = data?.reduce((sum, record) => sum + (record?.marks_obtained || 0), 0) || 0;
      const totalPossible = data?.reduce((sum, record) => sum + (record?.max_marks || 0), 0) || 0;
      const averagePercentage = totalPossible > 0 ? Math.round((totalMarks / totalPossible) * 100) : 0;

      return {
        data: {
          records: data || [],
          totalExams: data?.length || 0,
          totalMarks,
          totalPossible,
          averagePercentage
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting marks summary:', error);
      return { data: null, error: error?.message || 'Failed to get marks summary' };
    }
  }
};

// CRUD helpers
export const crudHelpers = {
  // Create record
  create: async (table, data) => {
    try {
      const { data: result, error } = await supabase?.from(table)?.insert(data)?.select()?.single();
      
      if (error) throw error;
      return { data: result, error: null };
    } catch (error) {
      console.error(`Error creating record in ${table}:`, error);
      return { data: null, error: error?.message || 'Failed to create record' };
    }
  },

  // Update record
  update: async (table, id, updates) => {
    try {
      const { data: result, error } = await supabase?.from(table)?.update(updates)?.eq('id', id)?.select()?.single();
      
      if (error) throw error;
      return { data: result, error: null };
    } catch (error) {
      console.error(`Error updating record in ${table}:`, error);
      return { data: null, error: error?.message || 'Failed to update record' };
    }
  },

  // Delete record
  delete: async (table, id) => {
    try {
      const { error } = await supabase?.from(table)?.delete()?.eq('id', id);
      
      if (error) throw error;
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error(`Error deleting record from ${table}:`, error);
      return { data: null, error: error?.message || 'Failed to delete record' };
    }
  },

  // Bulk insert
  bulkInsert: async (table, dataArray) => {
    try {
      const { data: result, error } = await supabase?.from(table)?.insert(dataArray)?.select();
      
      if (error) throw error;
      return { data: result, error: null };
    } catch (error) {
      console.error(`Error bulk inserting into ${table}:`, error);
      return { data: null, error: error?.message || 'Failed to bulk insert' };
    }
  }
};

// Analytics helpers
export const analyticsHelpers = {
  // Get class performance overview
  getClassPerformance: async (classId, teacherId = null) => {
    try {
      // This would involve complex queries - simplified for demo
      const studentsQuery = supabase?.from('student_enrollments')?.select('student_id, student:user_profiles(full_name, prn)')?.eq('class_id', classId);

      const { data: students, error } = await studentsQuery;
      if (error) throw error;

      return {
        data: {
          totalStudents: students?.length || 0,
          students: students || []
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting class performance:', error);
      return { data: null, error: error?.message || 'Failed to get class performance' };
    }
  },

  // Get subject-wise analytics
  getSubjectAnalytics: async (subjectId, classId = null) => {
    try {
      let marksQuery = supabase?.from('marks_records')?.select('marks_obtained, max_marks, percentage')?.eq('subject_id', subjectId);

      if (classId) {
        marksQuery = marksQuery?.eq('class_id', classId);
      }

      const { data: marks, error } = await marksQuery;
      if (error) throw error;

      const totalStudents = marks?.length || 0;
      const averagePercentage = totalStudents > 0 
        ? Math.round(marks?.reduce((sum, record) => sum + (record?.percentage || 0), 0) / totalStudents)
        : 0;

      return {
        data: {
          totalStudents,
          averagePercentage,
          marks: marks || []
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting subject analytics:', error);
      return { data: null, error: error?.message || 'Failed to get subject analytics' };
    }
  }
};

// Real-time subscription helpers
export const realtimeHelpers = {
  // Subscribe to table changes
  subscribeToTable: (table, callback, filter = null) => {
    let channel = supabase?.channel(`${table}_changes`)?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          ...(filter && { filter })
        },
        callback
      )?.subscribe();

    return {
      unsubscribe: () => supabase?.removeChannel(channel)
    };
  },

  // Subscribe to user notifications
  subscribeToNotifications: (userId, callback) => {
    return realtimeHelpers?.subscribeToTable(
      'notifications',
      callback,
      `recipient_id=eq.${userId}`
    );
  }
};

// Utility functions
export const formatters = {
  // Format date for display
  formatDate: (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString)?.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  // Format percentage
  formatPercentage: (value) => {
    return `${Math.round(value || 0)}%`;
  },

  // Get grade from percentage
  getGrade: (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'F';
  },

  // Get attendance status color
  getAttendanceColor: (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  // Get performance color based on percentage
  getPerformanceColor: (percentage) => {
    if (percentage >= 85) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  }
};

// Error handling
export const errorHandlers = {
  // Handle Supabase errors
  handleError: (error) => {
    console.error('Supabase error:', error);
    
    if (error?.code === 'PGRST116') {
      return 'No data found';
    }
    
    if (error?.code === '42501') {
      return 'Access denied. Please check your permissions.';
    }
    
    if (error?.code === '23503') {
      return 'Cannot perform this action due to related data.';
    }
    
    return error?.message || 'An unexpected error occurred';
  },

  // Display user-friendly error messages
  getErrorMessage: (error) => {
    if (typeof error === 'string') return error;
    return errorHandlers?.handleError(error);
  }
};

export default {
  authHelpers,
  dataHelpers,
  crudHelpers,
  analyticsHelpers,
  realtimeHelpers,
  formatters,
  errorHandlers
};