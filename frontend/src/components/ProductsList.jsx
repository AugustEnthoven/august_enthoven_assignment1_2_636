import React from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from '../context/AuthContext';


const products = [
    {
        id:  0,
        name:  "Playing cards",
        price: 3.99,
        url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.7ddQl6c816T3JgbTyXB4UQHaFw%3Fpid%3DApi&f=1&ipt=bbcf737b3e357cd72b79c3c50bebc88f7d274b2bb145d05d6c089525bfe1d220&ipo=images",
    },
    {
        id:  1,
        name:  "Plushie animal",
        price: 12.99,
        url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.ncuMFNI_dkWDwKer9nCC6wHaHa%3Fpid%3DApi&f=1&ipt=d73a014fdf28b71905ca4510945a7faaebd2895a2c4c1437b81e2ea9e6e740a2&ipo=images",
    },
    {
        id:  2,
        name:  "Coloured Pencils",
        price: 4.99,
        url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fassets.stickpng.com%2Fimages%2F580b585b2edbce24c47b28dd.png&f=1&nofb=1&ipt=f0cb5907ac2c17b94747bde2ae2e866824d761f4f49aa6bda228a6af1f7c12dd",
    },
    {
        id:  3,
        name:  "Basketball",
        price: 16.99,
        url: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fpluspng.com%2Fimg-png%2Fbasketball-hd-png-basketball-png-hd-png-image-1245.png&f=1&nofb=1&ipt=2d3e217ab229171136a61ff156d47e15bcd93ebdb1c82ba61025b7a1afc3803d",
    },
];


export default function Products() {
    const { user } = useAuth();

    const handleClick = async (product) =>
    {
        axiosInstance.post('/api/tasks', product, {
            headers: {Authorization: `Bearer ${user.token}`},
        });
    }

    const products_list = products.map(product =>
        <div className="bg-gray-100 p-4 mb-4 rounded shadow">
            <li>
                <h1 className="text-xl font-bold">
                    {product.name}
                </h1>
                <label>${product.price}</label>
            </li>
            <img
                src = {product.url}
                alt = {"Product on the toy store"}
                width={250}
                height={250}
                style = {{borderRadius: 40}}
                />
            <button onClick={() => handleClick(product)} className="mr-2 bg-emerald-600 text-white px-4 py-2 rounded">
                + Add to cart
            </button>
        </div>
    )


    return <ul>{products_list}</ul>;
}