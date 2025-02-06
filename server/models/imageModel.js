const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const Image = prisma.image;
module.exports = Image;