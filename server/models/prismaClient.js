const { PrismaClient } = require("@prisma/client");
let prisma;
if (!global.prisma) {
    global.prisma = new PrismaClient();
}
prisma = global.prisma;

module.exports = {
    prisma,
    MetaData: prisma.metaData,
    User: prisma.user,
    Container: prisma.Container,
    Image: prisma.Image,
    Compose: prisma.Compose,
    Environment: prisma.Environment,
};