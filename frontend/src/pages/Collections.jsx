import React, { use, useContext, useEffect, useState } from 'react'
import { FaAngleRight } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import Title from '../component/Title';
import { ShopDataContext } from '../context/ShopContext';
import Card from '../component/Card';

function Collections() {

  let [showFilter,setShowFilter] = useState(false);
  let {products,search,showSearch} = useContext(ShopDataContext);
  
  let[filterProduct,setFilterProduct] = useState([])
  let[category,setCategory] = useState([])
  let[subCategory,setsubCategory] = useState([])
  let [sortType,SetSortType] = useState("relavant");

  const toggleCategory = (e)=>{
    if(category.includes (e.target.value)){
      setCategory(prev=> prev.filter((item)=> item !== e.target.value))
    }
    else{
      setCategory (prev=> [...prev, e.target.value])
    }

          }
  const toggleSubCategory = (e)=>{
    if(subCategory.includes (e.target.value)){
      setsubCategory(prev=> prev.filter((item)=> item !== e.target.value))
    }
    else{
      setsubCategory (prev=> [...prev, e.target.value])
    }

  }

  const applyFilter = ()=>{
    let productCopy= products.slice();
    if(showSearch && search){productCopy= productCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))}
    if(category.length >0)
    {
      productCopy = productCopy.filter((item)=> category.includes (item.category)); 
    }
    if(subCategory.length >0)
    {
      productCopy = productCopy.filter((item)=> subCategory.includes (item.subCategory)); 
    }
    setFilterProduct(productCopy)
  }

  const sortProducts =()=>{
    let fbCopy = filterProduct.slice();

    switch (sortType){
      case 'low-high':
        setFilterProduct(fbCopy.sort((a,b)=>(a.price - b.price)))
        break;

        case 'high-low':
        setFilterProduct(fbCopy.sort((a,b)=>(b.price - a.price)))
        break;
        default:
          
          break;
    }
  }

   useEffect(()=>{
    sortProducts();
   },[sortType])

  useEffect(()=>{
 setFilterProduct(products)
  },[products])

  useEffect(()=>{
    applyFilter();
  },[category, subCategory,search ,showSearch])

  return (
    <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex items-start flex-col md:flex-row justify-start pt-[70px] overflow-x-hidden z-[2]
    pb-[110px]' >
      <div className={`md:w-[20vw] lg:w-[20vw] w-[100vw] md:min-h-[100vh] ${showFilter ? "h-[45vh]" : "h-[8vh]"} p-[20px] border-r-[1px] border-gray-400 text-[#aaf5fa] lf:fixed`}>
   <p className='text-[25px] font-semibold flex gap-[5px] items-center justify-start cursor-pointer' onClick={()=>setShowFilter (prev=>!prev)}>FILTERS
    { !showFilter && <FaAngleRight className='text-[18px] md:hidden ' />}
    { showFilter && <FaChevronDown className='text-[18px] md:hidden' />}
   </p>
     <div className={`border-[2px] border-[#dedcdc] pl-5 py-3 mt-6 rounded-md bg-slate-600 ${showFilter ? "" : "hidden"} md:block`}>
  <p className='text-[18px] text-[#f8fafa] '>CATEGORIES</p>
  <div className='w-[230px] h-[120px] flex items-start justify-center gap-[10px] flex-col'>
<p className='flex items-center justify-center gap-[10px] text-[16px] font-light'><input type="checkbox" value={'Men'} className='w-3 ' onChange={toggleCategory}/>Men </p>
<p className='flex items-center justify-center gap-[10px] text-[16px] font-light'><input type="checkbox" value={'Women'} className='w-3' onChange={toggleCategory}/>Women </p>
<p className='flex items-center justify-center gap-[10px] text-[16px] font-light'><input type="checkbox" value={'Kids'} className='w-3' onChange={toggleCategory}/>Kids </p>
  </div>
      </div>

      <div className={`border-[2px] border-[#dedcdc] pl-5 py-3 mt-6 rounded-md bg-slate-600 ${showFilter ? "" : "hidden"} md:block`}>
  <p className='text-[18px] text-[#f8fafa] '>SUB-CATEGORIES</p>
  <div className='w-[230px] h-[120px] flex items-start justify-center gap-[10px] flex-col'>
<p className='flex items-center justify-center gap-[10px] text-[16px] font-light'><input type="checkbox" value={'TopWear'} className='w-3'onChange={toggleSubCategory}/> TopWear</p>
<p className='flex items-center justify-center gap-[10px] text-[16px] font-light'><input type="checkbox" value={'BottomWear'} className='w-3'onChange={toggleSubCategory}/>BottomWear </p>
<p className='flex items-center justify-center gap-[10px] text-[16px] font-light'><input type="checkbox" value={'WinterWear'} className='w-3'onChange={toggleSubCategory}/>WinterWear</p>
  </div>
      </div>
    </div>
    <div className='w-full min-h-screen p-[20px] lg:px-[50px] lg:py-[40px]'>
      <div className=' flex justify-between items-start lg:items-center flex-col lg:flex-row'>
        <Title text1={"ALL"} text2={"COLLECTIONS"} />
        <select name="" id="" className='bg-slate-600 w-full lg:w-[200px] h-[50px] px-[10px] text-white rounded-lg hover:border-[#46d1f7] border-[2px] border-slate-600 mt-[20px] lg:mt-0'onChange={(e)=>SetSortType(e.target.value)}>
         <option value="relavant" className='w-[100%] h-[100%] '> Sort By: Relavant</option>
         <option value="low-high" className='w-[100%] h-[100%] '> Sort By: Low to High</option>
         <option value="high-low" className='w-[100%] h-[100%] '>Sort By: High to Low </option>
        </select>
         </div>
         <div className='w-full min-h-[70vh] flex flex-wrap gap-[30px] p-5'>
          {
           filterProduct.map((item,index)=>(
            <Card key ={index} id={item._id} name={item.name} price={item.price} image={item.image1}/>
           ))
          }

         </div>
    </div>

    </div>
  )
}

export default Collections
