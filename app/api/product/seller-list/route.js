import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId, sessionClaims } = await auth()

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Please sign in to view your products' }, { status: 401 })
        }

        const isSeller = authSeller(sessionClaims)

        if (!isSeller){
            return NextResponse.json({
                success: false,
                message: 'Seller role not found in this Clerk session. Check Clerk > Sessions > Customize session token, then sign out and back in.'
            }, { status: 403 })
        }

        await connectDB()

        const products = await Product.find({})
        return NextResponse.json({ success: true, products })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}