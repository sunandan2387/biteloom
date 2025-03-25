import { useEffect } from "react";
import { useAuth } from "@/context/SessionProvider";
import { useRouter } from "next/router";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push("/auth/login");
      }
    }, [loading, user, router]);

    if (loading) {
      return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return user ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;
