import { db } from "@/lib/db";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import {z} from "zod"

export const appRouter = router({
    getFile: privateProcedure.input(z.object({ key: z.string() })).mutation(async({ctx, input}) => {
        const { userId } = ctx;
      
        const file = await db.file.findFirst({
          where: {
            key: input.key,
            userId
          }
        })
      
        if(!file) throw new TRPCError({code: "NOT_FOUND"})
      
          return file;
    })
})

export type AppRouter = typeof appRouter;
