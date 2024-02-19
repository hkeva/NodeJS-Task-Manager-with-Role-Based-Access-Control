import User from "@models/user";
import { IUser } from "@src/types";

class UserRepository {
  async createUser(userDetails: IUser) {
    const user = await new User(userDetails).save();

    //remove the password field
    return user.toObject({
      getters: true,
      versionKey: false,
      transform: function (doc: any, ret: IUser) {
        delete ret.password;
        return ret;
      },
    });
  }

  async findByID(userID: string) {
    return await User.findById(userID);
  }

  async usernameExist(username: string) {
    return await User.findOne({ username: username });
  }

  async emailExist(email: string) {
    return await User.findOne({ email: email });
  }

  async changeRole(userID: string, newRole: string) {
    return await User.findOneAndUpdate(
      { _id: userID },
      { role: newRole },
      { new: true }
    );
  }
}

export default new UserRepository();
