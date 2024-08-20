import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";

// Your own logic for dealing with plaintext password strings; be careful!
// import { saltAndHashPassword } from "@/utils/password";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        let user = null;

        // Logic to salt and hash password (if needed)
        // const pwHash = saltAndHashPassword(credentials.password);

        // Logic to verify if the user exists
        try {
          const formData = new FormData();
          const email = credentials?.email;
          const password = credentials?.password;

          const data = { email, password };
          formData.append('json', JSON.stringify(data));

          const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}php/login.php`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          if (response.data.success) {
            // If login is successful, return the user object
            user = { id: response.data.id, name: response.data.name, email: response.data.email };
          } else {
            // No user found, throw an error
            throw new Error("User not found.");
          }
        } catch (error) {
          console.error("Login error:", error);
          throw new Error("User not found.");
        }

        // Return user object with their profile data
        return user;
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: null // If set, new users will be directed here on first sign in
  }
});