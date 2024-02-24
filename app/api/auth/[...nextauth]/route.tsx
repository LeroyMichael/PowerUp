import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
const { GOOGLE_ID = "", GOOGLE_SECRET = "" } = process.env;
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials as any;

        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const user = await res.json();
        if (user.error) {
          return null;
        }
        console.log("result ", user);

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    jwt({ token, account, user }) {
      // console.log(
      //   "nextauth token:" +
      //     JSON.stringify(token) +
      //     ", account:" +
      //     JSON.stringify(account) +
      //     ", user:" +
      //     JSON.stringify(user)
      // );
      return { ...token, ...user };
    },
    session({ session, token }) {
      session.user.id = token.user_id;
      session.user.merchant_id = token.merchant_id;
      session.user.first_name = token.first_name;
      session.user.last_name = token.last_name;

      // console.log(
      //   "nextauth token:" +
      //     JSON.stringify(token) +
      //     ", session:" +
      //     JSON.stringify(session)
      // );
      return { ...session, ...token };
    },
  },
});

export { handler as GET, handler as POST };
