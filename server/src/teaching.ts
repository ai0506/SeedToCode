import { allTasks, executionProfileOf, expectedOutputs } from "../../packages/teaching-content/dist/index.js";
import { grade } from "../../packages/exercise/dist/index.js";
import {
  allowAuthAttempt,
  clearAuthAttempts,
  createActiveStudent,
  createPendingStudent,
  publicUser,
  resetStudentCredentials,
  startSession,
  throttled,
  type AuthenticatedUser
} from "./auth";

type ClassRow = { id: string; teacher_id: string; name: string; join_code: string; join_locked_at: number | null; created_at: number; updated_at: number };
type MemberRow = { user_id: string; display_name: string; status: string; username: string; account_status: string };
type ProgressRow = { user_id: string; chapter_id: number; section_id: string; completed: number; updated_at: number; revision: number };
type PositionRow = { user_id: string; chapter_id: number; section_id: string; updated_at: number; revision: number };
type PracticeDraftRow = {
  id: string;
  user_id: string;
  chapter_id: number;
  task_id: string;
  source: string;
  revision: number;
  updated_by_device: string;
  updated_at: number;
};
type PracticeSubmissionRow = {
  id: string;
  user_id: string;
  chapter_id: number;
  task_id: string;
  answer_content: string;
  client_version: string | null;
  server_score: number | null;
  server_passed: number;
  failed_layer: string | null;
  submitted_at: number;
  username?: string;
  display_name?: string;
};
type OperationRow = { entity: string };
type AssignmentRow = { id: string; class_id: string; title: string; due_at: number | null; created_at: number; updated_at: number };

const PUBLISHED_TASK_IDS = new Set(allTasks().map(({ task }) => task.id));
const PUBLISHED_TASKS = new Map(allTasks().map((item) => [item.task.id, item]));
const MAX_CLASS_NAME = 120;
/* 一个人同时带的班是有限的。加这条主要是挡住误操作和滥用，
   真到了上限再说——服务端的限制比前端隐藏按钮可靠。 */
const MAX_CLASSES_PER_TEACHER = 5;
const MAX_DISPLAY_NAME = 120;
const MAX_ASSIGNMENT_TITLE = 160;
const MAX_ASSIGNMENT_ITEMS = 30;
const MAX_PRACTICE_DRAFT_BYTES = 256 * 1024;
const MAX_STUDENTS_PER_CLASS = 50;
const MAX_STUDENTS_PER_TEACHER = 200;
/* 每次提交都要在服务端重新跑一遍判题，所以按用户限速。
   超出时返回统一的繁忙提示，客户端的同步队列稍后重试——
   本地判题和本地作答全程不受影响，记录只是晚一点落库。 */
const PRACTICE_SUBMISSION_WINDOW_MS = 60 * 60 * 1000;
const PRACTICE_SUBMISSIONS_PER_WINDOW = 100;
const ASSIGNMENT_SUBMISSION_WINDOW_MS = 60 * 60 * 1000;
const ASSIGNMENT_SUBMISSIONS_PER_WINDOW = 30;
const MAX_PRACTICE_SUBMISSION_LIST = 200;
const textEncoder = new TextEncoder();

export class TeachingError extends Error {
  constructor(public readonly code: string, public readonly status: number, message: string, public readonly extra: Record<string, unknown> = {}) {
    super(message);
  }
}

export async function listClasses(db: D1Database, user: AuthenticatedUser) {
  if (user.role === "teacher") {
    const rows = await db.prepare(
      "SELECT id, teacher_id, name, join_code, join_locked_at, created_at, updated_at FROM classes WHERE teacher_id = ?1 ORDER BY created_at DESC"
    ).bind(user.id).all<ClassRow>();
    return rows.results.map((row) => publicClass(row, true));
  }
  if (user.role === "student") {
    const rows = await db.prepare(
      "SELECT classes.id, classes.teacher_id, classes.name, classes.join_code, classes.join_locked_at, classes.created_at, classes.updated_at FROM class_members JOIN classes ON classes.id = class_members.class_id WHERE class_members.user_id = ?1 AND class_members.status = 'active' ORDER BY classes.created_at DESC"
    ).bind(user.id).all<ClassRow>();
    return rows.results.map((row) => publicClass(row, false));
  }
  return [];
}

export async function createClass(db: D1Database, teacher: AuthenticatedUser, input: unknown) {
  requireTeacher(teacher);
  const body = objectBody(input);
  const name = nameValue(body.name, MAX_CLASS_NAME, "班级名称");
  const existing = await db.prepare("SELECT COUNT(*) AS count FROM classes WHERE teacher_id = ?1")
    .bind(teacher.id).first<{ count: number }>();
  if ((existing?.count ?? 0) >= MAX_CLASSES_PER_TEACHER) {
    throw new TeachingError("CLASS_LIMIT", 409, "最多只能创建 " + MAX_CLASSES_PER_TEACHER + " 个班级。");
  }
  const now = Date.now();
  const row: ClassRow = {
    id: crypto.randomUUID(),
    teacher_id: teacher.id,
    name,
    join_code: await uniqueJoinCode(db),
    join_locked_at: null,
    created_at: now,
    updated_at: now
  };
  await db.prepare(
    "INSERT INTO classes (id, teacher_id, name, join_code, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?5)"
  ).bind(row.id, row.teacher_id, row.name, row.join_code, now).run();
  return publicClass(row, true);
}

export async function listMembers(db: D1Database, teacher: AuthenticatedUser, classId: string) {
  await ownedClass(db, teacher, classId);
  const rows = await db.prepare(
    "SELECT class_members.user_id, class_members.display_name, class_members.status, users.username, users.status AS account_status FROM class_members JOIN users ON users.id = class_members.user_id WHERE class_members.class_id = ?1 ORDER BY class_members.created_at ASC"
  ).bind(classId).all<MemberRow>();
  return rows.results.map((row) => ({
    id: row.user_id,
    username: row.username,
    displayName: row.display_name,
    membershipStatus: row.status,
    accountStatus: row.account_status
  }));
}

/*
 * 学生凭班级码自己注册。
 *
 * 这是进班的第二条路：老师不必一个个建号，念一次班级码即可；
 * 第一条路（老师建号 + 一次性激活码）仍然保留，两者并存。
 * 注册出来的一律是 student——个人学习者不进班级。
 *
 * 限流按来源 IP，不按班级码：枚举的人每次换一个码，按码限流根本挡不住。
 * 而且只有失败才计数——一个教室几十个学生共用一个出口 IP，
 * 成功的注册要是也占额度，第一节课就把全班锁在门外了。
 */
const REGISTER_MAX_FAILURES = 20;

export async function registerStudentWithJoinCode(db: D1Database, env: Env, input: unknown, clientIp: string) {
  const body = objectBody(input);
  const code = normaliseJoinCode(stringOrThrow(body.joinCode, "INVALID_JOIN_CODE", "班级码不正确。"));
  const displayName = nameValue(body.displayName, MAX_DISPLAY_NAME, "姓名");

  const gate = await allowAuthAttempt(db, "student_register", clientIp, REGISTER_MAX_FAILURES);
  if (!gate.allowed) throw throttled(gate.retryAfterSeconds);

  const classRow = await db.prepare(
    "SELECT id, teacher_id, name, join_code, join_locked_at, created_at, updated_at FROM classes WHERE join_code = ?1"
  ).bind(code).first<ClassRow>();
  // 班级码对不上和用户名被占用要分得开：前者是老师念错了，后者是自己换个名字就行。
  if (!classRow) throw new TeachingError("INVALID_JOIN_CODE", 404, "班级码不正确，跟老师确认一下。");
  /*
   * 锁上的班级要和「码不对」分开说：码没抄错的学生需要知道是班级关了，
   * 而不是以为自己抄错了反复重试。代价是这条响应等于承认「这个码存在」，
   * 但知道一个码有效却进不去，拿不到任何东西。
   * 这一次不清限流计数——没建成账号就不算成功，否则锁着的班可以被无限试。
   */
  if (classRow.join_locked_at !== null) {
    throw new TeachingError("CLASS_JOIN_LOCKED", 403, "这个班级暂时不能加入，跟老师确认一下。");
  }

  await ensureStudentCapacity(db, classRow);
  let user: AuthenticatedUser;
  try {
    user = await createActiveStudent(db, body.username, body.password, { classId: classRow.id, displayName });
  } catch (caught) {
    throw capacityError(caught);
  }

  await clearAuthAttempts(db, "student_register", clientIp);
  const setCookie = await startSession(db, env, user.id);
  return { user: publicUser(user), className: classRow.name, setCookie };
}

