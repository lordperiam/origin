import { Metadata } from "next";

declare module "next" {
  // Override the PageProps interface to make it compatible with our usage
  export interface PageProps {
    params?: any;
    searchParams?: any;
  }
}

// Export PageProps type for convenience
export type PageProps = {
  params: { [key: string]: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};