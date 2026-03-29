import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const githubId = req.nextUrl.searchParams.get("id");
  const username = req.nextUrl.searchParams.get("username");
  
  if (!githubId && !username) {
    return NextResponse.json({ error: "id or username is required" }, { status: 400 });
  }

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  // Use username if provided, otherwise use ID
  const url = username 
    ? `https://api.github.com/users/${username}`
    : `https://api.github.com/user/${githubId}`;

  const res = await fetch(url, {
    headers,
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch GitHub user" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