function stringOrThrow(value: unknown, code: string, message: string): string {
  if (typeof value !== "string" || !value.trim()) throw new TeachingError(code, 400, message);
  return value;
}

export async function createStudentInClass(db: D1Database, teacher: AuthenticatedUser, classId: string, input: unknown) {
  const classRow = await ownedClass(db, teacher, classId);
  const body = objectBody(input);
  const displayName = nameValue(body.displayName, MAX_DISPLAY_NAME, "学生姓名");
  await ensureStudentCapacity(db, classRow);
  let created: Awaited<ReturnType<typeof createPendingStudent>>;
  try {
    created = await createPendingStudent(db, body.username, { classId, displayName });
  } catch (caught) {
    throw capacityError(caught);
  }
  return { student: publicUser(created.user), displayName, activationCode: created.activationCode };
}

export async function resetStudentInClass(db: D1Database, teacher: AuthenticatedUser, classId: string, studentId: string) {
  await ownedClass(db, teacher, classId);
  validateId(studentId, "学生");
  const student = await db.prepare(
    "SELECT users.id, users.role, users.email, users.username FROM class_members JOIN users ON users.id = class_members.user_id WHERE class_members.class_id = ?1 AND class_members.user_id = ?2 AND class_members.status = 'active' AND users.role = 'student'"
  ).bind(classId, studentId).first<AuthenticatedUser>();
  if (!student) throw new TeachingError("NOT_FOUND", 404, "学生不存在。");
  const result = await resetStudentCredentials(db, student);
  return { student: publicUser(student), activationCode: result.activationCode };
}

/**
 * 改学生在名单上的显示名。
 *
 * 姓名只是老师认人用的标签，打错字、用了小名都该能改，没有任何安全含义。
 * 用户名不在此列——那是登录身份，改了学生就登不进来了，所以没有对应入口。
 */
/** 开关班级的自助注册。老师自己创建学生、以及已经在班里的学生都不受影响。 */
export async function setClassJoinLock(db: D1Database, teacher: AuthenticatedUser, classId: string, input: unknown) {
  await ownedClass(db, teacher, classId);
  const body = objectBody(input);
  if (typeof body.locked !== "boolean") throw new TeachingError("INVALID_REQUEST", 400, "请求内容不正确。");
  const now = Date.now();
  await db.prepare("UPDATE classes SET join_locked_at = ?1, updated_at = ?2 WHERE id = ?3 AND teacher_id = ?4")
    .bind(body.locked ? now : null, now, classId, teacher.id).run();
  const row = await db.prepare(
    "SELECT id, teacher_id, name, join_code, join_locked_at, created_at, updated_at FROM classes WHERE id = ?1 AND teacher_id = ?2"
  ).bind(classId, teacher.id).first<ClassRow>();
  if (!row) throw new TeachingError("NOT_FOUND", 404, "班级不存在。");
  return publicClass(row, true);
}

export async function renameStudentInClass(db: D1Database, teacher: AuthenticatedUser, classId: string, studentId: string, input: unknown) {
  await ownedClass(db, teacher, classId);
  validateId(studentId, "学生");
  const body = objectBody(input);
  const displayName = nameValue(body.displayName, MAX_DISPLAY_NAME, "学生姓名");
  const result = await db.prepare(
    "UPDATE class_members SET display_name = ?1 WHERE class_id = ?2 AND user_id = ?3 AND status = 'active'"
  ).bind(displayName, classId, studentId).run();
  if (!result.meta.changes) throw new TeachingError("NOT_FOUND", 404, "学生不存在。");
  return { id: studentId, displayName };
}

export async function createAssignment(db: D1Database, teacher: AuthenticatedUser, classId: string, input: unknown) {
  await ownedClass(db, teacher, classId);
  const body = objectBody(input);
  const title = nameValue(body.title, MAX_ASSIGNMENT_TITLE, "作业标题");
  const dueAt = optionalTimestamp(body.dueAt);
  const items = assignmentItems(body.items);
  const now = Date.now();
  const assignment: AssignmentRow = { id: crypto.randomUUID(), class_id: classId, title, due_at: dueAt, created_at: now, updated_at: now };
  const statements: D1PreparedStatement[] = [
    db.prepare(
      "INSERT INTO assignments (id, class_id, title, due_at, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?5)"
    ).bind(assignment.id, classId, title, dueAt, now)
  ];
  items.forEach((item, position) => {
    statements.push(
      db.prepare("INSERT INTO assignment_items (assignment_id, task_id, position, title, prompt, guidance) VALUES (?1, ?2, ?3, ?4, ?5, ?6)")
        .bind(assignment.id, item.id, position, item.title, item.prompt, item.guidance)
    );
  });
  await db.batch(statements);
  return { ...publicAssignment(assignment), items };
}

/**
 * 改一份已经布置出去的作业：标题、截止时间、题目都可以换。
 *
 * 题目换掉之后，已经交上来的答案不动——被移除的那道题的提交仍然留在库里，
 * 只是不再出现在这份作业的题目清单里。老师改错了题号，不该让学生白做。
 */
export async function updateAssignment(db: D1Database, teacher: AuthenticatedUser, classId: string, assignmentId: string, input: unknown) {
  await ownedClass(db, teacher, classId);
  validateId(assignmentId, "作业");
  const body = objectBody(input);
  const title = nameValue(body.title, MAX_ASSIGNMENT_TITLE, "作业标题");
  const dueAt = optionalTimestamp(body.dueAt);
  const items = assignmentItems(body.items);
  const current = await db.prepare(
    "SELECT id, class_id, title, due_at, created_at, updated_at FROM assignments WHERE id = ?1 AND class_id = ?2 AND deleted_at IS NULL"
  ).bind(assignmentId, classId).first<AssignmentRow>();
  if (!current) throw new TeachingError("NOT_FOUND", 404, "作业不存在。");

  const now = Date.now();
  const statements: D1PreparedStatement[] = [
    db.prepare("UPDATE assignments SET title = ?1, due_at = ?2, updated_at = ?3 WHERE id = ?4 AND deleted_at IS NULL")
      .bind(title, dueAt, now, assignmentId),
    db.prepare("DELETE FROM assignment_items WHERE assignment_id = ?1").bind(assignmentId)
  ];
  items.forEach((item, position) => {
    statements.push(
      db.prepare("INSERT INTO assignment_items (assignment_id, task_id, position, title, prompt, guidance) VALUES (?1, ?2, ?3, ?4, ?5, ?6)")
        .bind(assignmentId, item.id, position, item.title, item.prompt, item.guidance)
    );
  });
  await db.batch(statements);
  return { ...publicAssignment({ ...current, title, due_at: dueAt, updated_at: now }), items };
}

/**
 * 撤掉一份作业。打 tombstone 而不是真删：assignment_submissions 对
 * assignment_id 是级联删除，真删会把学生已判分的答案一起销毁。
 * 打上之后师生两侧都不再看到，也不能再提交，记录仍然保留。
 */
