import { NextAuthOptions, User, getServerSession } from "next-auth";
import { db } from "./db";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"

type UserId = string

declare module 'next-auth' {
    interface Session {
      user: User & {
        id: UserId
        username?: string | null
      }
    }
  }

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        // GitHubProvider({
        //     clientId: process.env.GITHUB_ID!,
        //     clientSecret: process.env.GITHUB_SECRET!,
        // })
    ],
    pages: {
        signIn: "/sign-in",
    },
    callbacks: {
        async session({ session, user}: any){
            if(session.user){
                session.user.id = user.id;
            }
            return session;
        },
        redirect(){
            return "/"
        }
    }
}

export const getAuthSession = () => getServerSession(authOptions);
