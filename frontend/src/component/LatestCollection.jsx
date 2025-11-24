import React, { useState, useEffect, useContext } from 'react'
import Title from '../component/Title';
import { ShopDataContext } from '../context/ShopContext';
import Card from '../component/Card'

function LatestCollection() {
  const { products, loading } = useContext(ShopDataContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    console.log('📊 Products in LatestCollection:', products);
    console.log('📊 Products length:', products?.length);
    
    if (products && products.length > 0) {
      setLatestProducts(products.slice(0, 8));
    }
  }, [products]);

  return (
    <div className='py-10'>
      <div className='text-center'>
         <Title text1={"LATEST"} text2={"COLLECTIONS"}/>
         <p className='w-full mx-auto text-sm md:text-lg px-4 text-gray-600 mt-3'>
            Step Into Style - New Collection Dropping This Season!
         </p>
      </div>
      
      <div className='w-[100%] h-[50%] mt-[30px] flex items-center justify-center flex-wrap gap-[50px] '>
        {
          latestProducts.map((item,index)=>(
            <Card key={index} name={item.name} image={item.image1} id={item._id} price={item.price}/>
          ))
        }
      </div>
    </div>
  )
}

export default LatestCollection