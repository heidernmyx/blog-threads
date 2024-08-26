import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { comparePassword } from '@/actions/hashpw';
import { string } from "zod";
import { NextResponse } from "next/server";

// Your own logic for dealing with plaintext password strings; be careful!
// import { saltAndHashPassword } from "@/utils/password";

export const authOptions: NextAuthOptions = ({
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60 // 1 hour
  },
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {

        const formData = new FormData();

        const username = credentials?.username;
        const password = credentials?.password;
        const data = { username, password };

        formData.append('json', JSON.stringify(data));
        const url = `${process.env.NEXT_PUBLIC_URL}php/login.php`;
        const response = await axios({
          url: url,
          method: 'POST',
          data: formData
        })

        console.log(response.data);
        const { account_id, username: uname, email } = response.data;
        const condition = await comparePassword(password!, response.data.password);
        if (condition) {

          const user = { id: account_id, username: uname, email: email }
          return user;
        }
        else {
          // return NextResponse.json;
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user information to the token
      console.log(token);
      console.log(user);
      if (user) {
        token.id = Number(user.id);
        token.username = user.username;
        token.email = user.email;
        console.log(token.id)
      return token;
      } else {
        // console.log(false);
      }
      return token;
    },
    async session({ session, token }) {
      // This block runs when session data is being prepared
      if (token.id) {
        session.user.id = token.id;  // Include user ID in the session object
      }
      if (token.username) {
        session.user.username = token.username;  // Include username in the session object
      }
      session.user.email = token.email ?? ""; 
      console.log(session);
      return session;  // Return the modified session object
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: null // If set, new users will be directed here on first sign in
  }
});

const handler = NextAuth(authOptions);

export { handler };












