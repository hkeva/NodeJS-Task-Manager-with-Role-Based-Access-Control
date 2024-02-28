import { IProject } from "@src/types";
import Project from "@models/project";

class ProjectRepository {
  async createProject(projectDetails: IProject) {
    return await new Project(projectDetails).save();
  }

  async findProjectByTitle(title: string) {
    return await Project.findOne({ title: title });
  }

  async findProjectByID(id: string) {
    return await Project.findById(id);
  }

  async updateAssignedField(projectID: string, assignedIds: string[]) {
    return await Project.findByIdAndUpdate(
      projectID,
      { assigned: assignedIds },
      { new: true }
    );
  }
}

export default new ProjectRepository();
