import { Submission, AnswerValue } from "./types";
import { STORAGE_KEY } from "./constants";

// Generar código de participante aleatorio (8 caracteres alfanuméricos)
export function generateParticipantCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Obtener todas las submissions del localStorage
function getAllSubmissions(): Submission[] {
  if (typeof window === "undefined") return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error al leer submissions:", error);
    return [];
  }
}

// Guardar todas las submissions en localStorage
function saveAllSubmissions(submissions: Submission[]): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  } catch (error) {
    console.error("Error al guardar submissions:", error);
  }
}

// Guardar una nueva submission
export function saveSubmission(
  groupCode: string,
  answers: AnswerValue[]
): string {
  const participantCode = generateParticipantCode();
  const submission: Submission = {
    groupCode,
    participantCode,
    answers,
    timestamp: Date.now(),
  };

  const submissions = getAllSubmissions();
  submissions.push(submission);
  saveAllSubmissions(submissions);

  return participantCode;
}

// Obtener una submission por código de participante
export function getSubmission(participantCode: string): Submission | null {
  const submissions = getAllSubmissions();
  return (
    submissions.find((s) => s.participantCode === participantCode) || null
  );
}

// Datos mock para demostración
export function getMockSubmission(): Submission {
  return {
    groupCode: "DEMO-GROUP",
    participantCode: "MOCK1234",
    answers: [
      // Área 1
      4, 3, 2, 1,
      // Área 2
      3, 4, 3, 2,
      // Área 3
      2, 3, 4, 3,
      // Área 4
      1, 2, 3, 4,
      // Área 5
      4, 4, 3, 3,
      // Área 6
      2, 2, 3, 3,
    ] as AnswerValue[],
    timestamp: Date.now(),
  };
}