export async function deleteAssignment(db: D1Database, teacher: AuthenticatedUser, classId: string, assignmentId: string) {
  await ownedClass(db, teacher, classId);
  validateId(assignmentId, "作业");
  const now = Date.now();
  const result = await db.prepare(
    "UPDATE assignments SET deleted_at = ?1, updated_at = ?1 WHERE id = ?2 AND class_id = ?3 AND deleted_at IS NULL"
  ).bind(now, assignmentId, classId).run();
  if (!result.meta.changes) throw new TeachingError("NOT_FOUND", 404, "作业不存在。");
  return { id: assignmentId, deletedAt: now };
}

/**
 * 撤销刚才的删除。删除本来就是 tombstone，所以恢复只是把 deleted_at 清掉——
 * 题目和已交的答案一直都在，不需要重建任何东西。
 */
export async function restoreAssignment(db: D1Database, teacher: AuthenticatedUser, classId: string, assignmentId: string) {
  await ownedClass(db, teacher, classId);
  validateId(assignmentId, "作业");
  const now = Date.now();
  const result = await db.prepare(
    "UPDATE assignments SET deleted_at = NULL, updated_at = ?1 WHERE id = ?2 AND class_id = ?3 AND deleted_at IS NOT NULL"
  ).bind(now, assignmentId, classId).run();
  if (!result.meta.changes) throw new TeachingError("NOT_FOUND", 404, "作业不存在。");
  const row = await db.prepare(
    "SELECT id, class_id, title, due_at, created_at, updated_at FROM assignments WHERE id = ?1 AND class_id = ?2"
  ).bind(assignmentId, classId).first<AssignmentRow>();
  if (!row) throw new TeachingError("SERVER_DATA_INVALID", 500, "作业未恢复。");
  return (await attachItems(db, [row]))[0];
}

export async function listClassAssignments(db: D1Database, teacher: AuthenticatedUser, classId: string) {
  await ownedClass(db, teacher, classId);
  const [assignments, progress] = await Promise.all([
    assignmentsForClass(db, classId),
    assignmentProgress(db, classId)
  ]);
  /* 只给老师这一路带上批改进度：学生那一路（listStudentAssignments）看的是自己交没交，
     班上别人批到哪儿和他无关，也不该让他看见。 */
  return assignments.map((assignment) => {
    const counts = progress.get(assignment.id) ?? { submitted: 0, pending: 0 };
    return { ...assignment, submittedCount: counts.submitted, pendingCount: counts.pending };
  });
}

export async function listStudentAssignments(db: D1Database, student: AuthenticatedUser) {
  if (student.role !== "student") throw new TeachingError("FORBIDDEN", 403, "只有学生可以查看班级作业。");
  const rows = await db.prepare(
    "SELECT assignments.id, assignments.class_id, assignments.title, assignments.due_at, assignments.created_at, assignments.updated_at FROM assignments JOIN class_members ON class_members.class_id = assignments.class_id WHERE class_members.user_id = ?1 AND class_members.status = 'active' AND assignments.deleted_at IS NULL ORDER BY assignments.due_at IS NULL, assignments.due_at ASC, assignments.created_at DESC"
  ).bind(student.id).all<AssignmentRow>();
  return attachItems(db, rows.results);
}

export async function submitAssignment(db: D1Database, student: AuthenticatedUser, assignmentId: string, input: unknown) {
  if (student.role !== "student") throw new TeachingError("FORBIDDEN", 403, "只有学生可以提交班级作业。");
  validateId(assignmentId, "作业");
  const body = objectBody(input);
  // 条目键既可能是课程题号，也可能是 `custom:<uuid>`；归属由下面的 assignment_items 查询确认
  const taskId = identifier(body.taskId, "题目");
  const answerContent = answerSource(body.answerContent);
  const clientVersion = optionalVersion(body.clientVersion);
  const assignment = await db.prepare(
    "SELECT assignments.id, assignments.class_id, assignments.title, assignments.due_at, assignments.created_at, assignments.updated_at FROM assignments JOIN class_members ON class_members.class_id = assignments.class_id WHERE assignments.id = ?1 AND class_members.user_id = ?2 AND class_members.status = 'active' AND assignments.deleted_at IS NULL"
  ).bind(assignmentId, student.id).first<AssignmentRow>();
  if (!assignment) throw new TeachingError("NOT_FOUND", 404, "作业不存在。");
  const item = await db.prepare(
    "SELECT task_id, prompt FROM assignment_items WHERE assignment_id = ?1 AND task_id = ?2"
  ).bind(assignmentId, taskId).first<{ task_id: string; prompt: string | null }>();
  if (!item) throw new TeachingError("NOT_FOUND", 404, "作业题目不存在。");
  await assertSubmissionRate(db, student.id, "assignment_submission", ASSIGNMENT_SUBMISSIONS_PER_WINDOW, ASSIGNMENT_SUBMISSION_WINDOW_MS);
  /*
   * 老师自己出的题没有判题数据，也不该有：这类题只要求学生写完自己跑一跑，
   * 成绩本来就由老师给。所以跳过自动判分，分数留空表示「没有自动结果」，
   * 而不是当成 0 分——0 分会被误读成「跑不通」。
   */
  const custom = item.prompt !== null;
  const gradeResult = custom ? null : await gradeTask(taskId, answerContent);
  const score = gradeResult ? scoreFor(gradeResult.testResults) : null;
  const now = Date.now();
  const id = crypto.randomUUID();
  try {
    await db.prepare(
      "INSERT INTO assignment_submissions (id, assignment_id, task_id, student_id, answer_content, client_version, server_score, server_passed, submitted_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)"
    ).bind(id, assignmentId, taskId, student.id, answerContent, clientVersion, score, gradeResult && gradeResult.passed ? 1 : 0, now).run();
  } catch (caught) {
    throw submissionRateError(caught, ASSIGNMENT_SUBMISSION_WINDOW_MS);
  }
  return {
    id,
    assignmentId,
    taskId,
    submittedAt: now,
    autoGraded: Boolean(gradeResult),
    serverScore: score,
    serverPassed: gradeResult ? gradeResult.passed : null,
    failedLayer: gradeResult ? gradeResult.failedLayer : null
  };
}

const MAX_TEACHER_COMMENT = 2000;

/**
 * 老师给一次提交打分。
 *
 * 自动判分只看跑通了几个用例，答不了「逻辑对不对」「思路清不清楚」，
 * 所以它不是成绩，只是老师眼前的一个参考信号；两者分开存，打分不覆盖它。
 * 分数可以反复改——批改本来就会回头调整。
 */
export async function gradeAssignmentSubmission(
  db: D1Database, teacher: AuthenticatedUser, classId: string, submissionId: string, input: unknown
) {
  await ownedClass(db, teacher, classId);
  validateId(submissionId, "提交");
  const body = objectBody(input);

  let score: number | null = null;
  if (body.score !== null && body.score !== undefined) {
    if (!Number.isSafeInteger(body.score) || (body.score as number) < 0 || (body.score as number) > 100) {
      throw new TeachingError("INVALID_SCORE", 400, "分数需为 0–100 的整数。");
    }
    score = body.score as number;
  }
  let comment: string | null = null;
  if (typeof body.comment === "string" && body.comment.trim()) {
    comment = body.comment.trim().slice(0, MAX_TEACHER_COMMENT);
  }
  if (score === null && comment === null) throw new TeachingError("INVALID_SCORE", 400, "请给出分数或评语。");

  // 只能改自己班级里的提交，班级归属在 SQL 里再确认一次
  const now = Date.now();
  const result = await db.prepare(
    `UPDATE assignment_submissions SET teacher_score = ?1, teacher_comment = ?2, graded_at = ?3, graded_by = ?4
      WHERE id = ?5 AND assignment_id IN (SELECT id FROM assignments WHERE class_id = ?6 AND deleted_at IS NULL)`
  ).bind(score, comment, now, teacher.id, submissionId, classId).run();
  if (!result.meta.changes) throw new TeachingError("NOT_FOUND", 404, "提交不存在。");
  return { id: submissionId, teacherScore: score, teacherComment: comment, gradedAt: now, graded: true };
}

