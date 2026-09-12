import {
  AuthError,
  activateStudent,
  currentUser,
  expiredCookieHeader,
  loginStudent,
  logout,
  publicUser,
  startEmailLogin,
  verifyEmailLogin
} from "./auth";
import {
  SyncError,
  deleteFile,
  deleteProject,
  listProjects,
  readFile,
  writeFile,
  writeProject
} from "./sync";
import { RunError, runSnapshot } from "./run";
import {
  TeachingError,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  restoreAssignment,
  createClass,
  createStudentInClass,
  resetStudentInClass,
  renameStudentInClass,
  setClassJoinLock,
  gradeAssignmentSubmission,
  listClassAssignments,
  listClassProgress,
  listClasses,
  registerStudentWithJoinCode,
  listMembers,
  listOwnProgress,
  listPracticeDrafts,
  listOwnPracticeSubmissions,
  listClassPracticeSubmissions,
  submitPracticeTask,
  readPosition,
  listStudentAssignments,
  listStudentSubmissions,
  listTeacherSubmissions,
  submitAssignment,
  writePracticeDraft,
  writePosition,
  writeProgress
} from "./teaching";

export type Role = "teacher" | "student" | "learner";

type RequestContext = { requestId: string };

const json = (body: unknown, status = 200, headers: HeadersInit = {}) => Response.json(body, {
  status,
  headers: { "cache-control": "no-store", ...headers }
});

const error = (code: string, message: string, status: number, context: RequestContext) =>
  json({ code, message, requestId: context.requestId }, status);

