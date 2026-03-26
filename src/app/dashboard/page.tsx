'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Product {
    _id: string;
    name: string;
    price: number;
    description?: string;
}

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [form, setForm] = useState({ name: '', price: '', description: '' });

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.role !== 'admin') {
            router.push('/');
        }
    }, [status, session, router]);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts(data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
        });
        if (res.ok) {
            toast.success('Product added');
            setForm({ name: '', price: '', description: '' });
            // Refresh products
            fetch('/api/products')
                .then(res => res.json())
                .then(data => setProducts(data));
        } else {
            toast.error('Failed to add product');
        }
    };

    if (status === 'loading') return <div>Loading...</div>;

    if (!session || session.user?.role !== 'admin') return null;

    return (
        <div className="max-w-4xl mx-auto mt-8 px-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Add Product</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full p-2 border rounded"
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Add Product
                    </button>
                </form>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-4">Products</h2>
                <div className="space-y-2">
                    {products.map((product) => (
                        <div key={product._id} className="border p-4 rounded">
                            <h3 className="font-semibold">{product.name}</h3>
                            <p>${product.price}</p>
                            <p>{product.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}