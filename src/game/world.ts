// World definition for the multi-room ADS faculty.
// All coordinates are NORMALIZED (0..1) over the world-map.png image (1920x1080).
// The map is a 3x2 grid of rooms separated by stone-brick walls with door openings.

export type Room = {
  id: string;
  name: string;
  // floor rectangle (walkable area inside the room)
  x1: number; y1: number; x2: number; y2: number;
};

// Approx room interiors (where the floor is walkable). Doors connect them.
export const ROOMS: Room[] = [
  // TOP ROW (y ≈ 0.04 .. 0.42)
  { id: "lab1",       name: "LABORATÓRIO 1",       x1: 0.025, y1: 0.06,  x2: 0.32, y2: 0.42 },
  { id: "classroom",  name: "SALA DE AULA",        x1: 0.355, y1: 0.06, x2: 0.645, y2: 0.42 },
  { id: "lab2",       name: "LABORATÓRIO 2",       x1: 0.68,  y1: 0.06, x2: 0.975, y2: 0.42 },
  // BOTTOM ROW (y ≈ 0.46 .. 0.96)
  { id: "teachers",   name: "SALA DOS PROFESSORES", x1: 0.025, y1: 0.46, x2: 0.32, y2: 0.96 },
  { id: "hall",       name: "CORREDOR",            x1: 0.355, y1: 0.46, x2: 0.645, y2: 0.96 },
  { id: "lava",       name: "SALA DA LAVA",        x1: 0.68,  y1: 0.46, x2: 0.975, y2: 0.96 },
];

// Door corridors — narrow walkable strips between rooms.
// Each is a rectangle that punches through the wall.
export const DOORS: { x1: number; y1: number; x2: number; y2: number }[] = [
  // Vertical doors between top rooms
  { x1: 0.32,  y1: 0.22, x2: 0.355, y2: 0.30 }, // lab1 <-> classroom
  { x1: 0.645, y1: 0.22, x2: 0.68,  y2: 0.30 }, // classroom <-> lab2
  // Vertical doors between bottom rooms
  { x1: 0.32,  y1: 0.66, x2: 0.355, y2: 0.74 }, // teachers <-> hall
  { x1: 0.645, y1: 0.66, x2: 0.68,  y2: 0.74 }, // hall <-> lava
  // Horizontal doors between top and bottom rows
  { x1: 0.13, y1: 0.42, x2: 0.21, y2: 0.46 },   // lab1 <-> teachers
  { x1: 0.46, y1: 0.42, x2: 0.54, y2: 0.46 },   // classroom <-> hall
  { x1: 0.78, y1: 0.42, x2: 0.86, y2: 0.46 },   // lab2 <-> lava
];

export function isWalkable(x: number, y: number): boolean {
  for (const r of ROOMS) {
    if (x >= r.x1 && x <= r.x2 && y >= r.y1 && y <= r.y2) return true;
  }
  for (const d of DOORS) {
    if (x >= d.x1 && x <= d.x2 && y >= d.y1 && y <= d.y2) return true;
  }
  return false;
}

export function currentRoom(x: number, y: number): Room | null {
  for (const r of ROOMS) {
    if (x >= r.x1 && x <= r.x2 && y >= r.y1 && y <= r.y2) return r;
  }
  return null;
}

// ───────────────────── INTERACTIVE OBJECTS ─────────────────────
export type Computer = { id: number; x: number; y: number; room: string };

// 8 computers spread across LAB 1 and LAB 2 (the question stations).
export const COMPUTERS: Computer[] = [
  // Lab 1 — 4 desks (top row of monitors)
  { id: 0, x: 0.075, y: 0.18, room: "lab1" },
  { id: 1, x: 0.165, y: 0.18, room: "lab1" },
  { id: 2, x: 0.075, y: 0.30, room: "lab1" },
  { id: 3, x: 0.165, y: 0.30, room: "lab1" },
  // Lab 2 — 4 modern stations
  { id: 4, x: 0.74, y: 0.16, room: "lab2" },
  { id: 5, x: 0.84, y: 0.16, room: "lab2" },
  { id: 6, x: 0.74, y: 0.32, room: "lab2" },
  { id: 7, x: 0.84, y: 0.32, room: "lab2" },
];

// ───────────────────── NPCs ─────────────────────
export type NPC = {
  id: string;
  name: string;
  role: string;          // shown in dialog header
  x: number; y: number;  // world position
  room: string;
  color: string;         // hue for sprite tint marker
  lines: string[];       // hint dialog (rotates each interaction)
};

