import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_AOS_URL}/ws/rest/com.axelor.meta.db.MetaFile/${params.id}/content/download?image=true`,
      {
        responseType: "stream",
        auth: {
          username: process.env.BASIC_AUTH_USERNAME as string,
          password: process.env.BASIC_AUTH_PASSWORD as string,
        },
      }
    );

    return new NextResponse(res.data);
  } catch (err) {
    return new NextResponse();
  }
}
