import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * User schema for validation
 */
const userDataSchema = z.object({
  telegramId: z.number(),
  firstName: z.string(),
  lastName: z.string().optional(),
  username: z.string().optional(),
});

/**
 * GET handler for user info
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  // Validate the ID parameter
  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      { error: "Invalid user ID", code: "INVALID_PARAM" },
      { status: 400 }
    );
  }

  try {
    // Here you would fetch user data from your database
    // This is a mock response
    const userData = {
      telegramId: Number(id),
      firstName: "Sample",
      lastName: "User",
      username: "sample_user",
      score: 100,
    };

    // Return the user data
    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data", code: "FETCH_ERROR" },
      { status: 500 }
    );
  }
}

/**
 * POST handler for updating user info
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body
    const result = userDataSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid user data",
          code: "VALIDATION_ERROR",
          details: result.error.format(),
        },
        { status: 400 }
      );
    }

    // Here you would save user data to your database
    // This is a mock response

    // Return success response
    return NextResponse.json({
      success: true,
      message: "User data updated",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user data", code: "UPDATE_ERROR" },
      { status: 500 }
    );
  }
}
