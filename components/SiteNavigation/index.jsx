import NavBar from "../NavBar";
import { useRouter } from "next/router";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useSession, signIn, signOut } from "next-auth/react";

export default function SiteNavigation() {
  const router = useRouter();
  const { data: session } = useSession();
  const navigation = [
    {
      name: "New",
      Icon: PlusCircleIcon,
      href: "/createPost",
      current: router.pathname === "/createPost",
    },
  ];

  const handleSearch = text => {
    router.push(`/search?q=${text}`);
  };

  return (
    <NavBar
      navigation={navigation}
      onSearch={handleSearch}
      user={session?.user}
      onSignIn={signIn}
      onSignOut={signOut}
    />
  );
}
