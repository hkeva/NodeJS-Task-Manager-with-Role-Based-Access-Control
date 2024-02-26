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
}

export default new ProjectService();