export async function listTeacherSubmissions(db: D1Database, teacher: AuthenticatedUser, classId: string, assignmentId: string) {
  await ownedClass(db, teacher, classId);
  validateId(assignmentId, "作业");
  const assignment = await db.prepare(
    "SELECT id FROM assignments WHERE id = ?1 AND class_id = ?2 AND deleted_at IS NULL"
  ).bind(assignmentId, classId).first<{ id: string }>();
  if (!assignment) throw new TeachingError("NOT_FOUND", 404, "作业不存在。");
  const rows = await db.prepare(
    "SELECT assignment_submissions.id, assignment_submissions.assignment_id, assignment_submissions.task_id, assignment_submissions.student_id, assignment_submissions.answer_content, assignment_submissions.client_version, assignment_submissions.server_score, assignment_submissions.server_passed, assignment_submissions.submitted_at, assignment_submissions.teacher_score, assignment_submissions.teacher_comment, assignment_submissions.graded_at, users.username, class_members.display_name FROM assignment_submissions JOIN users ON users.id = assignment_submissions.student_id JOIN class_members ON class_members.user_id = assignment_submissions.student_id AND class_members.class_id = ?2 WHERE assignment_submissions.assignment_id = ?1 ORDER BY assignment_submissions.submitted_at DESC"
  ).bind(assignmentId, classId).all<SubmissionRow>();
  return rows.results.map(publicTeacherSubmission);
}

export async function listStudentSubmissions(db: D1Database, student: AuthenticatedUser, assignmentId: string) {
  if (student.role !== "student") throw new TeachingError("FORBIDDEN", 403, "只有学生可以查看作业提交。");
  validateId(assignmentId, "作业");
  const rows = await db.prepare(
    "SELECT assignment_submissions.id, assignment_submissions.assignment_id, assignment_submissions.task_id, assignment_submissions.student_id, assignment_submissions.answer_content, assignment_submissions.client_version, assignment_submissions.server_score, assignment_submissions.server_passed, assignment_submissions.submitted_at, assignment_submissions.teacher_score, assignment_submissions.teacher_comment, assignment_submissions.graded_at, users.username, class_members.display_name FROM assignment_submissions JOIN assignments ON assignments.id = assignment_submissions.assignment_id JOIN class_members ON class_members.class_id = assignments.class_id AND class_members.user_id = assignment_submissions.student_id JOIN users ON users.id = assignment_submissions.student_id WHERE assignment_submissions.assignment_id = ?1 AND assignment_submissions.student_id = ?2 AND class_members.status = 'active' ORDER BY assignment_submissions.submitted_at DESC"
  ).bind(assignmentId, student.id).all<SubmissionRow>();
  return rows.results.map(publicStudentSubmission);
}

export async function writeProgress(db: D1Database, user: AuthenticatedUser, chapterId: number, sectionId: string, input: unknown) {
  const body = objectBody(input);
  if (body.completed !== true) throw new TeachingError("INVALID_PROGRESS", 400, "完成状态只能标记为已完成。");
  validateChapterAndSection(chapterId, sectionId);
  const now = Date.now();
  await db.prepare(
    "INSERT INTO teaching_progress (user_id, chapter_id, section_id, completed, updated_at, revision) VALUES (?1, ?2, ?3, 1, ?4, 1) ON CONFLICT(user_id, chapter_id, section_id) DO UPDATE SET completed = 1, updated_at = excluded.updated_at, revision = CASE WHEN teaching_progress.completed = 1 THEN teaching_progress.revision ELSE teaching_progress.revision + 1 END"
  ).bind(user.id, chapterId, sectionId, now).run();
  const row = await db.prepare(
    "SELECT user_id, chapter_id, section_id, completed, updated_at, revision FROM teaching_progress WHERE user_id = ?1 AND chapter_id = ?2 AND section_id = ?3"
  ).bind(user.id, chapterId, sectionId).first<ProgressRow>();
  if (!row) throw new TeachingError("SERVER_DATA_INVALID", 500, "教学进度未保存。");
  return publicProgress(row);
}

export async function listOwnProgress(db: D1Database, user: AuthenticatedUser) {
  const rows = await db.prepare(
    "SELECT user_id, chapter_id, section_id, completed, updated_at, revision FROM teaching_progress WHERE user_id = ?1 ORDER BY chapter_id, section_id"
  ).bind(user.id).all<ProgressRow>();
  return rows.results.map(publicProgress);
}

export async function readPosition(db: D1Database, user: AuthenticatedUser) {
  const row = await db.prepare(
    "SELECT user_id, chapter_id, section_id, updated_at, revision FROM teaching_positions WHERE user_id = ?1"
  ).bind(user.id).first<PositionRow>();
  return row ? publicPosition(row) : null;
}

export async function writePosition(db: D1Database, user: AuthenticatedUser, input: unknown) {
  const body = objectBody(input);
  const chapterId = chapterIdValue(body.chapterId, "INVALID_POSITION");
  const sectionId = sectionIdValue(body.sectionId, "INVALID_POSITION");
  validateChapterAndSection(chapterId, sectionId, "INVALID_POSITION", "教学位置不正确。");
  const now = Date.now();
  await db.prepare(
    "INSERT INTO teaching_positions (user_id, chapter_id, section_id, updated_at, revision) VALUES (?1, ?2, ?3, ?4, 1) ON CONFLICT(user_id) DO UPDATE SET chapter_id = excluded.chapter_id, section_id = excluded.section_id, updated_at = excluded.updated_at, revision = teaching_positions.revision + 1"
  ).bind(user.id, chapterId, sectionId, now).run();
  const row = await db.prepare(
    "SELECT user_id, chapter_id, section_id, updated_at, revision FROM teaching_positions WHERE user_id = ?1"
  ).bind(user.id).first<PositionRow>();
  if (!row) throw new TeachingError("SERVER_DATA_INVALID", 500, "教学位置未保存。");
  return publicPosition(row);
}

/*
 * 章末大题的一次提交。
 *
 * 只接受答案内容：服务端用已发布的题目自己重新判分，客户端传来的任何
 * score / passed 都不会被读取。当前只有章末大题进入教师可见的提交记录，
 * 小节练习题仍然只是学生自己的草稿。
 */
export async function submitPracticeTask(db: D1Database, user: AuthenticatedUser, chapterId: number, taskId: string, input: unknown) {
  validateChapterId(chapterId, "INVALID_SUBMISSION", "题目提交不正确。");
  validateId(taskId, "题目");
  const body = objectBody(input);
  const answerContent = answerSource(body.answerContent);
  const clientSubmissionId = identifier(body.submissionId, "提交");
  const deviceId = identifier(body.deviceId, "设备");
  const clientVersion = optionalVersion(body.clientVersion);

  const item = PUBLISHED_TASKS.get(taskId);
  if (!item || item.task.kind !== "chapterTask" || item.chapter.id !== chapterId) {
    throw new TeachingError("INVALID_SUBMISSION", 400, "只有章末大题会记录提交。");
  }

  const existing = await db.prepare(
    "SELECT id, user_id, chapter_id, task_id, answer_content, client_version, server_score, server_passed, failed_layer, submitted_at FROM practice_submissions WHERE user_id = ?1 AND client_submission_id = ?2"
  ).bind(user.id, clientSubmissionId).first<PracticeSubmissionRow>();
  if (existing) return { submission: publicPracticeSubmission(existing), idempotent: true };

  await assertSubmissionRate(db, user.id, "practice_submission", PRACTICE_SUBMISSIONS_PER_WINDOW, PRACTICE_SUBMISSION_WINDOW_MS);
  const now = Date.now();

  const gradeResult = await gradeTask(taskId, answerContent);
  const row: PracticeSubmissionRow = {
    id: crypto.randomUUID(),
    user_id: user.id,
    chapter_id: chapterId,
    task_id: taskId,
    answer_content: answerContent,
    client_version: clientVersion,
    server_score: scoreFor(gradeResult.testResults),
    server_passed: gradeResult.passed ? 1 : 0,
    failed_layer: gradeResult.failedLayer,
    submitted_at: now
  };
  try {
    await db.prepare(
      "INSERT INTO practice_submissions (id, user_id, client_submission_id, chapter_id, task_id, answer_content, client_version, server_score, server_passed, failed_layer, submitted_by_device, submitted_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)"
    ).bind(
      row.id, user.id, clientSubmissionId, chapterId, taskId, answerContent, clientVersion,
      row.server_score, row.server_passed, row.failed_layer, deviceId, now
    ).run();
  } catch (caught) {
    throw submissionRateError(caught, PRACTICE_SUBMISSION_WINDOW_MS);
  }
  return { submission: publicPracticeSubmission(row), idempotent: false };
}