function requestContext(request: Request): RequestContext {
  return { requestId: request.headers.get("x-request-id") || crypto.randomUUID() };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const context = requestContext(request);
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, { status: 204 });
    if (url.pathname === "/health" && request.method === "GET") return json({ ok: true, service: "seedtocode-api", requestId: context.requestId });

    if (!env.DB) return error("SERVER_NOT_CONFIGURED", "服务器尚未配置。", 503, context);
    try {
      if (url.pathname === "/auth/email/start" && request.method === "POST") {
        const result = await startEmailLogin(env.DB, env, await request.json());
        return json({ accepted: true, ...result, requestId: context.requestId }, 202);
      }
      if (url.pathname === "/auth/email/verify" && request.method === "POST") {
        const result = await verifyEmailLogin(env.DB, env, await request.json());
        return json({ user: result.user, requestId: context.requestId }, 200, { "set-cookie": result.setCookie });
      }
      if (url.pathname === "/auth/student/activate" && request.method === "POST") {
        const result = await activateStudent(env.DB, env, await request.json());
        return json({ user: result.user, requestId: context.requestId }, 200, { "set-cookie": result.setCookie });
      }
      if (url.pathname === "/auth/student/register" && request.method === "POST") {
        // 限流要按真实来源，Cloudflare 会把它放在 cf-connecting-ip；
        // 本机联调没有这个头，退回一个固定值（本地不需要防枚举）。
        const clientIp = request.headers.get("cf-connecting-ip") || "local";
        const result = await registerStudentWithJoinCode(env.DB, env, await request.json(), clientIp);
        return json({ user: result.user, className: result.className, requestId: context.requestId }, 201, { "set-cookie": result.setCookie });
      }
      if (url.pathname === "/auth/student/login" && request.method === "POST") {
        const result = await loginStudent(env.DB, env, await request.json());
        return json({ user: result.user, requestId: context.requestId }, 200, { "set-cookie": result.setCookie });
      }
      if (url.pathname === "/auth/me" && request.method === "GET") {
        const user = await currentUser(env.DB, request);
        if (!user) return error("UNAUTHENTICATED", "请先登录。", 401, context);
        return json({ user: publicUser(user), requestId: context.requestId });
      }
      if (url.pathname === "/auth/logout" && request.method === "POST") {
        await logout(env.DB, request);
        return json({ ok: true, requestId: context.requestId }, 200, { "set-cookie": expiredCookieHeader(env) });
      }
      if (url.pathname === "/api/projects" && request.method === "GET") {
        const user = await requireUser(env.DB, request);
        return json({ projects: await listProjects(env.DB, user), requestId: context.requestId });
      }
      const projectMatch = /^\/api\/projects\/([^/]+)$/.exec(url.pathname);
      if (projectMatch && request.method === "PUT") {
        const user = await requireUser(env.DB, request);
        const result = await writeProject(env.DB, user, decodeURIComponent(projectMatch[1]), await request.json());
        return json({ ...result, requestId: context.requestId }, result.idempotent ? 200 : 201);
      }
      if (projectMatch && request.method === "DELETE") {
        const user = await requireUser(env.DB, request);
        const result = await deleteProject(env.DB, user, decodeURIComponent(projectMatch[1]), await request.json());
        return json({ ...result, requestId: context.requestId });
      }
      const fileMatch = /^\/api\/projects\/([^/]+)\/files\/([^/]+)$/.exec(url.pathname);
      if (fileMatch && request.method === "GET") {
        const user = await requireUser(env.DB, request);
        return json({ file: await readFile(env.DB, user, decodeURIComponent(fileMatch[1]), decodeURIComponent(fileMatch[2])), requestId: context.requestId });
      }
      if (fileMatch && request.method === "PUT") {
        const user = await requireUser(env.DB, request);
        const result = await writeFile(env.DB, user, decodeURIComponent(fileMatch[1]), decodeURIComponent(fileMatch[2]), await request.json());
        return json({ ...result, requestId: context.requestId }, result.idempotent ? 200 : 201);
      }
      if (fileMatch && request.method === "DELETE") {
        const user = await requireUser(env.DB, request);
        const result = await deleteFile(env.DB, user, decodeURIComponent(fileMatch[1]), decodeURIComponent(fileMatch[2]), await request.json());
        return json({ ...result, requestId: context.requestId });
      }
      if (url.pathname === "/api/runs" && request.method === "POST") {
        const user = await requireUser(env.DB, request);
        return json(await runSnapshot(env.DB, user, await request.json()), 200, { "x-request-id": context.requestId });
      }
      if (url.pathname === "/api/classes" && request.method === "GET") {
        const user = await requireUser(env.DB, request);
        return json({ classes: await listClasses(env.DB, user), requestId: context.requestId });
      }
      if (url.pathname === "/api/classes" && request.method === "POST") {
        const user = await requireUser(env.DB, request);
        return json({ class: await createClass(env.DB, user, await request.json()), requestId: context.requestId }, 201);
      }
      const joinLockMatch = /^\/api\/classes\/([^/]+)\/join-lock$/.exec(url.pathname);
      if (joinLockMatch && request.method === "PUT") {
        const user = await requireUser(env.DB, request);
        return json({
          class: await setClassJoinLock(env.DB, user, decodeURIComponent(joinLockMatch[1]), await request.json()),
          requestId: context.requestId
        });
      }
      const classMatch = /^\/api\/classes\/([^/]+)\/(students|assignments|progress)$/.exec(url.pathname);
      if (classMatch && classMatch[2] === "students" && request.method === "GET") {
        const user = await requireUser(env.DB, request);
        return json({ students: await listMembers(env.DB, user, decodeURIComponent(classMatch[1])), requestId: context.requestId });
      }
      if (classMatch && classMatch[2] === "students" && request.method === "POST") {
        const user = await requireUser(env.DB, request);
        return json({ ...await createStudentInClass(env.DB, user, decodeURIComponent(classMatch[1]), await request.json()), requestId: context.requestId }, 201);
      }
      const studentMatch = /^\/api\/classes\/([^/]+)\/students\/([^/]+)$/.exec(url.pathname);
      if (studentMatch && request.method === "PUT") {
        const user = await requireUser(env.DB, request);
        return json({
          student: await renameStudentInClass(
            env.DB, user, decodeURIComponent(studentMatch[1]), decodeURIComponent(studentMatch[2]), await request.json()
          ),
          requestId: context.requestId
        });
      }
      const studentResetMatch = /^\/api\/classes\/([^/]+)\/students\/([^/]+)\/reset-activation$/.exec(url.pathname);
      if (studentResetMatch && request.method === "POST") {
        const user = await requireUser(env.DB, request);
        return json({ ...await resetStudentInClass(env.DB, user, decodeURIComponent(studentResetMatch[1]), decodeURIComponent(studentResetMatch[2])), requestId: context.requestId });
      }
      if (classMatch && classMatch[2] === "assignments" && request.method === "GET") {
        const user = await requireUser(env.DB, request);
        return json({ assignments: await listClassAssignments(env.DB, user, decodeURIComponent(classMatch[1])), requestId: context.requestId });
      }
      if (classMatch && classMatch[2] === "assignments" && request.method === "POST") {
        const user = await requireUser(env.DB, request);
        return json({ assignment: await createAssignment(env.DB, user, decodeURIComponent(classMatch[1]), await request.json()), requestId: context.requestId }, 201);
      }
      if (classMatch && classMatch[2] === "progress" && request.method === "GET") {
        const user = await requireUser(env.DB, request);
        return json({ progress: await listClassProgress(env.DB, user, decodeURIComponent(classMatch[1])), requestId: context.requestId });
      }
      if (url.pathname === "/api/assignments" && request.method === "GET") {
        const user = await requireUser(env.DB, request);
        return json({ assignments: await listStudentAssignments(env.DB, user), requestId: context.requestId });
      }
      const assignmentSubmissionMatch = /^\/api\/assignments\/([^/]+)\/submissions$/.exec(url.pathname);
      if (assignmentSubmissionMatch && request.method === "POST") {
        const user = await requireUser(env.DB, request);
        return json({ submission: await submitAssignment(env.DB, user, decodeURIComponent(assignmentSubmissionMatch[1]), await request.json()), requestId: context.requestId }, 201);
      }
      if (assignmentSubmissionMatch && request.method === "GET") {
        const user = await requireUser(env.DB, request);
        return json({ submissions: await listStudentSubmissions(env.DB, user, decodeURIComponent(assignmentSubmissionMatch[1])), requestId: context.requestId });
      }
      const classAssignmentMatch = /^\/api\/classes\/([^/]+)\/assignments\/([^/]+)$/.exec(url.pathname);
      if (classAssignmentMatch && request.method === "PUT") {
        const user = await requireUser(env.DB, request);
        return json({
          assignment: await updateAssignment(
            env.DB, user, decodeURIComponent(classAssignmentMatch[1]), decodeURIComponent(classAssignmentMatch[2]), await request.json()
          ),
          requestId: context.requestId
        });
      }
      if (classAssignmentMatch && request.method === "DELETE") {
        const user = await requireUser(env.DB, request);
        return json({
          ...await deleteAssignment(env.DB, user, decodeURIComponent(classAssignmentMatch[1]), decodeURIComponent(classAssignmentMatch[2])),
          requestId: context.requestId
        });
      }
      const gradeMatch = /^\/api\/classes\/([^/]+)\/submissions\/([^/]+)\/grade$/.exec(url.pathname);
      if (gradeMatch && request.method === "PUT") {
        const user = await requireUser(env.DB, request);
        return json({
          submission: await gradeAssignmentSubmission(
            env.DB, user, decodeURIComponent(gradeMatch[1]), decodeURIComponent(gradeMatch[2]), await request.json()
          ),
          requestId: context.requestId
        });
      }
      const assignmentRestoreMatch = /^\/api\/classes\/([^/]+)\/assignments\/([^/]+)\/restore$/.exec(url.pathname);
      if (assignmentRestoreMatch && request.method === "POST") {
        const user = await requireUser(env.DB, request);
        return json({
          assignment: await restoreAssignment(
            env.DB, user, decodeURIComponent(assignmentRestoreMatch[1]), decodeURIComponent(assignmentRestoreMatch[2])
          ),
          requestId: context.requestId
        });
      }
      const teacherSubmissionMatch = /^\/api\/classes\/([^/]+)\/assignments\/([^/]+)\/submissions$/.exec(url.pathname);
      if (teacherSubmissionMatch && request.method === "GET") {
        const user = await requireUser(env.DB, request);
        return json({ submissions: await listTeacherSubmissions(env.DB, user, decodeURIComponent(teacherSubmissionMatch[1]), decodeURIComponent(teacherSubmissionMatch[2])), requestId: context.requestId });
      }
      if (url.pathname === "/api/teaching/progress" && request.method === "GET") {
        const user = await requireUser(env.DB, request);
        return json({ progress: await listOwnProgress(env.DB, user), requestId: context.requestId });
      }
      const progressMatch = /^\/api\/teaching\/progress\/([0-9]+)\/([^/]+)$/.exec(url.pathname);
      if (progressMatch && request.method === "PUT") {
        const user = await requireUser(env.DB, request);
        return json({ progress: await writeProgress(env.DB, user, Number(progressMatch[1]), decodeURIComponent(progressMatch[2]), await request.json()), requestId: context.requestId });
      }
      if (url.pathname === "/api/teaching/position" && request.method === "GET") {
        const user = await requireUser(env.DB, request);
        return json({ position: await readPosition(env.DB, user), requestId: context.requestId });
      }
      if (url.pathname === "/api/teaching/position" && request.method === "PUT") {
        const user = await requireUser(env.DB, request);
        return json({ position: await writePosition(env.DB, user, await request.json()), requestId: context.requestId });
      }
      if (url.pathname === "/api/practice-drafts" && request.method === "GET") {
        const user = await requireUser(env.DB, request);
        return json({ drafts: await listPracticeDrafts(env.DB, user), requestId: context.requestId });
      }
      if (url.pathname === "/api/practice-submissions" && request.method === "GET") {
        const user = await requireUser(env.DB, request);
        return json({ submissions: await listOwnPracticeSubmissions(env.DB, user), requestId: context.requestId });
      }
      const practiceSubmissionMatch = /^\/api\/practice-submissions\/([0-9]+)\/([^/]+)$/.exec(url.pathname);
      if (practiceSubmissionMatch && request.method === "POST") {
        const user = await requireUser(env.DB, request);
        const result = await submitPracticeTask(
          env.DB, user, Number(practiceSubmissionMatch[1]), decodeURIComponent(practiceSubmissionMatch[2]), await request.json()
        );
        return json({ ...result, requestId: context.requestId }, result.idempotent ? 200 : 201);
      }
      const classPracticeMatch = /^\/api\/classes\/([^/]+)\/practice-submissions$/.exec(url.pathname);
      if (classPracticeMatch && request.method === "GET") {
        const user = await requireUser(env.DB, request);
        return json({
          submissions: await listClassPracticeSubmissions(
            env.DB, user, decodeURIComponent(classPracticeMatch[1]), url.searchParams.get("taskId")
          ),
          requestId: context.requestId
        });
      }
      const practiceDraftMatch = /^\/api\/practice-drafts\/([0-9]+)\/([^/]+)$/.exec(url.pathname);
      if (practiceDraftMatch && request.method === "PUT") {
        const user = await requireUser(env.DB, request);
        const result = await writePracticeDraft(env.DB, user, Number(practiceDraftMatch[1]), decodeURIComponent(practiceDraftMatch[2]), await request.json());
        return json({ ...result, requestId: context.requestId }, result.idempotent ? 200 : 201);
      }
    } catch (caught) {
      if (caught instanceof AuthError) return json({ code: caught.code, message: caught.message, ...caught.extra, requestId: context.requestId }, caught.status);
      if (caught instanceof SyncError) return json({ code: caught.code, message: caught.message, ...caught.extra, requestId: context.requestId }, caught.status);
      if (caught instanceof RunError) return error(caught.code, caught.message, caught.status, context);
      if (caught instanceof TeachingError) return json({ code: caught.code, message: caught.message, ...caught.extra, requestId: context.requestId }, caught.status);
      if (caught instanceof SyntaxError) return error("INVALID_REQUEST", "请求内容不正确。", 400, context);
      throw caught;
    }

    return error("NOT_FOUND", "接口不存在。", 404, context);
  }
};

async function requireUser(db: D1Database, request: Request) {
  const user = await currentUser(db, request);
  if (!user) throw new AuthError("UNAUTHENTICATED", 401, "请先登录。");
  return user;
}
