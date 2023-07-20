import CredentialsProvider from "next-auth/providers/credentials"
import {NextAuthOptions} from "next-auth";
import NextAuth from "next-auth";
import {getUser} from "@/services";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const {username, password} = credentials as any;
                const user = await getUser(username, password);
                if(user){
                    return user;
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: "/auth/login"
    },
    session: {
        jwt: true,
        maxAge: 60
    } as any,
    callbacks: {
        async session({session, token}: any) {
            session.user = token.user;
            return session;
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.user = user;
            }
            return token;
        }
    }
}

export default NextAuth(authOptions)