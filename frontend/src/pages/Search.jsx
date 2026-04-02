import React from 'react';
import Products from '../components/ProductsList';

const Search = () => {
    return (
        <div>
            <label>
                <input name = "query"
                       className="w-full mb-4 p-2 border rounded"
                       placeholder = "Enter your search"
                        />
            </label>
            <button className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded">
               Search
            </button>

            <Products></Products>
        </div>
    );
};

export default Search;