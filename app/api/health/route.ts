import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "Placey (M.A.C.O.S.)",
  });
}
