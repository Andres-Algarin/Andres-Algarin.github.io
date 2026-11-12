declare module "virtual:local-projects" {
  const projects: import("./data/projects").Project[];
  export default projects;
}
