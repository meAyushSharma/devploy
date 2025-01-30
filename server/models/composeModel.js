const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const Compose = prisma.compose;
module.exports = Compose;