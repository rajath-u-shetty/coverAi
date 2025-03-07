import Link from "next/link"
import UserAuthForm from "./UserAuthForm"
import { Icons } from "./Icons"

const SignIn = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.google className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm max-w-xs mx-auto">By continuing, you are setting up a Cover.Ai accoutn and agree to our User agreement and Privacy Policy.</p>

        {/* sign in form */}
        <UserAuthForm />

        <p className="px-8 dark:text-gray-400 text-center text-sm text-zinc-700">
            New to Cover.Ai?{" "}
            <Link href="/sign-up" className="hover:text-zinc-800 text-sm underline underline-offset-4">Sign Up</Link>
        </p>
      </div>
    </div>
  )
}

export default SignIn
