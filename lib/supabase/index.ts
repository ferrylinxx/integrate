// Cliente de Supabase
export { supabase, testConnection } from './client';

// Tipos
export type {
  Database,
  Group,
  GroupInsert,
  GroupUpdate,
  Submission,
  SubmissionInsert,
  SubmissionUpdate,
  Admin,
  AdminInsert,
  AdminUpdate,
} from './types';

// Funciones de grupos
export {
  generateGroupCode,
  createGroup,
  getAllGroups,
  getGroupByCode,
  getGroupById,
  groupCodeExists,
  deleteGroup,
  getGroupStats,
} from './groups';

// Funciones de submissions
export {
  generateParticipantCode,
  createSubmission,
  getSubmissionByCode,
  getSubmissionsByGroup,
  getSubmissionsByGroupCode,
  deleteSubmission,
  deleteAllSubmissionsFromGroup,
  getGroupAverages,
  getGroupAreaSums,
} from './submissions';

// Funciones de administradores
export {
  createAdmin,
  loginAdmin,
  getAllAdmins,
  hasAdmins,
  deleteAdmin,
} from './admins';

