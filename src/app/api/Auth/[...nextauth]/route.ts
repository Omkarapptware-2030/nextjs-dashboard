import NextAuth from "next-auth";
import { AuthOptions } from "@/app/api/Auth/[...nextauth]/options";

const handler = NextAuth(AuthOptions);

export { handler as GET, handler as POST };
