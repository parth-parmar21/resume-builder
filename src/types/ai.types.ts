export interface GenerateSummary{
    experienceLevel: string;
    skills: string[];
    jobTitle: string;
}

export interface GenerateSkills {
    experienceLevel: string;
    jobTitle: string;
}

export interface GenerateProjectDescription {
    projectTitle: string;
    techStack: string[];
}

export interface GenerateExperienceDescription {
    experienceLevel: string;
    yearsOfExperience: number;
    techStack: string[];
    jobRole: string;
}