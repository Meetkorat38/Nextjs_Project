import mongoDBConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User.model";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "username",
          type: "email",
          placeholder: "enter your email or username",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<any> {
        // ALL SIGN IN LOGIC

        try {
          await mongoDBConnect();

          // Get the user first
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user || !user?.isVerify) {
            throw new Error("User is not verified");
          }

          const comparePassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!comparePassword) {
            throw new Error("Password is incorrect ");
          }

          return user;
        } catch (error: any) {
          throw new Error(error.message || "Invalid credentials");
        }
      },
    }),
  ],

  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.SECRET_KEY,
  callbacks: {
    async jwt({ token, user }): Promise<any> {
      if (user) {
        (token._id = user._id?.toString()),
          (token.email = user.email),
          (token.username = user.username),
          (token.isAcceptingMessages = user.isAcceptingMessages),
          (token.isVerified = user.isVerified);
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user._id = token?._id),
          (session.user.isVerified = token?.isVerified),
          (session.user.isAcceptingMessages = token?.isAcceptingMessages);
        session.user.username = token?.username;
      }
      return session;
    },
  },
};
