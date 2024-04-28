import { getAuthSession } from '@/lib/auth';
import { TRPCError, initTRPC } from '@trpc/server';
import { redirect } from 'next/navigation';

const t = initTRPC.create();
const middleware = t.middleware

const isAuth = middleware(async (opts) => {
    const session = await getAuthSession();
    const userId = session?.user.id
    const user = session?.user

    if (!userId) redirect('/sign-in')
    if (!user) redirect('/sign-in')

    if(!userId) {
        throw new TRPCError({code: 'UNAUTHORIZED'})
    }

    return opts.next({
        ctx: {
            userId: user.id,
            user
        }
    })
})

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);