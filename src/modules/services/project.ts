import { FileConstants, userRoles } from "@src/constants/constants";
import ProjectRepository from "@repositories/project";
import { IProject, IUser } from "@src/types";
import { BadRequestError } from "@src/responses/errorHandler";
import { errorMessage } from "@src/constants/messages/errorMessages";

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
      reqUser.role === userRoles.ADMIN
    )
      throw new BadRequestError(errorMessage.notAuthorizedToAssignToProject);

    const uniqueArray = Array.from(new Set(data.userIDs));

    return await ProjectRepository.updateAssignedField(
      data.projectID,
      uniqueArray
    );
  }
}

export default new ProjectService();
