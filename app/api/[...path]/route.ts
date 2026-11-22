import { handleApi } from "@/services/api";
export const dynamic = "force-dynamic";
export const GET = (request: Request) =>
	handleApi(request, process.env as Parameters<typeof handleApi>[1]);
export const POST = GET;
