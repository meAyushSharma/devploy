const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const Container = prisma.container;
module.exports = Container;