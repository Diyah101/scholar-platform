import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_STUDENT_PATHS = [
  "/dashboard",
  "/reminders",
  "/saved",
  "/notifications",
  "/profile",
];

const PROTECTED_PARTNER_PATHS = ["/partner"];
const PROTECTED_ADMIN_PATHS = ["/admin"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = req.nextUrl;
  const path = url.pathname;

  const requiresStudent = PROTECTED_STUDENT_PATHS.some((p) =>
    path.startsWith(p)
  );
  const requiresPartner = PROTECTED_PARTNER_PATHS.some((p) =>
    path.startsWith(p)
  );
  const requiresAdmin = PROTECTED_ADMIN_PATHS.some((p) =>
    path.startsWith(p)
  );

  if (!requiresStudent && !requiresPartner && !requiresAdmin) {
    return res;
  }

  if (!user) {
    const redirectUrl = new URL("/login", req.nextUrl.origin);
    redirectUrl.searchParams.set("redirectTo", path);
    return NextResponse.redirect(redirectUrl);
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role as string | undefined;

  if (requiresAdmin && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  if (requiresPartner && role !== "partner") {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  if (requiresStudent && role !== "student") {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

