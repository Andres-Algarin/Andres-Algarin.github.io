// Add only your own work or work explicitly authorized for public sharing.
// Never add confidential descriptions, private repository URLs or third-party data.
export type Project = {
  title: string;
  description: string;
  technologies: string[];
  repositoryUrl?: `https://${string}`;
  demoUrl?: `https://${string}`;
};

export const projects: Project[] = [];
