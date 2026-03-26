import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

const EXTERNAL_API_URL = 'https://fakestoreapi.com/products';

export async function GET() {
    try {
        await dbConnect();
        
        // Check if DB is already heavily seeded to prevent unnecessary writes
        const count = await Product.countDocuments();
        
        // If empty, auto-seed using external API
        if (count < 5) {
            console.log('Local DB empty. Seeding from external FakeStore API...');
            const response = await fetch(EXTERNAL_API_URL, {
                next: { revalidate: 3600 }
            });
            
            if (response.ok) {
                const externalProducts = await response.json();
                
                // Build valid Mongo documents and safely insert them
                const productsToInsert = externalProducts.map((p: any) => ({
                    name: p.title,
                    price: p.price,
                    image: p.image,
                    description: p.description,
                    category: p.category,
                    stock: 50 // dummy stock
                }));
                
                try {
                    await Product.insertMany(productsToInsert);
                    console.log('Seeding successful!');
                } catch (seedErr) {
                    console.error('Error during automatic seed:', seedErr);
                }
            }
        }

        // Always fetch from Local Database to guarantee all products have genuine Mongoose ObjectIds
        const products = await Product.find({});
        return NextResponse.json(products || []);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json([], { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { name, description, price, image, category, stock } = await request.json();

        await dbConnect();

        const product = await Product.create({
            name,
            description,
            price,
            image,
            category,
            stock,
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}