/** 学生看自己的提交记录。 */
export async function listOwnPracticeSubmissions(db: D1Database, user: AuthenticatedUser) {
  const rows = await db.prepare(
    "SELECT id, user_id, chapter_id, task_id, answer_content, client_version, server_score, server_passed, failed_layer, submitted_at FROM practice_submissions WHERE user_id = ?1 ORDER BY submitted_at DESC LIMIT ?2"
  ).bind(user.id, MAX_PRACTICE_SUBMISSION_LIST).all<PracticeSubmissionRow>();
  return rows.results.map(publicPracticeSubmission);
}

/** 老师看自己班级成员的章末大题提交；只能读自己的班级。 */
export async function listClassPracticeSubmissions(db: D1Database, teacher: AuthenticatedUser, classId: string, taskId: string | null) {
  await ownedClass(db, teacher, classId);
  if (taskId !== null) validateId(taskId, "题目");
  const filtered = taskId !== null;
  const statement = filtered
    ? db.prepare(
      "SELECT practice_submissions.id, practice_submissions.user_id, practice_submissions.chapter_id, practice_submissions.task_id, practice_submissions.answer_content, practice_submissions.client_version, practice_submissions.server_score, practice_submissions.server_passed, practice_submissions.failed_layer, practice_submissions.submitted_at, users.username, class_members.display_name FROM practice_submissions JOIN class_members ON class_members.user_id = practice_submissions.user_id JOIN users ON users.id = practice_submissions.user_id WHERE class_members.class_id = ?1 AND class_members.status = 'active' AND practice_submissions.task_id = ?2 ORDER BY practice_submissions.submitted_at DESC LIMIT ?3"
    ).bind(classId, taskId, MAX_PRACTICE_SUBMISSION_LIST)
    : db.prepare(
      "SELECT practice_submissions.id, practice_submissions.user_id, practice_submissions.chapter_id, practice_submissions.task_id, practice_submissions.answer_content, practice_submissions.client_version, practice_submissions.server_score, practice_submissions.server_passed, practice_submissions.failed_layer, practice_submissions.submitted_at, users.username, class_members.display_name FROM practice_submissions JOIN class_members ON class_members.user_id = practice_submissions.user_id JOIN users ON users.id = practice_submissions.user_id WHERE class_members.class_id = ?1 AND class_members.status = 'active' ORDER BY practice_submissions.submitted_at DESC LIMIT ?2"
    ).bind(classId, MAX_PRACTICE_SUBMISSION_LIST);
  const rows = await statement.all<PracticeSubmissionRow>();
  return rows.results.map((row) => ({
    ...publicPracticeSubmission(row),
    studentId: row.user_id,
    username: row.username ?? null,
    displayName: row.display_name ?? null
  }));
}

function publicPracticeSubmission(row: PracticeSubmissionRow) {
  return {
    id: row.id,
    chapterId: row.chapter_id,
    taskId: row.task_id,
    answerContent: row.answer_content,
    clientVersion: row.client_version,
    // 名字里带 server 前缀：这两个值只可能来自服务端判分。
    // 自出题没有自动结果：serverScore 为 null，不要把它当成 0 分读
    autoGraded: row.server_score !== null,
    serverScore: row.server_score,
    serverPassed: row.server_score !== null && row.server_passed === 1,
    failedLayer: row.failed_layer,
    submittedAt: row.submitted_at
  };
}

export async function listPracticeDrafts(db: D1Database, user: AuthenticatedUser) {
  const rows = await db.prepare(
    "SELECT id, user_id, chapter_id, task_id, source, revision, updated_by_device, updated_at FROM practice_drafts WHERE user_id = ?1 ORDER BY chapter_id, task_id"
  ).bind(user.id).all<PracticeDraftRow>();
  return rows.results.map(publicPracticeDraft);
}

export async function writePracticeDraft(db: D1Database, user: AuthenticatedUser, chapterId: number, taskId: string, input: unknown) {
  validateChapterId(chapterId, "INVALID_DRAFT", "题目草稿不正确。");
  validateId(taskId, "题目");
  const body = objectBody(input);
  const source = draftSource(body.source);
  const expectedDraftRevision = expectedRevision(body.expectedRevision);
  const deviceId = identifier(body.deviceId, "设备");
  const operationId = identifier(body.operationId, "同步操作");
  const entity = "practice-draft:" + chapterId + ":" + taskId;
  const duplicate = await priorOperation(db, user.id, operationId, entity);
  const current = await practiceDraft(db, user.id, chapterId, taskId);
  if (duplicate) {
    if (!current) throw new TeachingError("OPERATION_ID_REUSED", 409, "同步操作无法重放。");
    return { draft: publicPracticeDraft(current), idempotent: true };
  }
  if (!current) {
    if (expectedDraftRevision !== null) throw new TeachingError("SYNC_CONFLICT", 409, "题目草稿版本已变化。", { server: null });
    const now = Date.now();
    const draft: PracticeDraftRow = {
      id: crypto.randomUUID(), user_id: user.id, chapter_id: chapterId, task_id: taskId,
      source, revision: 1, updated_by_device: deviceId, updated_at: now
    };
    await db.batch([
      operationInsert(db, operationId, user.id, entity, now),
      db.prepare(
        "INSERT INTO practice_drafts (id, user_id, chapter_id, task_id, source, revision, updated_by_device, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, 1, ?6, ?7)"
      ).bind(draft.id, user.id, chapterId, taskId, source, deviceId, now)
    ]);
    return { draft: publicPracticeDraft(draft), idempotent: false };
  }
  if (expectedDraftRevision !== current.revision) {
    throw new TeachingError("SYNC_CONFLICT", 409, "题目草稿版本已变化。", { server: publicPracticeDraft(current) });
  }
  const now = Date.now();
  await db.batch([
    operationInsert(db, operationId, user.id, entity, now),
    db.prepare(
      "UPDATE practice_drafts SET source = ?1, updated_by_device = ?2, revision = revision + 1, updated_at = ?3 WHERE id = ?4 AND user_id = ?5 AND revision = ?6"
    ).bind(source, deviceId, now, current.id, user.id, expectedDraftRevision)
  ]);
  const saved = await practiceDraft(db, user.id, chapterId, taskId);
  if (!saved) throw new TeachingError("SERVER_DATA_INVALID", 500, "题目草稿未保存。");
  return { draft: publicPracticeDraft(saved), idempotent: false };
}

