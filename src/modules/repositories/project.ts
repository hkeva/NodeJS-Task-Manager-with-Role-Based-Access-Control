import { IProject } from "@src/types";
import Project from "@models/project";

class ProjectRepository {
  async createProject(projectDetails: IProject) {
    return await new Project(projectDetails).save();
  }

  async findProjectByTitle(title: string, projectID?: string) {
    return await Project.findOne({
      title: title,
      _id: { $ne: projectID },
    });
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

  async upsertProjectData(data: any) {
    return await Project.findOneAndUpdate({ _id: data.projectID }, data, {
      upsert: true,
      new: true,
    });
  }
}

export default new ProjectRepository();
