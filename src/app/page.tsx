'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import modifyURL from '@/utils/modifyUrl';
import getVariantImage from '@/utils/getVariantImage';
import getCollectionCode from '@/utils/getCollectionCode';

interface rtnProps {
  eyeglasses: any[];
  sunglasses: any[];
}

const Home = () => {
  const [data, setData] = useState<any[]>([]);
  const [collection, setCollection] = useState('CL0');
  const [isLoading, setIsLoading] = useState(false);

  function removeDuplicateObjectsById(arr: any[]): any[] {
    let seen: { [key: string]: boolean } = {};
    let result: any[] = [];
    let len: number = arr.length;
    let j: number = 0;

    for (let i = 0; i < len; i++) {
      let item: any = arr[i];
      // Jika ID belum pernah ditemukan sebelumnya, tambahkan ke hasil
      if (!seen[item.id]) {
        seen[item.id] = true;
        result[j++] = item;
      }
    }

    return result;
  }

  useEffect(() => {
    const fetchData = async () => {

      try {
        let rtn: rtnProps = { eyeglasses: [], sunglasses: [], };

        setIsLoading(true)
        //eyeglasess
        const response = await axios.post('https://beta.api.saturdays.com/api/v1/catalogue/filteredProduct', {
          sort_by: { key: 'new_arrival', order: 'desc' },
          fit: [],
          frame_shape: [],
          material: [],
          color: [],
          face_shape: [],
          gender: [],
          prices: [],
          collection,
          collaborations: [],
          product_category: 1,
          is_special_collaboration: false,
          page: 1,
        });

        if (response.data.data.products.length) {
          const products = response.data.data.products;
          const adaptedResponse = products.flatMap((product: any) => product.variants);
          const allVariantsWithFrameName = adaptedResponse.map((variant: any) => {
            const frame = products.find((product: any) => product.frame_code.includes(variant.sku_code.slice(0, 6)));
            return {
              id: variant.sku_code,
              title: frame.frame_name,
              description: frame.frame_description ? frame.frame_description : frame.frame_name,
              availabilty: 'in stock',
              condition: 'new',
              price: `${variant.retail_price}.00 IDR`,
              link: `https://saturdays.com/product/${variant.product_category === 1 ? 'eyeglasses' : 'sunglasses'}/${modifyURL(frame.frame_name)}/${modifyURL(variant.variant_name)}`,
              image_link: getVariantImage(variant.base_url, variant.images),
              brand: getCollectionCode(frame.collection.collection_code),
              google_product_category: variant.product_category === 1 ? 524 : 178,
              fb_product_category: 388,
              quantity_to_sell_on_facebook: null,
              sale_price: null,
              sale_price_effective_date: null,
              item_group_id: `${frame.frame_name}_${variant.product_category === 1 ? 'Eyeglass' : 'Sunglass'}`,
              gender: frame.gender,
              color: variant.variant_name,
              size: variant.size_label,
              age_group: null,
              material: frame.material,
              pattern: null,
              shipping: null,
              shipping_weight: null
            }
          });
          // setData(allVariantsWithFrameName);

          if (response.data.data.pages > 1) {
            let additionalFrames = []
            const pagesLength = response.data.data.pages
            for (let i = 0; i < pagesLength; i++) {
              console.log({ i, pagesLength })
              const responseNew = await axios.post('https://beta.api.saturdays.com/api/v1/catalogue/filteredProduct', {
                sort_by: { key: 'new_arrival', order: 'desc' },
                fit: [],
                frame_shape: [],
                material: [],
                color: [],
                face_shape: [],
                gender: [],
                prices: [],
                collection,
                collaborations: [],
                product_category: 1,
                is_special_collaboration: false,
                page: i + 1,
              });

              const productsNew = responseNew.data.data.products;
              const adaptedResponseNew = productsNew.flatMap((product: any) => product.variants);
              const allVariantsWithFrameNameNew = adaptedResponseNew.map((variant: any) => {
                const frameNew = productsNew.find((product: any) => product.frame_code.includes(variant.sku_code.slice(0, 6)));
                return {
                  id: variant.sku_code,
                  title: frameNew.frame_name,
                  description: frameNew.frame_description ? frameNew.frame_description : frameNew.frame_name,
                  availabilty: 'in stock',
                  condition: 'new',
                  price: `${variant.retail_price}.00 IDR`,
                  link: `https://saturdays.com/product/${variant.product_category === 1 ? 'eyeglasses' : 'sunglasses'}/${modifyURL(frameNew.frame_name)}/${modifyURL(variant.variant_name)}`,
                  image_link: getVariantImage(variant.base_url, variant.images),
                  brand: getCollectionCode(frameNew.collection.collection_code),
                  google_product_category: variant.product_category === 1 ? 524 : 178,
                  fb_product_category: 388,
                  quantity_to_sell_on_facebook: null,
                  sale_price: null,
                  sale_price_effective_date: null,
                  item_group_id: `${frameNew.frame_name}_${variant.product_category === 1 ? 'Eyeglass' : 'Sunglass'}`,
                  gender: frameNew.gender,
                  color: variant.variant_name,
                  size: variant.size_label,
                  age_group: null,
                  material: frameNew.material,
                  pattern: null,
                  shipping: null,
                  shipping_weight: null
                }
              });
              console.log({ allVariantsWithFrameNameNew })
              additionalFrames.push(...allVariantsWithFrameNameNew)

            }
            rtn.eyeglasses.push(...additionalFrames)
            // setData(additionalFrames)
            // console.log({ additionalFrames })
          } else {
            rtn.eyeglasses.push(...allVariantsWithFrameName);
          }
        }
        //end of eyeglasses

        const sunglassesResponse = await axios.post('https://beta.api.saturdays.com/api/v1/catalogue/filteredProduct', {
          sort_by: { key: 'new_arrival', order: 'desc' },
          fit: [],
          frame_shape: [],
          material: [],
          color: [],
          face_shape: [],
          gender: [],
          prices: [],
          collection,
          collaborations: [],
          product_category: 2,
          is_special_collaboration: false,
          page: 1,
        });

        if (sunglassesResponse.data.data.products.length) {
          const products = sunglassesResponse.data.data.products;
          const adaptedResponse = products.flatMap((product: any) => product.variants);
          const allVariantsWithFrameName = adaptedResponse.map((variant: any) => {
            const frame = products.find((product: any) => product.frame_code.includes(variant.sku_code.slice(0, 6)));
            return {
              id: variant.sku_code,
              title: frame.frame_name,
              description: frame.frame_description ? frame.frame_description : frame.frame_name,
              availabilty: 'in stock',
              condition: 'new',
              price: `${variant.retail_price}.00 IDR`,
              link: `https://saturdays.com/product/${variant.product_category === 1 ? 'eyeglasses' : 'sunglasses'}/${modifyURL(frame.frame_name)}/${modifyURL(variant.variant_name)}`,
              image_link: getVariantImage(variant.base_url, variant.images),
              brand: getCollectionCode(frame.collection.collection_code),
              google_product_category: variant.product_category === 1 ? 524 : 178,
              fb_product_category: 388,
              quantity_to_sell_on_facebook: null,
              sale_price: null,
              sale_price_effective_date: null,
              item_group_id: `${frame.frame_name}_${variant.product_category === 1 ? 'Eyeglass' : 'Sunglass'}`,
              gender: frame.gender,
              color: variant.variant_name,
              size: variant.size_label,
              age_group: null,
              material: frame.material,
              pattern: null,
              shipping: null,
              shipping_weight: null
            }
          });
          // setData(allVariantsWithFrameName);

          if (sunglassesResponse.data.data.pages > 1) {
            let additionalFrames = []
            const pagesLength = sunglassesResponse.data.data.pages
            for (let i = 0; i < pagesLength; i++) {
              console.log({ i, pagesLength })
              const responseNew = await axios.post('https://beta.api.saturdays.com/api/v1/catalogue/filteredProduct', {
                sort_by: { key: 'new_arrival', order: 'desc' },
                fit: [],
                frame_shape: [],
                material: [],
                color: [],
                face_shape: [],
                gender: [],
                prices: [],
                collection,
                collaborations: [],
                product_category: 2,
                is_special_collaboration: false,
                page: i + 1,
              });

              const productsNew = responseNew.data.data.products;
              const adaptedResponseNew = productsNew.flatMap((product: any) => product.variants);
              const allVariantsWithFrameNameNew = adaptedResponseNew.map((variant: any) => {
                const frameNew = productsNew.find((product: any) => product.frame_code.includes(variant.sku_code.slice(0, 6)));
                return {
                  id: variant.sku_code,
                  title: frameNew.frame_name,
                  description: frameNew.frame_description ? frameNew.frame_description : frameNew.frame_name,
                  availabilty: 'in stock',
                  condition: 'new',
                  price: `${variant.retail_price}.00 IDR`,
                  link: `https://saturdays.com/product/${variant.product_category === 1 ? 'eyeglasses' : 'sunglasses'}/${modifyURL(frameNew.frame_name)}/${modifyURL(variant.variant_name)}`,
                  image_link: getVariantImage(variant.base_url, variant.images),
                  brand: getCollectionCode(frameNew.collection.collection_code),
                  google_product_category: variant.product_category === 1 ? 524 : 178,
                  fb_product_category: 388,
                  quantity_to_sell_on_facebook: null,
                  sale_price: null,
                  sale_price_effective_date: null,
                  item_group_id: `${frameNew.frame_name}_${variant.product_category === 1 ? 'Eyeglass' : 'Sunglass'}`,
                  gender: frameNew.gender,
                  color: variant.variant_name,
                  size: variant.size_label,
                  age_group: null,
                  material: frameNew.material,
                  pattern: null,
                  shipping: null,
                  shipping_weight: null
                }
              });
              console.log({ allVariantsWithFrameNameNew })
              additionalFrames.push(...allVariantsWithFrameNameNew)

            }
            rtn.sunglasses.push(...additionalFrames)
            // setData(additionalFrames)
            // console.log({ additionalFrames })
          } else {
            rtn.sunglasses.push(...allVariantsWithFrameName);
          }
        }


        setIsLoading(false)

        console.log({ rtn, lengthEye: rtn.eyeglasses.length, lengthSun: rtn.sunglasses.length })
        setData(removeDuplicateObjectsById([...rtn.eyeglasses, ...rtn.sunglasses]))

      } catch (error) {
        setIsLoading(false);
        console.error('Error:', error);
      }
    };
    fetchData();
  }, [collection]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${collection}.xlsx`);
  };

  return (
    <div className='p-4'>
      <h1>Convert Data from server to Meta Pixel</h1>
      <div className=' py-2 flex space-x-4'>
        <div>
          <select className='bg-blue-900 text-white px-3 py-2 rounded-md' onChange={((e) => setCollection(e.target.value))}>
            <option value="CL0">Classic</option>
            <option value="CL1">Vibe</option>
            <option value="CL2">Junior</option>
            <option value='CL3'>Active</option>
          </select>
        </div>

      </div>
      <div className='m-0 font-bold'>
        {isLoading ? <h1>Counting...</h1> : <h1>We found {data.length} frames</h1>}
      </div>
      <div className='py-4'>
        {isLoading ? <button>Loading...</button> : <button className='bg-blue-400 text-white px-3 py-2 rounded-md' onClick={exportToExcel}>export {data.length} frames to excel</button>}
      </div>
      {/* <div className='py-2'>
        <button className='bg-blue-400 text-white px-3 py-2 rounded-md' onClick={exportToExcel}>export ALL frames to excel</button>
      </div> */}
    </div>
  )
}

export default Home