export async function listClassProgress(db: D1Database, teacher: AuthenticatedUser, classId: string) {
  await ownedClass(db, teacher, classId);
  const rows = await db.prepare(
    "SELECT class_members.user_id, class_members.display_name, users.username, teaching_progress.chapter_id, teaching_progress.section_id, teaching_progress.completed, teaching_progress.updated_at, teaching_progress.revision FROM class_members JOIN users ON users.id = class_members.user_id LEFT JOIN teaching_progress ON teaching_progress.user_id = class_members.user_id WHERE class_members.class_id = ?1 AND class_members.status = 'active' ORDER BY class_members.created_at, teaching_progress.chapter_id, teaching_progress.section_id"
  ).bind(classId).all<MemberRow & Partial<ProgressRow>>();
  return rows.results.map((row) => ({
    studentId: row.user_id,
    username: row.username,
    displayName: row.display_name,
    ...(row.chapter_id === undefined || row.chapter_id === null ? {} : {
      progress: {
        chapterId: row.chapter_id,
        sectionId: row.section_id,
        completed: row.completed === 1,
        updatedAt: row.updated_at,
        revision: row.revision
      }
    })
  }));
}

async function assignmentsForClass(db: D1Database, classId: string) {
  const rows = await db.prepare(
    "SELECT id, class_id, title, due_at, created_at, updated_at FROM assignments WHERE class_id = ?1 AND deleted_at IS NULL ORDER BY due_at IS NULL, due_at ASC, created_at DESC"
  ).bind(classId).all<AssignmentRow>();
  return attachItems(db, rows.results);
}

/**
 * 每份作业批到哪儿了：收到几份、其中几份还没批。
 *
 * 老师面板的作业列表要按「还有没有待批的」排序——没批完的排在上面。前端自己算的话
 * 得把每一份作业的全部提交（连着学生写的整段代码）都拉一遍，只为数两个数字；
 * 一个班十份作业就是十次大响应。所以在这里一次 GROUP BY 数完。
 *
 * 只数**每人每题最近一次**：学生可以无限重传，按提交条数数会把改过三遍的那个人
 * 算成三份待批。已经退班的学生不算（class_members 必须还是 active）。
 */
async function assignmentProgress(db: D1Database, classId: string): Promise<Map<string, { submitted: number; pending: number }>> {
  const rows = await db.prepare(
    "SELECT assignment_id, COUNT(*) AS submitted, SUM(CASE WHEN graded_at IS NULL THEN 1 ELSE 0 END) AS pending FROM (" +
    "SELECT assignment_submissions.assignment_id AS assignment_id, assignment_submissions.graded_at AS graded_at, " +
    "ROW_NUMBER() OVER (PARTITION BY assignment_submissions.assignment_id, assignment_submissions.student_id, assignment_submissions.task_id " +
    "ORDER BY assignment_submissions.submitted_at DESC) AS rn " +
    "FROM assignment_submissions " +
    "JOIN assignments ON assignments.id = assignment_submissions.assignment_id " +
    "JOIN class_members ON class_members.class_id = assignments.class_id AND class_members.user_id = assignment_submissions.student_id AND class_members.status = 'active' " +
    "WHERE assignments.class_id = ?1 AND assignments.deleted_at IS NULL" +
    ") WHERE rn = 1 GROUP BY assignment_id"
  ).bind(classId).all<{ assignment_id: string; submitted: number; pending: number }>();
  const out = new Map<string, { submitted: number; pending: number }>();
  rows.results.forEach((row) => {
    out.set(row.assignment_id, { submitted: Number(row.submitted) || 0, pending: Number(row.pending) || 0 });
  });
  return out;
}

async function gradeTask(taskId: string, source: string) {
  const item = PUBLISHED_TASKS.get(taskId);
  if (!item) throw new TeachingError("INVALID_ASSIGNMENT_ITEMS", 400, "作业题目不正确。");
  const taughtFeatures = item.section ? item.section.taughtFeatures : item.chapter.sections.at(-1)?.taughtFeatures ?? [];
  return grade({
    source,
    constraints: item.task.kind === "task" ? item.task.constraints : undefined,
    tests: item.task.tests.map((test) => ({ ...test, expected: expectedOutputs[taskId + "/" + test.id] ?? [] })),
    taughtFeatures,
    execute: {
      // 执行档按题目所属的章解析，和浏览器端判题、期望输出生成用的是同一个函数。
      profile: executionProfileOf(item.chapter),
      maxSteps: 200_000,
      maxActiveTimeMs: 1_500,
      maxOutputLines: 2_000,
      maxOutputBytes: 256 * 1024,
      maxArrayElements: 100_000,
      maxCallDepth: 128,
      maxFileBytes: 256 * 1024,
      maxProjectFileBytes: 2 * 1024 * 1024,
      yieldEverySteps: 64
    }
  });
}

async function attachItems(db: D1Database, assignments: AssignmentRow[]) {
  if (!assignments.length) return [];
  const ids = assignments.map((assignment) => assignment.id);
  const placeholders = ids.map(() => "?").join(",");
  const rows = await db.prepare(
    "SELECT assignment_id, task_id, position, title, prompt, guidance FROM assignment_items WHERE assignment_id IN (" + placeholders + ") ORDER BY assignment_id, position"
  ).bind(...ids).all<{ assignment_id: string; task_id: string; position: number; title: string | null; prompt: string | null; guidance: string | null }>();
  const itemsByAssignment = new Map<string, ReturnType<typeof publicItem>[]>();
  rows.results.forEach((row) => {
    const group = itemsByAssignment.get(row.assignment_id) ?? [];
    group.push(publicItem(row));
    itemsByAssignment.set(row.assignment_id, group);
  });
  return assignments.map((assignment) => ({ ...publicAssignment(assignment), items: itemsByAssignment.get(assignment.id) ?? [] }));
}

/* 预检把已经到顶的请求挡在 gradeTask() 之前；真正的计数和 INSERT 在 D1
   触发器的同一事务里，两个并发请求都通过预检时仍不可能一起越过上限。 */
async function assertSubmissionRate(
  db: D1Database, userId: string, scope: "assignment_submission" | "practice_submission", maximum: number, windowMs: number
): Promise<void> {
  const now = Date.now();
  const windowStartedAt = Math.floor(now / windowMs) * Math.floor(windowMs / 1000);
  const row = await db.prepare(
    "SELECT attempts FROM service_rate_limits WHERE scope = ?1 AND subject_id = ?2 AND window_started_at = ?3"
  ).bind(scope, userId, windowStartedAt).first<{ attempts: number }>();
  if ((row?.attempts ?? 0) >= maximum) throw submissionThrottled(windowMs, now);
}

function submissionRateError(caught: unknown, windowMs: number): TeachingError {
  const message = caught instanceof Error ? caught.message : "";
  if (message.includes("ASSIGNMENT_SUBMISSION_THROTTLED") || message.includes("PRACTICE_SUBMISSION_THROTTLED")) {
    return submissionThrottled(windowMs, Date.now());
  }
  if (caught instanceof Error) throw caught;
  throw new TeachingError("SERVER_DATA_INVALID", 500, "提交未保存。");
}

function submissionThrottled(windowMs: number, now: number): TeachingError {
  const windowEnds = (Math.floor(now / windowMs) + 1) * windowMs;
  const retryAfterSeconds = Math.max(1, Math.ceil((windowEnds - now) / 1000));
  return new TeachingError("SUBMISSION_THROTTLED", 429, "提交过于频繁，请稍后再试。", { retryAfterSeconds });
}

async function ownedClass(db: D1Database, user: AuthenticatedUser, classId: string): Promise<ClassRow> {
  requireTeacher(user);
  validateId(classId, "班级");
  const row = await db.prepare(
    "SELECT id, teacher_id, name, join_code, join_locked_at, created_at, updated_at FROM classes WHERE id = ?1 AND teacher_id = ?2"
  ).bind(classId, user.id).first<ClassRow>();
  if (!row) throw new TeachingError("NOT_FOUND", 404, "班级不存在。");
  return row;
}

