import { getSession } from "next-auth/react";

export default async function RequireAuthentication(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return cb({ session });
}
