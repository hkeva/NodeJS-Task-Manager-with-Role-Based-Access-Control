import { FileConstants, userRoles } from "@src/constants/constants";
import ProjectRepository from "@repositories/project";
import { IProject, IUser } from "@src/types";
import { BadRequestError } from "@src/responses/errorHandler";
import { errorMessage } from "@src/constants/messages/errorMessages";
import path from "path";
import fs from "fs";

export class ProjectService {
  async createProject(reqUser: IUser, data: IProject, files: any) {
    const projectFiles: any[] = [];

    if (reqUser.role === userRoles.DEVELOPER)
      throw new BadRequestError(errorMessage.notAuthorizedToCreateProject);

    const doesExist = await ProjectRepository.findProjectByTitle(data.title);

    if (doesExist) throw new BadRequestError(errorMessage.projectAlreadyExist);

    files.forEach((file: any) => {
      projectFiles.push(FileConstants.FILE_PATH + file.filename);
    });

    const projectDetails = {
      title: data.title,
      description: data.description,
      files: projectFiles,
      createdBy: { userId: reqUser._id },
    };

    return await ProjectRepository.createProject(projectDetails);
  }

  async assignToProject(
    reqUser: IUser,
    data: { projectID: string; userIDs: string[] }
  ) {
    const project = await ProjectRepository.findProjectByID(data.projectID);

    if (!project) throw new BadRequestError(errorMessage.noProjectFound);

    //Project creator himself or Admin can assign to project
    if (
      project.createdBy.userId !== reqUser._id ||
      reqUser.role !== userRoles.ADMIN
    )
      throw new BadRequestError(errorMessage.notAuthorizedToAssignToProject);

    const uniqueArray = Array.from(new Set(data.userIDs));

    return await ProjectRepository.updateAssignedField(
      data.projectID,
      uniqueArray
    );
  }

  async updateProject(reqUser: IUser, data: any, files: any) {
    const projectFiles: any[] = [];
    const project = await ProjectRepository.findProjectByID(data.projectID);

    //Project creator himself or Admin can update the project
    if (
      project.createdBy.userId !== reqUser._id ||
      reqUser.role !== userRoles.ADMIN
    )
      throw new BadRequestError(errorMessage.notAuthorizedToUpdateProject);

    if (!project) throw new BadRequestError(errorMessage.noProjectFound);

    if (Object.keys(data).length === 1) return {};

    if (data.title) {
      const doesTitleExist = await ProjectRepository.findProjectByTitle(
        data.title,
        data.projectID
      );

      if (doesTitleExist)
        throw new BadRequestError(errorMessage.projectTitleExists);
    }

    const upsertData = data;

    if (files.length > 0) {
      files.forEach((file: any) => {
        projectFiles.push(FileConstants.FILE_PATH + file.filename);
      });
      upsertData.files = projectFiles;
    }

    const result = await ProjectRepository.upsertProjectData(upsertData);

    //Delete existing non required files
    const existingFiles = project.files;
    if (
      result &&
      files.length > 0 &&
      existingFiles.length > 0 &&
      existingFiles[0].trim()
    ) {
      existingFiles.map((existingFile: string) => {
        const fileName = existingFile.match(/\/([^\/?#]+)$/)[1];

        fs.unlink(path.join(__dirname, "../../../uploads", fileName), (err) => {
          if (err) {
            console.error("Error deleting file:", err);
            return;
          }
          console.log("File deleted successfully");
        });
      });
    }

    return result;
  }
}

export default new ProjectService();
