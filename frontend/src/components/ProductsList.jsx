const products = [
    {
        id:  0,
        name:  "Playing cards",
        price: 3.99
    },
    {
        id:  1,
        name:  "Plushie animal",
        price: 12.99
    },
    {
        id:  2,
        name:  "Coloured Pencils",
        price: 4.99
    },
    {
        id:  3,
        name:  "Basketball",
        price: 16.99
    },
];

export default function Products() {
    const products_list = products.map(product =>
        <div className="bg-gray-100 p-4 mb-4 rounded shadow">
            <li>
                <h1 className="text-xl font-bold">
                    {product.name}
                </h1>
                <label>${product.price}</label>
            </li>
        </div>
    )

    return <ul>{products_list}</ul>;
}