async function ensureStudentCapacity(db: D1Database, classRow: ClassRow): Promise<void> {
  const classCount = await db.prepare(
    `SELECT COUNT(*) AS count FROM class_members JOIN users ON users.id = class_members.user_id
      WHERE class_members.class_id = ?1 AND class_members.status = 'active' AND users.role = 'student'`
  ).bind(classRow.id).first<{ count: number }>();
  if ((classCount?.count ?? 0) >= MAX_STUDENTS_PER_CLASS) {
    throw new TeachingError("CLASS_STUDENT_LIMIT", 409, "每个班级最多只能有 " + MAX_STUDENTS_PER_CLASS + " 名学生。");
  }
  const teacherCount = await db.prepare(
    `SELECT COUNT(DISTINCT class_members.user_id) AS count
       FROM class_members JOIN classes ON classes.id = class_members.class_id JOIN users ON users.id = class_members.user_id
      WHERE classes.teacher_id = ?1 AND class_members.status = 'active' AND users.role = 'student'`
  ).bind(classRow.teacher_id).first<{ count: number }>();
  if ((teacherCount?.count ?? 0) >= MAX_STUDENTS_PER_TEACHER) {
    throw new TeachingError("TEACHER_STUDENT_LIMIT", 409, "每位老师最多只能有 " + MAX_STUDENTS_PER_TEACHER + " 名学生。");
  }
}

function capacityError(caught: unknown): TeachingError {
  const message = caught instanceof Error ? caught.message : "";
  if (message.includes("CLASS_STUDENT_LIMIT")) {
    return new TeachingError("CLASS_STUDENT_LIMIT", 409, "每个班级最多只能有 " + MAX_STUDENTS_PER_CLASS + " 名学生。");
  }
  if (message.includes("TEACHER_STUDENT_LIMIT")) {
    return new TeachingError("TEACHER_STUDENT_LIMIT", 409, "每位老师最多只能有 " + MAX_STUDENTS_PER_TEACHER + " 名学生。");
  }
  if (caught instanceof Error) throw caught;
  throw new TeachingError("SERVER_DATA_INVALID", 500, "学生账号未创建。");
}

function publicClass(row: ClassRow, includeJoinCode: boolean) {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ...(includeJoinCode ? { joinCode: row.join_code, joinLocked: row.join_locked_at !== null } : {})
  };
}

/* 两种题共用一个形状：`id` 是这道题在作业里的键，课程题目额外带 taskId。 */
function publicItem(row: { task_id: string; title: string | null; prompt: string | null; guidance: string | null }) {
  const custom = row.prompt !== null;
  return {
    id: row.task_id,
    kind: custom ? "custom" : "task",
    ...(custom ? { title: row.title, prompt: row.prompt, guidance: row.guidance } : { taskId: row.task_id })
  };
}

function publicAssignment(row: AssignmentRow) {
  return { id: row.id, classId: row.class_id, title: row.title, dueAt: row.due_at, createdAt: row.created_at, updatedAt: row.updated_at };
}

function publicProgress(row: ProgressRow) {
  return { chapterId: row.chapter_id, sectionId: row.section_id, completed: row.completed === 1, updatedAt: row.updated_at, revision: row.revision };
}

function publicPosition(row: PositionRow) {
  return { chapterId: row.chapter_id, sectionId: row.section_id, updatedAt: row.updated_at, revision: row.revision };
}

function publicPracticeDraft(row: PracticeDraftRow) {
  return {
    id: row.id,
    chapterId: row.chapter_id,
    taskId: row.task_id,
    source: row.source,
    revision: row.revision,
    updatedByDevice: row.updated_by_device,
    updatedAt: row.updated_at
  };
}

type SubmissionRow = {
  id: string;
  assignment_id: string;
  task_id: string;
  student_id: string;
  answer_content: string;
  client_version: string | null;
  server_score: number;
  server_passed: number;
  submitted_at: number;
  teacher_score: number | null;
  teacher_comment: string | null;
  graded_at: number | null;
  username: string;
  display_name: string;
};

function publicTeacherSubmission(row: SubmissionRow) {
  return {
    id: row.id,
    assignmentId: row.assignment_id,
    taskId: row.task_id,
    studentId: row.student_id,
    username: row.username,
    displayName: row.display_name,
    answerContent: row.answer_content,
    clientVersion: row.client_version,
    // 自出题没有自动结果：serverScore 为 null，不要把它当成 0 分读
    autoGraded: row.server_score !== null,
    serverScore: row.server_score,
    serverPassed: row.server_score !== null && row.server_passed === 1,
    // 自动判分只反映跑通了几个用例，是参考；成绩以老师给的为准
    teacherScore: row.teacher_score,
    teacherComment: row.teacher_comment,
    gradedAt: row.graded_at,
    graded: row.graded_at !== null,
    submittedAt: row.submitted_at
  };
}

function publicStudentSubmission(row: SubmissionRow) {
  return {
    id: row.id,
    assignmentId: row.assignment_id,
    taskId: row.task_id,
    answerContent: row.answer_content,
    clientVersion: row.client_version,
    // 自出题没有自动结果：serverScore 为 null，不要把它当成 0 分读
    autoGraded: row.server_score !== null,
    serverScore: row.server_score,
    serverPassed: row.server_score !== null && row.server_passed === 1,
    // 自动判分只反映跑通了几个用例，是参考；成绩以老师给的为准
    teacherScore: row.teacher_score,
    teacherComment: row.teacher_comment,
    gradedAt: row.graded_at,
    graded: row.graded_at !== null,
    submittedAt: row.submitted_at
  };
}

function requireTeacher(user: AuthenticatedUser): void {
  if (user.role !== "teacher") throw new TeachingError("FORBIDDEN", 403, "只有老师可以执行此操作。");
}

function objectBody(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new TeachingError("INVALID_REQUEST", 400, "请求内容不正确。");
  return input as Record<string, unknown>;
}

function nameValue(value: unknown, limit: number, label: string): string {
  if (typeof value !== "string") throw new TeachingError("INVALID_REQUEST", 400, label + "不正确。");
  const result = value.trim();
  if (!result || result.length > limit) throw new TeachingError("INVALID_REQUEST", 400, label + "不正确。");
  return result;
}

function optionalTimestamp(value: unknown): number | null {
  if (value === undefined || value === null) return null;
  if (!Number.isSafeInteger(value) || (value as number) < 0) throw new TeachingError("INVALID_DUE_AT", 400, "截止时间不正确。");
  return value as number;
}

const MAX_CUSTOM_TITLE = 160;
const MAX_CUSTOM_PROMPT = 8000;
const MAX_CUSTOM_GUIDANCE = 4000;

export type AssignmentItemInput = {
  id: string;
  title: string | null;
  prompt: string | null;
  guidance: string | null;
};

/*
 * 一份作业里的题可以是两种：课程里已发布的题（有判题数据，学生能拿到用例和提示），
 * 或者老师自己写的纯文本题（只有题面和可选提示，学生写完自己跑，不判分）。
 * 两种都用 task_id 当键：前者是真实题号，后者是 `custom:<uuid>`。
 */
