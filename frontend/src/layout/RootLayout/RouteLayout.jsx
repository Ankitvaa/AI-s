import React from "react";
import "./rootLayout.scss";
import { Link, Outlet } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import {
  SignedIn,
  UserButton,
} from "@clerk/clerk-react";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'


const queryClient = new QueryClient()
const RouteLayout = () => {
  // Create a client
  const PUBLISHABLE_KEY =
    "pk_test_bGlrZWQtc3BhcnJvdy01NS5jbGVyay5hY2NvdW50cy5kZXYk";

  if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Clerk Publishable Key");
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>

        <div className="rootLayout">
          <header>
            <Link to="/" style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
              <img src="/logo.png" alt="Logo" className="logo" />
              <span>Ankit AI</span>
            </Link>
            <div className="user">
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <main>
            <Outlet />
          </main>
        </div>

      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default RouteLayout;
