import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST(request) {
    

    try {

        const { userId, sessionClaims } = await auth()

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Please sign in to add a product' }, { status: 401 })
        }

        const isSeller = authSeller(sessionClaims)

        if (!isSeller){
            const debug = process.env.NODE_ENV === 'development'
                ? {
                    sessionClaimKeys: Object.keys(sessionClaims ?? {}),
                    publicMetadataType: typeof sessionClaims?.public_metadata,
                    role: typeof sessionClaims?.public_metadata?.role === 'string'
                        ? sessionClaims.public_metadata.role
                        : null
                }
                : undefined

            return NextResponse.json({
                success: false,
                message: 'Seller role not found in this Clerk session.',
                ...(debug && { debug })
            }, { status: 403 })
    
        }

        const formData = await request.formData()

        const name = formData.get('name');
        const description = formData.get('description');
        const category = formData.get('category');
        const price = formData.get('price');
        const offerPrice = formData.get('offerPrice');

        const files = formData.getAll('images');

        if (!files || files.length === 0 ){
            return NextResponse.json({success: false, message: 'No files uploaded'})
        }

        const result = await Promise.all (
            files.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)

                return new Promise((resolve, reject)=>{
                    const stream = cloudinary.uploader.upload_stream(
                        {resource_type: 'auto'},
                        (error, result) => {
                            if (error){
                                reject(error)
                            }
                            else{
                                resolve(result)
                            }
                        }
                    )
                    stream.end(buffer)
                })
            })
        )

        const image = result.map(result => result.secure_url)

        await connectDB()
        const newProduct = await Product.create({
            userId,
            name,
            description,
            category,
            price: Number(price),
            offerPrice: Number(offerPrice),
            image,
            date: Date.now()
        })

        return NextResponse.json({success: true, message:'Upload Successful', newProduct})
        

    } catch (error) {
        if (error?.name === 'UnexpectedResponse' && error?.http_code === 403) {
            try {
                await cloudinary.api.ping()
                const debug = process.env.NODE_ENV === 'development'
                    ? { cloudinaryApiPing: 'passed' }
                    : undefined

                return NextResponse.json({
                    success: false,
                    message: 'Cloudinary accepted the API credentials but denied the upload. Check upload permissions and account restrictions.',
                    ...(debug && { debug })
                }, { status: 500 })
            } catch (pingError) {
                const debug = process.env.NODE_ENV === 'development'
                    ? {
                        cloudinaryApiPing: 'failed',
                        pingStatus: pingError?.http_code ?? null
                    }
                    : undefined

                return NextResponse.json({
                    success: false,
                    message: 'Cloudinary denied the upload and its API check also failed. Verify the API key access and account environment.',
                    ...(debug && { debug })
                }, { status: 500 })
            }
        }

        const message = error instanceof Error ? error.message : 'Unable to add product'

        return NextResponse.json({ success: false, message }, { status: 500 })

    }
}