function assignmentItems(value: unknown): AssignmentItemInput[] {
  if (!Array.isArray(value) || !value.length || value.length > MAX_ASSIGNMENT_ITEMS) {
    throw new TeachingError("INVALID_ASSIGNMENT_ITEMS", 400, "作业题目不正确。");
  }
  const items = value.map((entry): AssignmentItemInput => {
    // 字符串＝课程题号，保持旧的调用形状可用
    if (typeof entry === "string") {
      if (!PUBLISHED_TASK_IDS.has(entry)) throw new TeachingError("INVALID_ASSIGNMENT_ITEMS", 400, "作业题目不正确。");
      return { id: entry, title: null, prompt: null, guidance: null };
    }
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new TeachingError("INVALID_ASSIGNMENT_ITEMS", 400, "作业题目不正确。");
    }
    const item = entry as Record<string, unknown>;
    if (item.kind === "task") {
      const taskId = item.taskId;
      if (typeof taskId !== "string" || !PUBLISHED_TASK_IDS.has(taskId)) {
        throw new TeachingError("INVALID_ASSIGNMENT_ITEMS", 400, "作业题目不正确。");
      }
      return { id: taskId, title: null, prompt: null, guidance: null };
    }
    if (item.kind !== "custom") throw new TeachingError("INVALID_ASSIGNMENT_ITEMS", 400, "作业题目不正确。");
    const title = nameValue(item.title, MAX_CUSTOM_TITLE, "题目标题");
    if (typeof item.prompt !== "string" || !item.prompt.trim()) {
      throw new TeachingError("INVALID_ASSIGNMENT_ITEMS", 400, "自己出的题要写题目内容。");
    }
    const prompt = item.prompt.trim().slice(0, MAX_CUSTOM_PROMPT);
    const guidance = typeof item.guidance === "string" && item.guidance.trim()
      ? item.guidance.trim().slice(0, MAX_CUSTOM_GUIDANCE) : null;
    // 改题时沿用原来的 id，学生已交的答案才不会和题目脱钩
    const id = typeof item.id === "string" && /^custom:[A-Za-z0-9-]{1,80}$/.test(item.id)
      ? item.id : "custom:" + crypto.randomUUID();
    return { id, title, prompt, guidance };
  });
  if (new Set(items.map((item) => item.id)).size !== items.length) {
    throw new TeachingError("INVALID_ASSIGNMENT_ITEMS", 400, "作业题目不能重复。");
  }
  return items;
}

function taskIdValue(value: unknown): string {
  if (typeof value !== "string" || !PUBLISHED_TASK_IDS.has(value)) throw new TeachingError("INVALID_ASSIGNMENT_ITEMS", 400, "作业题目不正确。");
  return value;
}

function answerSource(value: unknown): string {
  if (typeof value !== "string" || new TextEncoder().encode(value).byteLength > 256 * 1024) {
    throw new TeachingError("INVALID_SUBMISSION", 400, "作答内容不正确。");
  }
  return value;
}

function optionalVersion(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string" || value.length > 100) throw new TeachingError("INVALID_SUBMISSION", 400, "客户端版本不正确。");
  return value;
}

function scoreFor(results: Array<{ passed: boolean }>): number {
  if (!results.length) return 0;
  return Math.round((results.filter((result) => result.passed).length / results.length) * 100);
}

/*
 * 章末大题在课程数据里没有小节号，客户端按推进顺序把它记作 `chapterTask`。
 * 它和普通小节一样要跨设备同步，也要能进入老师可见的班级进度，
 * 所以是一个合法的 section 标识，而不是只能留在本机的特例。
 * 每章至多一个，(user_id, chapter_id, section_id) 主键天然够用。
 */
const CHAPTER_TASK_SECTION = "chapterTask";

function validateChapterAndSection(chapterId: number, sectionId: string, code = "INVALID_PROGRESS", message = "教学进度不正确。"): void {
  const sectionOk = sectionId === CHAPTER_TASK_SECTION || /^[0-9]+\.[0-9]+(?:\.[0-9]+)?$/.test(sectionId);
  if (!Number.isSafeInteger(chapterId) || chapterId < 1 || chapterId > 99 || !sectionOk) {
    throw new TeachingError(code, 400, message);
  }
}

function chapterIdValue(value: unknown, code: string): number {
  if (!Number.isSafeInteger(value)) throw new TeachingError(code, 400, "教学位置不正确。");
  return value as number;
}

function sectionIdValue(value: unknown, code: string): string {
  if (typeof value !== "string") throw new TeachingError(code, 400, "教学位置不正确。");
  return value;
}

function validateChapterId(chapterId: number, code: string, message: string): void {
  if (!Number.isSafeInteger(chapterId) || chapterId < 1 || chapterId > 99) throw new TeachingError(code, 400, message);
}

function draftSource(value: unknown): string {
  if (typeof value !== "string" || textEncoder.encode(value).byteLength > MAX_PRACTICE_DRAFT_BYTES) {
    throw new TeachingError("INVALID_DRAFT", 400, "题目草稿不正确。");
  }
  return value;
}

function expectedRevision(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (!Number.isSafeInteger(value) || (value as number) < 1) throw new TeachingError("INVALID_REVISION", 400, "版本号不正确。");
  return value as number;
}

function identifier(value: unknown, label: string): string {
  if (typeof value !== "string") throw new TeachingError("INVALID_REQUEST", 400, label + "标识不正确。");
  validateId(value, label);
  return value;
}

async function practiceDraft(db: D1Database, userId: string, chapterId: number, taskId: string): Promise<PracticeDraftRow | null> {
  return db.prepare(
    "SELECT id, user_id, chapter_id, task_id, source, revision, updated_by_device, updated_at FROM practice_drafts WHERE user_id = ?1 AND chapter_id = ?2 AND task_id = ?3"
  ).bind(userId, chapterId, taskId).first<PracticeDraftRow>();
}

async function priorOperation(db: D1Database, userId: string, operationId: string, entity: string): Promise<boolean> {
  const existing = await db.prepare(
    "SELECT entity FROM sync_operations WHERE operation_id = ?1 AND user_id = ?2"
  ).bind(operationId, userId).first<OperationRow>();
  if (!existing) return false;
  if (existing.entity !== entity) throw new TeachingError("OPERATION_ID_REUSED", 409, "同步操作标识已用于其他变更。");
  return true;
}

function operationInsert(db: D1Database, operationId: string, userId: string, entity: string, now: number) {
  return db.prepare(
    "INSERT INTO sync_operations (operation_id, user_id, entity, created_at, processed_at) VALUES (?1, ?2, ?3, ?4, ?4)"
  ).bind(operationId, userId, entity, now);
}

function validateId(value: string, label: string): void {
  if (!/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(value)) throw new TeachingError("INVALID_ID", 400, label + "标识不正确。");
}

/*
 * 班级码是要念给学生、让学生抄的，所以形状固定成「三个字母 + 三个数字」，
 * 例如 ABC123——比八位随机混排好记得多，也好念。
 *
 * 字母去掉 I 和 O（容易看成 1 和 0）；数字保留 0-9：位置是固定的，
 * 后三位一定是数字，所以 0 不会被当成 O。
 * 组合数 24^3 × 10^3 ≈ 1380 万，配合唯一约束和重试足够。
 */
const JOIN_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const JOIN_DIGITS = "0123456789";

/** 拒绝采样：256 不是 24 或 10 的整数倍，直接取模会让靠前的字符更容易出现。 */
function pick(alphabet: string): string {
  const limit = Math.floor(256 / alphabet.length) * alphabet.length;
  const byte = new Uint8Array(1);
  for (;;) {
    crypto.getRandomValues(byte);
    if (byte[0] < limit) return alphabet[byte[0] % alphabet.length];
  }
}

function joinCode(): string {
  let code = "";
  for (let i = 0; i < 3; i += 1) code += pick(JOIN_LETTERS);
  for (let i = 0; i < 3; i += 1) code += pick(JOIN_DIGITS);
  return code;
}

/** 班级码不区分大小写，念的时候加的空格横线也一并去掉。 */
export function normaliseJoinCode(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/** join_code 有唯一约束，码短了就必须处理撞车，撞了换一个再来。 */
async function uniqueJoinCode(db: D1Database): Promise<string> {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const code = joinCode();
    const taken = await db.prepare("SELECT id FROM classes WHERE join_code = ?1").bind(code).first<{ id: string }>();
    if (!taken) return code;
  }
  throw new TeachingError("JOIN_CODE_UNAVAILABLE", 503, "服务器繁忙，请稍后再试。");
}
