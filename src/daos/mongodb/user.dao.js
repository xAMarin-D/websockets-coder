import { UserModel } from "./models/user.model.js";
import bcrypt from "bcrypt";

export default class UserDao {
  constructor() {
    this.model = UserModel;
  }

  async register(user) {
    try {
      const { email, password } = user;
      const existUser = await this.getByEmail(email);
      if (!existUser) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return await this.model.create({ ...user, password: hashedPassword });
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async login(email, password) {
    try {
      const user = await this.model.findOne({ email });
      if (user && (await bcrypt.compare(password, user.password))) {
        return user;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async getByEmail(email) {
    return await this.model.findOne({ email });
  }

  async getById(id) {
    return await this.model.findById(id);
  }

  async getByGitHubId(githubId) {
    return await this.model.findOne({ githubId });
  }

  async validatePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
