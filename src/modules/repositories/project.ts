import { IProject } from "@src/types";
import Project from "@models/project";

class ProjectRepository {
  async createProject(projectDetails: IProject) {
    return await new Project(projectDetails).save();
  }

  async findProjectByTitle(title: string) {
    return await Project.findOne({ title: title });
  }
}

export default new ProjectRepository();
