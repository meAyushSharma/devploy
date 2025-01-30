const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const User = prisma.user;
module.exports = User;