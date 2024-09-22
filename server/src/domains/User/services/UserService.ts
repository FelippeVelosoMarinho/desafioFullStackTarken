import { hash } from "crypto";
import prisma from "../../../../.config/client";
import { User } from "@prisma/client";

class UserService {
  async create(data: User) {

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        password: hash("sha256", data.password).toString(),
      },
    });

    return user;
  }

  async findAll() {
    return await prisma.user.findMany();
  }

  async findOne(id: number) {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, data: User) {
    return await prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(id: number) {
    return await prisma.user.delete({
      where: {
        id,
      },
    });
  }
}

export default new UserService();
