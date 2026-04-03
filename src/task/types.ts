export interface TaskMeta {
  id: string;
  name: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  language: string;
  timeoutSeconds: number;
  expectedTokenRange: [number, number];
  tags: string[];
}

export interface Task {
  id: string;
  meta: TaskMeta;
  promptPath: string;
  testPath: string;
  scaffoldPath: string;
  dir: string;
}
