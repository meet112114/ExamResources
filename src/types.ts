export interface Subject {
    name: string;
    files: string[];
}

export interface Manifest {
    generatedAt: string;
    subjects: Subject[];
}