export const NPCS: NPC[] = [
  {
    id: "monitor",
    name: "ANA",
    role: "MONITORA DE CÁLCULO",
    x: 0.27, y: 0.20, room: "lab1",
    color: "hsl(280 80% 65%)",
    lines: [
      "DICA: log_b(a) = x significa b^x = a. Pense: \"a que potência elevamos b para chegar em a?\".",
      "EXEMPLO: log_2(8) = 3 porque 2 × 2 × 2 = 8.",
      "Quando a base não aparece, é base 10 (log decimal).",
    ],
  },
  {
    id: "alex",
    name: "ALEX",
    role: "ALUNO ADS · 3º SEMESTRE",
    x: 0.20, y: 0.36, room: "lab1",
    color: "hsl(200 80% 60%)",
    lines: [
      "Decora as potências de 2: 2,4,8,16,32,64,128,256... ajuda MUITO nas exponenciais!",
      "Se 2^x = 32, conte: 2,4,8,16,32 → 5 multiplicações = x vale 5.",
    ],
  },
  {
    id: "bia",
    name: "BIA",
    role: "MONITORA DE MATEMÁTICA",
    x: 0.50, y: 0.20, room: "classroom",
    color: "hsl(330 80% 65%)",
    lines: [
      "Na sala de aula: log_a(a^n) = n. É a propriedade mais útil de todas.",
      "Lembre: log(1) = 0 SEMPRE, em qualquer base. Porque b^0 = 1.",
      "log_b(b) = 1 sempre. Porque b^1 = b.",
    ],
  },
  {
    id: "carlos",
    name: "PROF. CARLOS",
    role: "DOCENTE · CÁLCULO I",
    x: 0.50, y: 0.36, room: "classroom",
    color: "hsl(45 90% 60%)",
    lines: [
      "Eu treinei o José Vitor. Salvem ele!",
      "Para resolver b^x = N: escreva N como potência de b. Ex.: 3^x = 81 → 81 = 3^4 → x=4.",
      "Logaritmo é só a OPERAÇÃO INVERSA da exponencial. Não complica!",
    ],
  },
  {
    id: "dani",
    name: "DANI",
    role: "ENG. DE SOFTWARE",
    x: 0.85, y: 0.20, room: "lab2",
    color: "hsl(160 70% 55%)",
    lines: [
      "Na computação, log_2(n) é a complexidade de busca binária. Útil saber!",
      "5^x = 625? Faça 5×5=25, 25×5=125, 125×5=625. São 4 vezes → x = 4.",
    ],
  },
  {
    id: "rita",
    name: "RITA",
    role: "COORDENADORA DE ADS",
    x: 0.20, y: 0.78, room: "teachers",
    color: "hsl(20 90% 60%)",
    lines: [
      "Bem-vindo(a) à sala dos professores. Tome um café e bons estudos!",
      "Lembre: 10^x = 10000 → conte os zeros! 10000 tem 4 zeros → x = 4.",
    ],
  },
  {
    id: "miguel",
    name: "MIGUEL",
    role: "ALUNO · GAME DEV",
    x: 0.50, y: 0.78, room: "hall",
    color: "hsl(0 85% 60%)",
    lines: [
      "Você tem 1 MINUTO por questão! Não trave. Se errar todas as 8, o professor cai!",
      "Pressione [E] ou o botão A para conversar e interagir.",
    ],
  },
  {
    id: "leo",
    name: "LÉO",
    role: "ALUNO · FULL STACK",
    x: 0.83, y: 0.78, room: "lava",
    color: "hsl(260 85% 65%)",
    lines: [
      "O chão aqui queima! Pisar na lava tira tudo — mantenha-se no piso de pedra.",
      "Se b^x = 1, então x = 0. Sempre. Base neutra é 1.",
    ],
  },
  {
    id: "sofia",
    name: "SOFIA",
    role: "ALUNA · UI/UX",
    x: 0.40, y: 0.78, room: "hall",
    color: "hsl(190 85% 60%)",
    lines: [
      "Abra as portas andando em cima delas — o corredor conecta TUDO.",
      "Use o menu ⚙ para ativar controles na tela ou dar zoom no cenário.",
    ],
  },
  {
    id: "tiago",
    name: "TIAGO",
    role: "MONITOR · DEVOPS",
    x: 0.62, y: 0.20, room: "classroom",
    color: "hsl(140 70% 55%)",
    lines: [
      "log_b(x*y) = log_b(x) + log_b(y). Produto vira soma!",
      "log_b(x/y) = log_b(x) - log_b(y). Divisão vira subtração!",
    ],
  },
];

// Professor in the cage over the lava — interactive, but does not progress the game.
export const PROFESSOR = {
  name: "PROF. JOSE VITOR",
  role: "REFÉM · DOCENTE DE CÁLCULO",
  x: 0.83, y: 0.66, // center of lava room (above the cage area)
  // dialog rotates depending on remaining questions
  lines: [
    "ME TIREM DAQUI! RESPONDAM OS COMPUTADORES NOS LABORATÓRIOS!",
    "Cada acerto reforça as correntes. Cada erro afrouxa um elo!",
    "Você consegue! Confie na matemática!",
  ],
};

// Approx camera-friendly interaction radius (world units)
export const INTERACT_RADIUS = 0.045;
