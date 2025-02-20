import prisma from "./prisma";

export const handleHealthLog = async (userId: string, data: object) => {
  const success = await prisma.dailyHealthLog.create({
    data: {
      User: { connect: { id: userId } },
      ...data,
    },
  });
  return success;
};
