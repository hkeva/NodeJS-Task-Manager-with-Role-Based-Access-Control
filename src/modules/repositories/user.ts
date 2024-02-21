import User from "@models/user";
import { IUser } from "@src/types";
import EmailToken from "@models/emailToken";

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

  async createEmailVerificationToken(userId: string, token: string) {
    return await new EmailToken({
      userId: userId,
      token: token,
    }).save();
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

  async verifyUser(email: string) {
    return User.findOneAndUpdate(
      { email: email },
      { $set: { isVerified: true } },
      { new: true }
    );
  }

  async deleteEmailTokenByToken(token: string) {
    return await EmailToken.findOneAndDelete({
      token: token,
    });
  }

  async deleteEmailTokenById(id: string) {
    return await EmailToken.findByIdAndDelete(id);
  }

  async findEmailTokenById(userId: string) {
    return await EmailToken.findOne({
      userId: userId,
    });
  }

  async findEmailTokenByToken(token: string) {
    return await EmailToken.findOne({
      token: token,
    });
  }
}

export default new UserRepository();
