
import { createTRPCRouter, protectedProcedure } from "@/trpc";
import { z } from "zod";
import { getFileById } from "@/lib/validator";

export const historyRouter = createTRPCRouter({
  downloadFile: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const file = await getFileById(input);
      return file;
    }),
}); 

