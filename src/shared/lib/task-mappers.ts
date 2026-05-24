import type { ShortTaskResponse, TaskResponse } from '@/shared/api/tasks';
import type { Task, TaskDraft } from '@/types/task';
import type { TestCaseRequest } from '@/shared/api/tasks';
import { apiDateTimeToLocalInput, localInputToApiDateTime } from '@/shared/lib/datetime';
import { categoryToSection, sectionToCategory, type StudentTaskStatus } from '@/shared/lib/task-category';

const DEFAULT_LANG: Task['lang'] = 'Java';
const DEFAULT_DIFFICULTY: Task['difficulty'] = 'Medium';

function mapStudentStatus(short: ShortTaskResponse): StudentTaskStatus | undefined {
  return short.studentStatus;
}

export function shortTaskToUiTask(short: ShortTaskResponse): Task {
  const studentStatus = mapStudentStatus(short);
  return {
    id: short.id,
    isDone: studentStatus === 'SOLVED',
    studentStatus,
    name: short.title,
    description: short.author ? `Автор: ${short.author}` : '',
    difficulty: DEFAULT_DIFFICULTY,
    lang: DEFAULT_LANG,
    time: 2000,
    memory: 256,
    section: categoryToSection(short.category),
  };
}

export function taskResponseToUiTask(task: TaskResponse): Task {
  return {
    id: task.id,
    isDone: false,
    name: task.title,
    description: task.description,
    difficulty: DEFAULT_DIFFICULTY,
    lang: DEFAULT_LANG,
    time: task.timeLimitMs,
    memory: task.memoryLimitMb,
    section: categoryToSection(task.category),
  };
}

export type TaskAssignmentMode = 'all' | 'group' | 'student';

export type TaskFormValues = TaskDraft & {
  /** Значение для datetime-local */
  deadlineLocal: string;
  maxAttempts: number;
  testCases: TestCaseRequest[];
  assignmentMode: TaskAssignmentMode;
  assignedGroupId?: number | null;
  assignedStudentId?: number | null;
};

function mapTestCasesForApi(testCases: TestCaseRequest[]): TestCaseRequest[] {
  return testCases
    .map((tc) => ({
      inputData: tc.inputData.trim(),
      expectedOutput: tc.expectedOutput.trim(),
      isHidden: Boolean(tc.isHidden),
    }))
    .filter((tc) => tc.inputData.length > 0 && tc.expectedOutput.length > 0);
}

function assignmentPayload(draft: TaskFormValues, forEdit: boolean) {
  if (draft.assignmentMode === 'all') {
    return {
      assignToAllTeacherGroups: true,
      assignedGroupId: null as null,
      assignedStudentId: null as null,
    };
  }
  if (draft.assignmentMode === 'group' && draft.assignedGroupId) {
    return {
      assignToAllTeacherGroups: false,
      assignedGroupId: draft.assignedGroupId,
      assignedStudentId: null as null,
    };
  }
  if (draft.assignmentMode === 'student' && draft.assignedStudentId) {
    return {
      assignToAllTeacherGroups: false,
      assignedGroupId: null as null,
      assignedStudentId: draft.assignedStudentId,
    };
  }
  if (forEdit) {
    return {
      assignToAllTeacherGroups: false,
      assignedGroupId: null as null,
      assignedStudentId: null as null,
      clearAssignment: true as const,
    };
  }
  return { assignToAllTeacherGroups: false };
}

export function draftToNewTaskRequest(draft: TaskFormValues) {
  return {
    title: draft.name,
    description: draft.description,
    timeLimitMs: draft.time,
    memoryLimitMb: draft.memory,
    deadlineAt: localInputToApiDateTime(draft.deadlineLocal),
    maxAttempts: draft.maxAttempts,
    category: sectionToCategory(draft.section),
    testCases: mapTestCasesForApi(draft.testCases),
    ...assignmentPayload(draft, false),
  };
}

export function draftToEditTaskRequest(taskId: number, draft: TaskFormValues) {
  return {
    id: taskId,
    description: draft.description,
    timeLimitMs: draft.time,
    memoryLimitMb: draft.memory,
    deadlineAt: localInputToApiDateTime(draft.deadlineLocal),
    maxAttempts: draft.maxAttempts,
    category: sectionToCategory(draft.section),
    testCases: mapTestCasesForApi(draft.testCases),
    ...assignmentPayload(draft, true),
  };
}

export function taskResponseToFormValues(task: TaskResponse): TaskFormValues {
  const ui = taskResponseToUiTask(task);
  const assignmentMode: TaskAssignmentMode = task.assignedStudentId
    ? 'student'
    : task.assignedGroupId
      ? 'group'
      : task.assignToAllTeacherGroups
        ? 'all'
        : 'all';
  return {
    ...ui,
    deadlineLocal: apiDateTimeToLocalInput(task.deadlineAt),
    maxAttempts: task.maxAttempts ?? 3,
    assignmentMode,
    assignedGroupId: task.assignedGroupId ?? null,
    assignedStudentId: task.assignedStudentId ?? null,
    testCases: task.testCases?.length
      ? task.testCases.map((tc) => ({
          inputData: tc.inputData,
          expectedOutput: tc.expectedOutput,
          isHidden: tc.isHidden,
        }))
      : [{ inputData: '', expectedOutput: '', isHidden: false }],
  };
}
