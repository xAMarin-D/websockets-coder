import bcrypt from "bcrypt";

export default class UserDao {
  constructor(model) {
    this.model = model;
  }

  async register(user) {
    try {
      const { email, password } = user;
      const existUser = await this.model.findOne({ email });
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
}
