const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const Environment = prisma.environment;
module.exports = Environment;