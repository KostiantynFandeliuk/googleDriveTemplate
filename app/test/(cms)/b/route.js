//app/api/test/route.js

import chalk from "chalk";
import { NextResponse } from "next/server";

const { bgGreenBright } = chalk;

export async function POST(req, res) {
  if (req.method === "POST") {
    console.log("NextResponse :>> ", res);
    // Process a POST request
  } else {
    // Handle any other HTTP method
  }

  return NextResponse.json({ files: "Ok" });
}
