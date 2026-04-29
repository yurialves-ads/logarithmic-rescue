export type Question = {
  id: number;
  category: "exponencial" | "logaritmica";
  prompt: string;
  equation: string; // displayed in monospaced/pixel
  options: string[]; // 4 options
  correct: number; // index 0..3
};

export const QUESTIONS: Question[] = [
  // --- Logarítmicas ---
  {
    id: 1,
    category: "logaritmica",
    prompt: 'QUAL É O VALOR DE "X" NA EQUAÇÃO LOGARÍTMICA',
    equation: "log₂ (16) = x",
    options: ["A) 2", "B) 4", "C) 8", "D) 16"],
    correct: 1,
  },
  {
    id: 2,
    category: "logaritmica",
    prompt: 'RESOLVA O LOGARITMO ABAIXO',
    equation: "log₃(81) = x",
    options: ["A) 2", "B) 3", "C) 4", "D) 5"],
    correct: 2,
  },
  {
    id: 3,
    category: "logaritmica",
    prompt: 'CALCULE O VALOR DE X',
    equation: "log₅(125) = x",
    options: ["A) 2", "B) 3", "C) 4", "D) 25"],
    correct: 1,
  },
  {
    id: 4,
    category: "logaritmica",
    prompt: 'QUAL O VALOR DE X?',
    equation: "log₁₀(1000) = x",
    options: ["A) 2", "B) 3", "C) 10", "D) 100"],
    correct: 1,
  },
  // --- Exponenciais ---
  {
    id: 5,
    category: "exponencial",
    prompt: 'QUAL É O VALOR DE "X" NA EQUAÇÃO EXPONENCIAL',
    equation: "2^x = 32",
    options: ["A) 4", "B) 5", "C) 6", "D) 16"],
    correct: 1,
  },
  {
    id: 6,
    category: "exponencial",
    prompt: 'RESOLVA A EQUAÇÃO EXPONENCIAL',
    equation: "3^x = 27",
    options: ["A) 2", "B) 3", "C) 4", "D) 9"],
    correct: 1,
  },
  {
    id: 7,
    category: "exponencial",
    prompt: 'CALCULE O VALOR DE X',
    equation: "5^x = 625",
    options: ["A) 2", "B) 3", "C) 4", "D) 5"],
    correct: 2,
  },
  {
    id: 8,
    category: "exponencial",
    prompt: 'QUAL O VALOR DE X?',
    equation: "10^x = 10000",
    options: ["A) 2", "B) 3", "C) 4", "D) 5"],
    correct: 2,
  },
];

export function shuffleQuestions(): Question[] {
  // Mantém ordem fixa para fidelidade educacional, mas embaralha sutilmente.
  const arr = [...QUESTIONS];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
