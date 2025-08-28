import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// Generic hook for fetching data from Supabase
export const useSupabaseData = (table, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const {
    select = '*',
    filters = [],
    orderBy = null,
    limit = null,
    dependencies = []
  } = options;

  const fetchData = useCallback(async () => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase?.from(table)?.select(select);

      // Apply filters
      filters?.forEach(filter => {
        if (filter?.column && filter?.value !== undefined) {
          query = query?.eq(filter?.column, filter?.value);
        }
      });

      // Apply ordering
      if (orderBy?.column) {
        query = query?.order(orderBy?.column, { 
          ascending: orderBy?.ascending !== false 
        });
      }

      // Apply limit
      if (limit && typeof limit === 'number') {
        query = query?.limit(limit);
      }

      const { data: result, error } = await query;

      if (error) throw error;

      setData(result || []);
    } catch (err) {
      console.error(`Error fetching ${table}:`, err);
      setError(err?.message || 'Failed to fetch data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [table, select, JSON.stringify(filters), JSON.stringify(orderBy), limit, user, ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch
  };
};

// Hook for student attendance data
export const useStudentAttendance = (studentId = null, subjectId = null) => {
  const { user, profile } = useAuth();
  const userId = studentId || (profile?.role === 'student' ? user?.id : null);

  const filters = [];
  if (userId) filters?.push({ column: 'student_id', value: userId });
  if (subjectId) filters?.push({ column: 'subject_id', value: subjectId });

  return useSupabaseData('attendance_records', {
    select: `
      *,
      subject:subjects(subject_name, subject_code),
      marked_by_user:user_profiles!attendance_records_marked_by_fkey(full_name)
    `,
    filters,
    orderBy: { column: 'attendance_date', ascending: false },
    dependencies: [userId, subjectId]
  });
};

// Hook for student marks data
export const useStudentMarks = (studentId = null, subjectId = null) => {
  const { user, profile } = useAuth();
  const userId = studentId || (profile?.role === 'student' ? user?.id : null);

  const filters = [];
  if (userId) filters?.push({ column: 'student_id', value: userId });
  if (subjectId) filters?.push({ column: 'subject_id', value: subjectId });

  return useSupabaseData('marks_records', {
    select: `
      *,
      subject:subjects(subject_name, subject_code),
      exam_type:exam_types(exam_name, max_marks),
      marked_by_user:user_profiles!marks_records_marked_by_fkey(full_name)
    `,
    filters,
    orderBy: { column: 'created_at', ascending: false },
    dependencies: [userId, subjectId]
  });
};

// Hook for teacher's students
export const useTeacherStudents = () => {
  const { user, profile } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user || profile?.role !== 'teacher') {
        setStudents([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Get students through subject assignments
        const { data, error } = await supabase?.from('subject_assignments')?.select(`
            student_enrollments!inner(
              student:user_profiles!student_enrollments_student_id_fkey(*)
            ),
            subject:subjects(subject_name, subject_code),
            class:classes(class_name)
          `)?.eq('teacher_id', user?.id);

        if (error) throw error;

        // Extract unique students
        const uniqueStudents = [];
        const studentIds = new Set();

        data?.forEach(assignment => {
          assignment?.student_enrollments?.forEach(enrollment => {
            const student = enrollment?.student;
            if (student && !studentIds?.has(student?.id)) {
              studentIds?.add(student?.id);
              uniqueStudents?.push({
                ...student,
                class_name: assignment?.class?.class_name,
                subjects: []
              });
            }
          });
        });

        setStudents(uniqueStudents);
      } catch (err) {
        console.error('Error fetching teacher students:', err);
        setError(err?.message || 'Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user, profile?.role]);

  return { students, loading, error };
};

// Hook for notifications
export const useNotifications = (unreadOnly = false) => {
  const { user } = useAuth();

  const filters = [
    { column: 'recipient_id', value: user?.id }
  ];

  if (unreadOnly) {
    filters?.push({ column: 'is_read', value: false });
  }

  return useSupabaseData('notifications', {
    select: `
      *,
      created_by_user:user_profiles!notifications_created_by_fkey(full_name, role)
    `,
    filters,
    orderBy: { column: 'created_at', ascending: false },
    dependencies: [user?.id, unreadOnly]
  });
};

// Hook for class analytics (for teachers/HOD)
export const useClassAnalytics = (classId = null) => {
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    averageAttendance: 0,
    averageMarks: 0,
    subjectPerformance: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, profile } = useAuth();

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user || !['teacher', 'hod', 'admin']?.includes(profile?.role)) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // This would be a complex query - simplified for demo
        // In production, you might want to create a database function
        const { data: students, error: studentsError } = await supabase?.from('student_enrollments')?.select('student_id')?.eq('class_id', classId || '');

        if (studentsError) throw studentsError;

        setAnalytics({
          totalStudents: students?.length || 0,
          averageAttendance: 85.5, // This would be calculated from actual data
          averageMarks: 78.2, // This would be calculated from actual data
          subjectPerformance: [] // Complex calculation needed
        });

      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err?.message || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, profile?.role, classId]);

  return { analytics, loading, error };
};

// Hook for CRUD operations
export const useSupabaseMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (operation) => {
    try {
      setLoading(true);
      setError(null);

      const result = await operation();
      return { data: result?.data, error: null };
    } catch (err) {
      console.error('Mutation error:', err);
      const errorMessage = err?.message || 'Operation failed';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Convenience methods
  const insert = useCallback(async (table, data) => {
    return mutate(async () => {
      const { data: result, error } = await supabase?.from(table)?.insert(data)?.select()?.single();
      
      if (error) throw error;
      return { data: result };
    });
  }, [mutate]);

  const update = useCallback(async (table, id, updates) => {
    return mutate(async () => {
      const { data: result, error } = await supabase?.from(table)?.update(updates)?.eq('id', id)?.select()?.single();
      
      if (error) throw error;
      return { data: result };
    });
  }, [mutate]);

  const deleteRecord = useCallback(async (table, id) => {
    return mutate(async () => {
      const { error } = await supabase?.from(table)?.delete()?.eq('id', id);
      
      if (error) throw error;
      return { data: { success: true } };
    });
  }, [mutate]);

  return {
    loading,
    error,
    mutate,
    insert,
    update,
    delete: deleteRecord
  };
};