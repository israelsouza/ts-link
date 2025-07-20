import prisma from "../lib/prisma";

class ShortURLModel {
  static generateRandomCode(): string {
    let str: string = "";
    const temp = Array.from({ length: 5 });
    const range: number[][] = [
      [48, 57],
      [65, 90],
      [97, 122],
    ];
    let sorted;

    temp.map(() => {
      sorted = range[Math.floor(Math.random() * range.length)];
      str += String.fromCharCode(
        Math.floor(Math.random() * (sorted[1] - sorted[0] + 1) + sorted[0])
      );
    });

    return str;
  }

  static async createShortCode() {
    try {
      let link;
      let code;
      do {
        code = ShortURLModel.generateRandomCode();
        link = await prisma.link.findFirst({
          where: {
            short: code,
          },
          select: {
            short: true,
          },
        });
      } while (link);
      return code;
    } catch (error) {
      throw error;
    }
  }

  static async findURL(url: string) {
    return await prisma.link.findFirst({
      where: {
        original: url,
      },
      select: {
        short: true,
      },
    });
  }

  static async saveURLs(code: string, url: string): Promise<void> {
    try {
      await prisma.link.create({
        data: {
          original: url,
          short: code,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

export default ShortURLModel;
