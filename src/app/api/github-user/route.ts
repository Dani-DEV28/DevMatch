import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const githubId = req.nextUrl.searchParams.get("id");
  if (!githubId) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(`https://api.github.com/user/${githubId}`, {
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
