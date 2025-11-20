'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import modifyURL from '@/utils/modifyUrl';
import getVariantImage from '@/utils/getVariantImage';
import getCollectionCode from '@/utils/getCollectionCode';
import { Container, Row, Col, Card, Button, Form, Spinner, Badge } from 'react-bootstrap';

interface rtnProps {
  eyeglasses: any[];
  sunglasses: any[];
}

const Home = () => {
  const [data, setData] = useState<any[]>([]);
  const [collection, setCollection] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to convert string to Pascal Case
  const toPascalCase = (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  };

  // Helper function to fetch products
  const fetchProducts = async (productCategory: number, isBlueLight: boolean, collectionCode?: string) => {
    const payload: any = {
      sort_by: { key: 'new_arrival', order: 'desc' },
      fit: [],
      frame_shape: [],
      material: [],
      color: [],
      face_shape: [],
      gender: [],
      prices: [],
      collaborations: [],
      product_category: productCategory,
      is_special_collaboration: false,
      is_blue_light: isBlueLight,
      page: 1,
    };

    // Add collection parameter if provided
    if (collectionCode) {
      payload.collection = collectionCode;
    }

    const response = await axios.post('https://beta.api.saturdays.com/api/v1/catalogue/filteredProduct', payload);

    let allProducts: any[] = [];

    if (response.data.data.products.length) {
      const products = response.data.data.products;
      const adaptedResponse = products.flatMap((product: any) => product.variants);
      const allVariantsWithFrameName = adaptedResponse.map((variant: any) => {
        const frame = products.find((product: any) => product.frame_code.includes(variant.sku_code.slice(0, 6)));
        let description = frame.frame_description &&
          frame.frame_description.trim() !== '' &&
          frame.frame_description.trim() !== '-' &&
          frame.frame_description.trim() !== '0' &&
          frame.frame_description.trim().toUpperCase() !== '[NULL]'
          ? frame.frame_description
          : frame.frame_name;

        // Extract only first sentence if description is long
        if (description !== frame.frame_name && description.includes('\n')) {
          // Get first line or sentence before newline
          description = description.split('\n')[0].trim();
        }

        return {
          id: variant.sku_code,
          title: toPascalCase(frame.frame_name),
          description: description,
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

      allProducts.push(...allVariantsWithFrameName);

      // Handle pagination
      if (response.data.data.pages > 1) {
        const pagesLength = response.data.data.pages;
        for (let i = 0; i < pagesLength; i++) {
          const paginationPayload: any = {
            sort_by: { key: 'new_arrival', order: 'desc' },
            fit: [],
            frame_shape: [],
            material: [],
            color: [],
            face_shape: [],
            gender: [],
            prices: [],
            collaborations: [],
            product_category: productCategory,
            is_special_collaboration: false,
            is_blue_light: isBlueLight,
            page: i + 1,
          };

          // Add collection parameter if provided
          if (collectionCode) {
            paginationPayload.collection = collectionCode;
          }

          const responseNew = await axios.post('https://beta.api.saturdays.com/api/v1/catalogue/filteredProduct', paginationPayload);

          const productsNew = responseNew.data.data.products;
          const adaptedResponseNew = productsNew.flatMap((product: any) => product.variants);
          const allVariantsWithFrameNameNew = adaptedResponseNew.map((variant: any) => {
            const frameNew = productsNew.find((product: any) => product.frame_code.includes(variant.sku_code.slice(0, 6)));
            let description = frameNew.frame_description &&
              frameNew.frame_description.trim() !== '' &&
              frameNew.frame_description.trim() !== '-' &&
              frameNew.frame_description.trim() !== '0' &&
              frameNew.frame_description.trim().toUpperCase() !== '[NULL]'
              ? frameNew.frame_description
              : frameNew.frame_name;

            // Extract only first sentence if description is long
            if (description !== frameNew.frame_name && description.includes('\n')) {
              // Get first line or sentence before newline
              description = description.split('\n')[0].trim();
            }

            return {
              id: variant.sku_code,
              title: toPascalCase(frameNew.frame_name),
              description: description,
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
          allProducts.push(...allVariantsWithFrameNameNew);
        }
      }
    }

    return allProducts;
  };

  function removeDuplicateObjectsById(arr: any[]): any[] {
    let seen: { [key: string]: boolean } = {};
    let result: any[] = [];
    let len: number = arr.length;
    let j: number = 0;

    for (let i = 0; i < len; i++) {
      let item: any = arr[i];
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
        let rtn: rtnProps = { eyeglasses: [], sunglasses: [] };
        setIsLoading(true);

        if (collection === 'ALL') {
          // For ALL, send empty string as collection
          const eyeglasses = await fetchProducts(1, false, '');
          rtn.eyeglasses.push(...eyeglasses);

          const sunglasses = await fetchProducts(2, false, '');
          rtn.sunglasses.push(...sunglasses);
        } else if (collection === 'CL4') {
          // For CL4, fetch both is_blue_light false and true
          const eyeglassesFalse = await fetchProducts(1, false, collection);
          rtn.eyeglasses.push(...eyeglassesFalse);

          const eyeglassesTrue = await fetchProducts(1, true, collection);
          rtn.eyeglasses.push(...eyeglassesTrue);

          const sunglassesFalse = await fetchProducts(2, false, collection);
          rtn.sunglasses.push(...sunglassesFalse);

          const sunglassesTrue = await fetchProducts(2, true, collection);
          rtn.sunglasses.push(...sunglassesTrue);
        } else {
          // For other collections, fetch with is_blue_light: false only
          const eyeglasses = await fetchProducts(1, false, collection);
          rtn.eyeglasses.push(...eyeglasses);

          const sunglasses = await fetchProducts(2, false, collection);
          rtn.sunglasses.push(...sunglasses);
        }

        setIsLoading(false);
        console.log({ rtn, lengthEye: rtn.eyeglasses.length, lengthSun: rtn.sunglasses.length });
        setData(removeDuplicateObjectsById([...rtn.eyeglasses, ...rtn.sunglasses]));
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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      paddingTop: '3rem',
      paddingBottom: '3rem'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={7} md={9}>
            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="fw-bold mb-2" style={{ color: '#000', fontSize: '1.75rem' }}>
                Instagram Shop Adapter
              </h1>
              <p className="mb-0" style={{ color: '#6c757d', fontSize: '0.95rem' }}>
                Convert product data to Instagram Shop format
              </p>
            </div>

            {/* Main Card */}
            <Card className="border-0 shadow-sm" style={{ borderRadius: '8px' }}>
              <Card.Body className="p-4">
                {/* Collection Selector */}
                <div className="mb-3">
                  <Form.Label className="mb-2" style={{ fontSize: '0.9rem', color: '#000', fontWeight: '500' }}>
                    Select Collection
                  </Form.Label>
                  <div className="d-flex gap-2 flex-wrap">
                    <Button
                      onClick={() => setCollection('ALL')}
                      disabled={isLoading}
                      style={{
                        backgroundColor: collection === 'ALL' ? 'rgba(19, 59, 100, 1)' : '#fff',
                        color: collection === 'ALL' ? '#fff' : '#000',
                        border: '1px solid #dee2e6',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    >
                      All
                    </Button>
                    <Button
                      onClick={() => setCollection('CL0')}
                      disabled={isLoading}
                      style={{
                        backgroundColor: collection === 'CL0' ? 'rgba(19, 59, 100, 1)' : '#fff',
                        color: collection === 'CL0' ? '#fff' : '#000',
                        border: '1px solid #dee2e6',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    >
                      Classic
                    </Button>
                    <Button
                      onClick={() => setCollection('CL1')}
                      disabled={isLoading}
                      style={{
                        backgroundColor: collection === 'CL1' ? 'rgba(19, 59, 100, 1)' : '#fff',
                        color: collection === 'CL1' ? '#fff' : '#000',
                        border: '1px solid #dee2e6',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    >
                      Vibe
                    </Button>
                    <Button
                      onClick={() => setCollection('CL2')}
                      disabled={isLoading}
                      style={{
                        backgroundColor: collection === 'CL2' ? 'rgba(19, 59, 100, 1)' : '#fff',
                        color: collection === 'CL2' ? '#fff' : '#000',
                        border: '1px solid #dee2e6',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    >
                      Junior
                    </Button>
                    <Button
                      onClick={() => setCollection('CL3')}
                      disabled={isLoading}
                      style={{
                        backgroundColor: collection === 'CL3' ? 'rgba(19, 59, 100, 1)' : '#fff',
                        color: collection === 'CL3' ? '#fff' : '#000',
                        border: '1px solid #dee2e6',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    >
                      Active
                    </Button>
                    <Button
                      onClick={() => setCollection('CL4')}
                      disabled={isLoading}
                      style={{
                        backgroundColor: collection === 'CL4' ? 'rgba(19, 59, 100, 1)' : '#fff',
                        color: collection === 'CL4' ? '#fff' : '#000',
                        border: '1px solid #dee2e6',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    >
                      Blitz
                    </Button>
                  </div>
                </div>

                {/* Status */}
                <div className="mb-3 p-3" style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef'
                }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      {isLoading ? (
                        <div className="d-flex align-items-center">
                          <Spinner
                            animation="border"
                            size="sm"
                            style={{ color: 'rgba(19, 59, 100, 1)' }}
                            className="me-2"
                          />
                          <span style={{ color: '#000', fontSize: '0.9rem' }}>Processing...</span>
                        </div>
                      ) : (
                        <span style={{ color: '#000', fontSize: '0.9rem', fontWeight: '500' }}>
                          {data.length} frames found
                        </span>
                      )}
                    </div>
                    <Badge
                      style={{
                        backgroundColor: 'rgba(19, 59, 100, 1)',
                        fontSize: '0.85rem',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontWeight: '500'
                      }}
                    >
                      {isLoading ? '...' : data.length}
                    </Badge>
                  </div>
                </div>

                {/* Export Button */}
                <div className="text-center">
                  <Button
                    onClick={exportToExcel}
                    disabled={isLoading || data.length === 0}
                    style={{
                      backgroundColor: 'rgba(19, 59, 100, 1)',
                      border: 'none',
                      borderRadius: '25px',
                      padding: '12px 40px',
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      color: '#fff',
                      minWidth: '150px'
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Loading...
                      </>
                    ) : (
                      <>Export to Excel</>
                    )}
                  </Button>
                </div>

                {/* Info Text */}
                {!isLoading && data.length > 0 && (
                  <div className="text-center mt-3">
                    <small style={{ color: '#6c757d', fontSize: '0.85rem' }}>
                      File will be saved as <strong style={{ color: '#000' }}>{collection}.xlsx</strong>
                    </small>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;